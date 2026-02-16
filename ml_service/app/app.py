from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify, Response
from flask_mail import Mail, Message
import pandas as pd
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os
import sys
import datetime
from dotenv import load_dotenv

# Load Environment Variables
APP_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(APP_DIR, '.env'))
import time
import random
import uuid
import cv2
import numpy as np
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.lib import colors
import io

app = Flask(__name__)
CORS(app) 
app.secret_key = os.getenv('SECRET_KEY', 'super_secret_key_for_anpr_system')

# Gmail SMTP Configuration
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 465))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'False') == 'True'
app.config['MAIL_USE_SSL'] = os.getenv('MAIL_USE_SSL', 'True') == 'True'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')

mail = Mail(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Paths
UPLOAD_FOLDER = os.path.join(APP_DIR, 'static', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --- MongoDB Setup ---
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
DB_NAME = os.getenv('DATABASE_NAME', 'echallan_system')
mongo_client = MongoClient(MONGO_URI)
db = mongo_client[DB_NAME]

# Collections
officials_col = db['officials']
captures_col = db['captures']
challans_col = db['challans']

# --- Module Integration ---
sys.path.append(os.path.abspath(os.path.join(APP_DIR, '..')))
_model = None
_reader = None

def get_yolo_model():
    global _model
    if _model is None:
        from ultralytics import YOLO
        MODEL_PATH = os.path.join(APP_DIR, '..', 'module1_plate_detection', 'models', 'plate_yolo.pt')
        _model = YOLO(MODEL_PATH)
    return _model

def get_ocr_reader():
    global _reader
    if _reader is None:
        import easyocr
        _reader = easyocr.Reader(['en'], gpu=False)
    return _reader

def detect_plate_from_image(image, draw_boxes=True):
    model = get_yolo_model()
    reader = get_ocr_reader()
    if isinstance(image, str): frame = cv2.imread(image)
    else: frame = image.copy()
    if frame is None: return None, 0.0, None, None, None

    results = model(frame, verbose=False)
    best_text, best_conf, best_crop, best_box = None, 0.0, None, None

    for result in results:
        for box in result.boxes.cpu().numpy():
            x1, y1, x2, y2 = box.xyxy[0].astype(int)
            conf = float(box.conf[0])
            if conf > 0.3:
                h, w = frame.shape[:2]
                plate_crop = frame[max(0, y1):min(h, y2), max(0, x1):min(w, x2)]
                if plate_crop.size > 0:
                    gray = cv2.cvtColor(plate_crop, cv2.COLOR_BGR2GRAY)
                    ocr = reader.readtext(gray, detail=0)
                    if ocr:
                        text = ''.join(c for c in "".join(ocr).upper() if c.isalnum())
                        if len(text) >= 4 and conf > best_conf:
                            best_text, best_conf, best_crop, best_box = text, conf, plate_crop, (x1, y1, x2, y2)
                if draw_boxes: cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 3)

    if best_text and draw_boxes and best_box:
        x1, y1, x2, y2 = best_box
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 165, 255), 2)
        overlay = frame.copy()
        cv2.rectangle(overlay, (0, 0), (frame.shape[1], 80), (0, 0, 0), -1)
        frame = cv2.addWeighted(overlay, 0.7, frame, 0.3, 0)
        ts = datetime.datetime.now().strftime('%d-%m-%Y %H:%M:%S')
        cv2.putText(frame, f"VEHICLE: {best_text}", (20, 30), cv2.FONT_HERSHEY_DUPLEX, 0.8, (255, 255, 255), 1)
        cv2.putText(frame, f"DATE: {ts}", (20, 60), cv2.FONT_HERSHEY_DUPLEX, 0.6, (200, 200, 200), 1)
        cv2.putText(frame, "ECR TRAFFIC SYSTEM | DELHI ZONE 04", (frame.shape[1]-400, 45), cv2.FONT_HERSHEY_DUPLEX, 0.6, (0, 165, 255), 1)

    return best_text, best_conf, frame, best_crop, best_box

# --- CSV Dataset ---
CSV_PATH = os.path.join(APP_DIR, 'indian_vehicle_dataset.csv')
try:
    vehicle_df = pd.read_csv(CSV_PATH)
    vehicle_df.columns = [c.strip() for c in vehicle_df.columns]
    if 'Registration_Number' in vehicle_df.columns:
        vehicle_df['_plate_normalized'] = vehicle_df['Registration_Number'].astype(str).str.replace(" ", "").str.upper()
except Exception as e:
    vehicle_df = pd.DataFrame()

def validate_vehicle_in_csv(plate_text):
    if vehicle_df.empty: return None
    plate_clean = plate_text.replace(" ", "").upper()
    match = vehicle_df[vehicle_df['_plate_normalized'] == plate_clean]
    if not match.empty:
        row = match.iloc[0].to_dict()
        today = datetime.datetime.now().date()
        total_fine = 0
        violations = []
        def check_expiry(date_str, name, fine):
            nonlocal total_fine
            if not date_str or str(date_str).lower() == 'nan':
                total_fine += fine
                violations.append(f"Expired/Missing {name}")
                return "Expired"
            try:
                exp = datetime.datetime.strptime(str(date_str).strip(), '%Y-%m-%d').date()
                if exp < today:
                    total_fine += fine
                    violations.append(f"Expired {name}")
                    return "Expired"
                return "Valid"
            except: return "Unknown"

        rc_status = check_expiry(row.get('Fitness_Expiry'), 'RC', 5000)
        ins_status = check_expiry(row.get('Insurance_Expiry'), 'Insurance', 2000)
        puc_status = check_expiry(row.get('PUC_Expiry'), 'PUC', 10000)
        v_class = str(row.get('Vehicle_Class', '')).lower()
        is_comm = any(x in v_class for x in ['commercial', 'transport', 'goods', 'truck', 'taxi'])
        fit_status = check_expiry(row.get('Fitness_Expiry'), 'Fitness', 5000) if is_comm else "N/A"
        per_status = check_expiry(row.get('Permit_Expiry'), 'Permit', 5000) if is_comm else "N/A"
        tax_status = check_expiry(row.get('Road_Tax_Expiry'), 'Tax', 2000)

        def clean(val): return "N/A" if pd.isna(val) or str(val).lower() == 'nan' else str(val)

        return {
            'plate_number': clean(row.get('Registration_Number')),
            'owner_name': clean(row.get('Owner_Name')),
            'owner_email': clean(row.get('Owner_Email')),
            'vehicle_type': clean(row.get('Vehicle_Class')),
            'make_model': f"{clean(row.get('Make'))} {clean(row.get('Model'))}",
            'fuel_type': clean(row.get('Fuel_Type')),
            'rc_status': rc_status,
            'insurance_status': ins_status,
            'puc_status': puc_status,
            'fitness_status': fit_status,
            'permit_status': per_status,
            'tax_status': tax_status,
            'violations': violations,
            'total_fine': total_fine,
            'raw_data': {k: clean(v) for k, v in row.items()}
        }
    return None

# --- Auth Mock ---
class current_user:
    id = "1"
    name = "Rajesh Kumar"
    official_id = "OFF001"
    role = "admin"

@app.context_processor
def inject_now(): return {'datetime': datetime, 'current_user': current_user}

def init_db():
    if officials_col.count_documents({}) == 0:
        officials_col.insert_many([
            {"_id": "1", "username": "officer1", "password_hash": generate_password_hash("pass123"), "name": "Rajesh Kumar", "official_id": "OFF001", "role": "officer"},
            {"_id": "2", "username": "admin", "password_hash": generate_password_hash("admin123"), "name": "Admin User", "official_id": "ADM001", "role": "admin"}
        ])
    print("Database Initialized (MongoDB)")

def format_currency(value): return "₹{:,.2f}".format(float(value)) if value else "₹0.00"
app.jinja_env.filters['currency'] = format_currency

# --- Routes ---
@app.route('/api/health')
def health_check():
    return jsonify({'status': 'ok', 'timestamp': datetime.datetime.now().isoformat()})

@app.route('/')
def index_redirect(): return redirect(url_for('dashboard'))

@app.route('/dashboard')
def dashboard():
    stats = {
        'total': challans_col.count_documents({}),
        'pending': challans_col.count_documents({"status": {"$in": ["Pending", "Unpaid"]}}),
        'paid': challans_col.count_documents({"status": "Paid"}),
        'revenue': list(challans_col.aggregate([{"$match": {"status": "Paid"}}, {"$group": {"_id": None, "t": {"$sum": "$fine_amount"}}}]))
    }
    stats['revenue'] = stats['revenue'][0]['t'] if stats['revenue'] else 0
    recent = list(challans_col.find().sort("issue_timestamp", -1).limit(10))
    return render_template('dashboard.html', stats=stats, recent_challans=recent)

@app.route('/dashboard_stats')
def dashboard_stats():
    rev_res = list(challans_col.aggregate([{"$match": {"status": "Paid"}}, {"$group": {"_id": None, "t": {"$sum": "$fine_amount"}}}]))
    unp_res = list(challans_col.aggregate([{"$match": {"status": {"$in": ["Pending", "Unpaid"]}}}, {"$group": {"_id": None, "t": {"$sum": "$fine_amount"}}}]))
    v_types = list(challans_col.aggregate([{"$group": {"_id": "$violation_type", "c": {"$sum": 1}}}]))
    
    counts = {'Expired Insurance': 0, 'Expired PUC': 0, 'Expired RC': 0, 'Expired Fitness': 0, 'No Permit': 0, 'Unpaid Tax': 0}
    for r in v_types:
        vt = str(r['_id'])
        if 'Insurance' in vt: counts['Expired Insurance'] += r['c']
        if 'PUC' in vt: counts['Expired PUC'] += r['c']
        if 'RC' in vt: counts['Expired RC'] += r['c']
        if 'Fitness' in vt: counts['Expired Fitness'] += r['c']
        if 'Permit' in vt: counts['No Permit'] += r['c']
        if 'Tax' in vt: counts['Unpaid Tax'] += r['c']

    thirty_days_ago = datetime.datetime.now() - datetime.timedelta(days=30)
    recent = list(challans_col.find({"issue_timestamp": {"$gte": thirty_days_ago}}).sort("issue_timestamp", -1))
    recent_list = []
    for d in recent:
        recent_list.append({
            'id': d.get('challan_id'),
            'plate': d.get('plate_number'),
            'type': d.get('violation_type'),
            'amount': d.get('fine_amount'),
            'status': d.get('status'),
            'date': d.get('issue_timestamp').strftime('%d %b %Y | %I:%M %p'),
            'image_path': d.get('proof_image_path', '')
        })

    return jsonify({
        'totalRevenue': rev_res[0]['t'] if rev_res else 0,
        'totalUnpaid': unp_res[0]['t'] if unp_res else 0,
        'violationCounts': counts,
        'recentChallans': recent_list
    })

@app.route('/api/challan/<string:id>')
def get_challan_api(id):
    d = challans_col.find_one({"challan_id": id})
    if d:
        d['_id'] = str(d['_id'])
        d['issue_timestamp'] = d['issue_timestamp'].strftime('%Y-%m-%d %H:%M:%S')
        return jsonify(d)
    return jsonify({'error': 'Not found'}), 404

@app.route('/api/challans/search_vehicle/<string:plate>')
def search_challans_by_vehicle(plate):
    plate = plate.upper()
    # Find all pending challans for this plate
    challans = list(challans_col.find({"plate_number": plate, "status": "Pending"}).sort("issue_timestamp", -1))
    for c in challans:
        c['_id'] = str(c['_id'])
        c['issue_timestamp'] = c['issue_timestamp'].strftime('%Y-%m-%d %H:%M:%S')
    return jsonify(challans)

@app.route('/api/pay_challan/<string:id>', methods=['POST'])
def pay_challan_api(id):
    challans_col.update_one({"challan_id": id}, {"$set": {"status": "Paid"}})
    return jsonify({'success': True})

@app.route('/api/recent_captures')
def recent_captures():
    rows = list(captures_col.find().sort("timestamp", -1).limit(50))
    for r in rows:
        r['_id'] = str(r['_id'])
        r['timestamp'] = r['timestamp'].strftime('%Y-%m-%d %H:%M:%S')
    return jsonify(rows)

@app.route('/generate_challan', methods=['POST'])
def generate_manual_challan():
    data = request.form
    plate = data.get('plate_number', '').upper()
    cid = f"ECH-{uuid.uuid4().hex[:8].upper()}"
    
    # Try to fetch owner info for emailing
    veh = validate_vehicle_in_csv(plate)
    owner_name = data.get('owner_name') or (veh['owner_name'] if veh else 'Unknown')
    fine = float(data.get('amount', 0))
    violation = data.get('violation', 'Manual Entry')

    off_id = data.get('official_id', 'SYSTEM')
    off_name = data.get('official_name', 'Manual Entry')

    challans_col.insert_one({
        "challan_id": cid,
        "plate_number": plate,
        "owner_name": owner_name,
        "issue_timestamp": datetime.datetime.now(),
        "violation_type": violation,
        "fine_amount": fine,
        "status": "Pending",
        "official_id": off_id,
        "official_name": off_name
    })

    # Notify via email if owner email exists in dataset
    if veh and veh.get('owner_email') and veh['owner_email'] != 'N/A':
        send_echallan_email(veh['owner_email'], cid, plate, violation, fine)

    return jsonify({'success': True, 'challan_id': cid})

def send_echallan_email(recipient_email, challan_id, plate, violation, amount):
    print(f"Preparing official email for {recipient_email}...")
    
    # 1. Fetch data for PDF
    d = challans_col.find_one({"challan_id": challan_id})
    if not d:
         d = {
            'challan_id': challan_id, 'plate_number': plate, 'owner_name': 'Vehicle Owner',
            'violation_type': violation, 'fine_amount': amount, 'issue_timestamp': datetime.datetime.now(),
            'location': 'DELHI ZONE 04', 'status': 'Pending'
         }
    
    # 2. Generate PDF using helper
    pdf_buffer = create_challan_pdf(d)
    
    # 3. Create Email
    msg = Message(subject=f"OFFICIAL E-CHALLAN: {plate} - Action Required", recipients=[recipient_email])
    
    msg.html = f"""
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1a202c; padding: 20px; text-align: center;">
            <h2 style="color: #fff; margin: 0;">OFFICIAL TRAFFIC VIOLATION NOTICE</h2>
            <p style="color: #cbd5e1; margin: 5px 0 0;">Ministry of Road Transport & Highways</p>
        </div>
        
        <div style="padding: 30px; background-color: #fff;">
            <p><strong>Dear Vehicle Owner,</strong></p>
            <p>This is an official notification regarding a traffic violation recorded against your vehicle.</p>
            
            <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #be123c; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Vehicle No:</strong> {plate}</p>
                <p style="margin: 5px 0;"><strong>Challan ID:</strong> {challan_id}</p>
                <p style="margin: 5px 0;"><strong>Violation:</strong> {violation}</p>
                <p style="margin: 5px 0;"><strong>Fine Amount:</strong> <span style="color: #be123c; font-weight: bold;">₹{amount}</span></p>
            </div>
            
            <p>A digital copy of the challan is attached to this email. Please review the details carefully.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/pay-challan" style="background-color: #be123c; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">PAY FINE NOW</a>
            </div>
            
            <p style="font-size: 12px; color: #64748b;">
                Failure to pay the fine within the stipulated time may attract further legal action/late fees.<br>
                This is a system-generated email.
            </p>
        </div>
        
        <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 11px; color: #94a3b8;">
            &copy; 2026 ECR Enforcement Network. All rights reserved.
        </div>
    </div>
    """
    
    # 4. Attach PDF
    msg.attach(f"Challan_{challan_id}.pdf", "application/pdf", pdf_buffer.getvalue())
    
    mail.send(msg)
    print("Official email with PDF sent successfully.")

def _auto_generate_live_challan(plate, proof_path):
    veh = validate_vehicle_in_csv(plate)
    if not veh or not veh.get('violations'): return
    v_str = ", ".join(veh['violations'])
    cid = f"ECH-{uuid.uuid4().hex[:6].upper()}"
    
    # New Naming Convention: PLATE_TIMESTAMP.jpg
    ts_str = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    new_filename = f"{plate}_{ts_str}_proof.jpg"
    new_path = os.path.join(UPLOAD_FOLDER, new_filename)
    
    # Rename original proof if it exists
    old_full_path = os.path.join(APP_DIR, proof_path.lstrip('/'))
    if os.path.exists(old_full_path):
        os.rename(old_full_path, new_path)
        proof_path = f"/static/uploads/{new_filename}"

    challans_col.insert_one({
        "challan_id": cid, "plate_number": plate, "owner_name": veh['owner_name'],
        "issue_timestamp": datetime.datetime.now(), "violation_type": v_str,
        "fine_amount": float(veh['total_fine']), "status": "Pending",
        "official_id": "SYSTEM", "official_name": "AI Camera", "proof_image_path": proof_path,
        "location": "DELHI ZONE 04 - TECH PARK" # Mock Geotag
    })
    if veh.get('owner_email') and veh['owner_email'] != 'N/A':
        send_echallan_email(veh['owner_email'], cid, plate, v_str, veh['total_fine'])

@app.route('/video_feed')
def video_feed():
    def gen():
        camera = cv2.VideoCapture(0)
        last_d = 0
        latest_text = ""
        while True:
            success, frame = camera.read()
            if not success: break
            if time.time() - last_d > 1.5:
                last_d = time.time()
                text, conf, proc, crop, box = detect_plate_from_image(frame)
                if text and text != latest_text:
                    latest_text = text
                    u_code = uuid.uuid4().hex[:6].upper()
                    proof_p = os.path.join(UPLOAD_FOLDER, f"{u_code}_proof.jpg")
                    cv2.imwrite(proof_p, proc if proc is not None else frame)
                    captures_col.insert_one({"timestamp": datetime.datetime.now(), "plate_number": text, "confidence": float(conf), "image_path": f"/static/uploads/{u_code}_proof.jpg"})
                    socketio.emit('plate_detected', {'plate': text, 'confidence': round(conf*100,1)})
                    _auto_generate_live_challan(text, f"/static/uploads/{u_code}_proof.jpg")
            ret, buffer = cv2.imencode('.jpg', frame)
            yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
    return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/vehicle/<plate>')
def get_vehicle_details(plate):
    data = validate_vehicle_in_csv(plate)
    return jsonify({'found': True, 'data': data}) if data else jsonify({'found': False})

@app.route('/api/upload_scan', methods=['POST'])
def upload_scan():
    if 'file' not in request.files: return jsonify({'error': 'No file'}), 400
    f = request.files['file']
    ftype = request.form.get('type', 'image')
    
    u_code = uuid.uuid4().hex[:6].upper()
    temp_p = os.path.join(UPLOAD_FOLDER, f"temp_{u_code}_{f.filename}")
    f.save(temp_p)

    try:
        best_text, best_conf, frame, best_crop, _ = None, 0, None, None, None
        all_detections = []

        if ftype == 'video':
            cap = cv2.VideoCapture(temp_p)
            count = 0
            unique_plates = {} # plate -> {conf, frame, crop}
            
            while cap.isOpened():
                ret, fr = cap.read()
                if not ret or count > 450: break # Scan longer (approx 15s)
                if count % 5 == 0:
                    text, conf, proc, crop, box = detect_plate_from_image(fr, draw_boxes=True)
                    if text and conf > 0.4:
                        if text not in unique_plates or conf > unique_plates[text]['conf']:
                             unique_plates[text] = {'conf': conf, 'frame': proc, 'crop': crop}
                count += 1
            cap.release()
            
            # Process findings
            for plt, data in unique_plates.items():
                veh = validate_vehicle_in_csv(plt)
                res_obj = {
                    'plate': plt,
                    'confidence': round(data['conf']*100, 1),
                    'status': 'Unknown',
                    'reason': 'Not in Database'
                }
                
                if veh:
                    if veh.get('violations'):
                        res_obj['status'] = 'Challan Issued'
                        res_obj['reason'] = ", ".join(veh['violations'])
                        # Prioritize showing partial violations
                        if data['conf'] >= best_conf: # Update best if this is valid (or better conf)
                             best_text, best_conf, frame, best_crop = plt, data['conf'], data['frame'], data['crop']
                    else:
                        res_obj['status'] = 'Clean'
                        res_obj['reason'] = 'No Violations'
                
                all_detections.append(res_obj)
            
            # If no challan-able plate found, pick highest confidence one to show
            if not best_text and unique_plates:
                top = max(unique_plates.values(), key=lambda x: x['conf'])
                # Find key
                for k,v in unique_plates.items():
                    if v == top:
                        best_text, best_conf, frame, best_crop = k, v['conf'], v['frame'], v['crop']
                        break

        else:
            best_text, best_conf, frame, best_crop, _ = detect_plate_from_image(temp_p)
        
        # SAVE AND RETURN
        if best_text:
            ts_str = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
            final_filename = f"{best_text}_{ts_str}_proof.jpg"
            final_path = os.path.join(UPLOAD_FOLDER, final_filename)
            cv2.imwrite(final_path, frame if frame is not None else cv2.imread(temp_p))
            
            # Result logic
            veh = validate_vehicle_in_csv(best_text)
            cid = None
            
            off_id = request.form.get('official_id', 'SYSTEM')
            off_name = request.form.get('official_name', 'AI Camera')

            if veh and veh.get('violations'):
                cid = f"ECH-{uuid.uuid4().hex[:8].upper()}"
                v_str = ", ".join(veh['violations'])
                challans_col.insert_one({
                    "challan_id": cid, "plate_number": best_text, "owner_name": veh['owner_name'],
                    "issue_timestamp": datetime.datetime.now(), "violation_type": v_str,
                    "fine_amount": float(veh['total_fine']), "status": "Pending",
                    "official_id": off_id, "official_name": off_name,
                    "proof_image_path": f"/static/uploads/{final_filename}",
                    "location": "DELHI ZONE 04 - MANUAL SCAN"
                })
            
            response_data = {
                'success': True,
                'plate': best_text,
                'confidence': round(best_conf*100, 1),
                'challan_id': cid,
                'violations': veh['violations'] if veh else [],
                'total_fine': veh['total_fine'] if veh else 0,
                'image_url': f"/static/uploads/{final_filename}",
                'all_detections': all_detections # NEW FIELD
            }
            if veh:
                response_data.update({
                    'rc_status': veh.get('rc_status'),
                    'insurance_status': veh.get('insurance_status'),
                    'puc_status': veh.get('puc_status'),
                    'fitness_status': veh.get('fitness_status'),
                    'tax_status': veh.get('tax_status'),
                    'owner_name': veh.get('owner_name')
                })
            return jsonify(response_data)

        # If we found plates but none were clear enough to be "primary", return list anyway
        if all_detections:
             return jsonify({
                 'success': False, 
                 'message': 'Multiple plates detected but no clear violation.',
                 'all_detections': all_detections
             })

        return jsonify({'success': False, 'message': 'Plate not detected clearly'})
    finally:
        if os.path.exists(temp_p):
            os.remove(temp_p)
    return jsonify({'success': False, 'message': 'Plate not detected clearly'})

def create_challan_pdf(d):
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    
    # --- Fine Mapping Helper ---
    def get_fine(v_name):
        v_lower = v_name.lower()
        if 'puc' in v_lower: return 10000
        if 'rc' in v_lower or 'fitness' in v_lower or 'permit' in v_lower: return 5000
        if 'insurance' in v_lower or 'tax' in v_lower: return 2000
        return 500 # Default/Other

    # --- Config ---
    left_m = 50
    right_m = width - 50
    y = height - 50
    
    # --- Header ---
    # Logo (Stylized Text "ECR" to mimic logo if image unavailable)
    p.setFillColorRGB(0.1, 0.1, 0.2)
    p.setFont("Helvetica-Bold", 28)
    p.drawString(left_m, y - 10, "ECR")
    p.setFillColorRGB(0.96, 0.51, 0.12) # Orange accent for dot
    p.circle(left_m + 65, y - 8, 4, fill=1, stroke=0)
    
    p.setFillColor(colors.black)
    p.setFont("Helvetica", 7)
    p.drawString(left_m, y - 22, "ENFORCEMENT NETWORK")

    # Official Title
    p.setFillColor(colors.black)
    p.setFont("Helvetica-Bold", 12)
    p.drawRightString(right_m, y - 5, "E-CHALLAN NOTICE")
    p.setFont("Helvetica", 8)
    p.drawRightString(right_m, y - 18, "MINISTRY OF ROAD TRANSPORT & HIGHWAYS")
    
    ts = d.get('issue_timestamp')
    if hasattr(ts, 'strftime'): ts_str = ts.strftime('%d/%m/%Y %H:%M')
    else: ts_str = str(ts)
    p.drawRightString(right_m, y - 30, f"Date: {ts_str}")

    y -= 45
    p.setStrokeColor(colors.black)
    p.setLineWidth(0.5)
    p.line(left_m, y, right_m, y)
    y -= 25

    # --- Vehicle & Owner Info (Grid) ---
    p.setFont("Helvetica-Bold", 9)
    p.drawString(left_m, y, "VEHICLE DETAILS")
    y -= 15
    
    p.setFont("Helvetica", 9)
    # Row 1
    p.drawString(left_m, y, "Registration No:")
    p.setFont("Helvetica-Bold", 9)
    p.drawString(left_m + 80, y, str(d.get('plate_number', 'N/A')))
    
    p.setFont("Helvetica", 9)
    p.drawString(left_m + 250, y, "Challan ID:")
    p.setFont("Helvetica-Bold", 9)
    p.drawString(left_m + 310, y, str(d.get('challan_id', 'N/A')))
    y -= 15
    
    # Row 2
    p.setFont("Helvetica", 9)
    p.drawString(left_m, y, "Owner Name:")
    p.drawString(left_m + 80, y, str(d.get('owner_name', 'Unknown')))
    
    p.drawString(left_m + 250, y, "Location:")
    p.drawString(left_m + 310, y, str(d.get('location', 'DELHI ZONE 04')))
    y -= 25

    p.line(left_m, y, right_m, y)
    y -= 25

    # --- Violation Table ---
    p.setFont("Helvetica-Bold", 9)
    p.drawString(left_m, y, "VIOLATION BREAKDOWN")
    y -= 15
    
    # Table Header
    p.setFillColorRGB(0.95, 0.95, 0.95)
    p.rect(left_m, y - 5, width - 100, 18, fill=1, stroke=0)
    p.setFillColor(colors.black)
    p.setFont("Helvetica-Bold", 8)
    p.drawString(left_m + 10, y, "DESCRIPTION")
    p.drawString(right_m - 80, y, "AMOUNT (INR)")
    y -= 20

    # Items
    v_str = str(d.get('violation_type', ''))
    violations = [v.strip() for v in v_str.split(',') if v.strip()]
    
    if not violations: violations = ["Traffic Violation"]
    
    total_calc = 0
    p.setFont("Helvetica", 9)
    
    for v in violations:
        charge = get_fine(v)
        total_calc += charge
        p.drawString(left_m + 10, y, v)
        p.drawRightString(right_m - 60, y, f"{charge:.2f}")
        y -= 15
    
    # Divider
    y -= 5
    p.line(left_m + 250, y, right_m - 50, y)
    y -= 15
    
    # Total
    override_total = float(d.get('fine_amount', 0))
    # Use override if available and > 0, else calculated
    final_total = override_total if override_total > 0 else total_calc
    
    p.setFont("Helvetica-Bold", 10)
    p.drawString(left_m + 250, y, "TOTAL PAYABLE AMOUNT")
    p.drawRightString(right_m - 60, y, f"Rs. {final_total:.2f}")
    y -= 40

    # --- Evidence Image (Color) ---
    img_path_rel = d.get('proof_image_path', '')
    if img_path_rel:
        img_full = os.path.join(APP_DIR, img_path_rel.lstrip('/'))
        if os.path.exists(img_full):
            try:
                p.setFont("Helvetica-Bold", 9)
                p.drawString(left_m, y, "EVIDENCE / CAPTURE")
                y -= 10
                img = ImageReader(img_full)
                img_w, img_h = 300, 180
                # Preserve aspect ratio roughly
                p.drawImage(img, left_m, y - img_h, width=img_w, height=img_h, preserveAspectRatio=True)
                # Border
                p.setStrokeColor(colors.black)
                p.rect(left_m, y - img_h, img_w, img_h, fill=0)
                y -= (img_h + 20)
            except: pass

    # --- Footer ---
    p.setFont("Helvetica", 7)
    p.setFillColor(colors.darkgrey)
    p.drawCentredString(width/2, 40, "This is a computer-generated document. No signature is required.")
    p.drawCentredString(width/2, 30, "PROCESSED BY ECR ENFORCEMENT SYSTEM v2.0")

    p.showPage()
    p.save()
    buffer.seek(0)
    return buffer

@app.route('/api/download_challan/<cid>')
def download_challan(cid):
    d = challans_col.find_one({"challan_id": cid})
    if not d: return "Challan not found", 404
    buffer = create_challan_pdf(d)
    return Response(buffer, mimetype='application/pdf', headers={'Content-Disposition': f'attachment; filename=Challan_{cid}.pdf'})

@app.route('/api/send_manual_email', methods=['POST'])
def send_manual_email_api():
    try:
        data = request.json
        if not data: return jsonify({'success': False, 'error': 'No JSON data provided'}), 400
        
        email = data.get('email')
        cid = data.get('challan_id')
        plate = data.get('plate')
        # Handle list vs string for violation
        violation = data.get('violation')
        if isinstance(violation, list):
            violation = ", ".join(violation)
        
        amount = data.get('amount')
        
        if not email or not cid: return jsonify({'success': False, 'error': 'Missing email or challan ID'}), 400
        
        send_echallan_email(email, cid, plate, violation, amount)
        return jsonify({'success': True, 'message': 'Email sent successfully'})
    except Exception as e:
        print(f"SMTP Error: {e}")
        # Return generic error or specific depending on production needs
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    init_db()
    socketio.run(app, debug=True, port=5000)

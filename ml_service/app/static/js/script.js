// SocketIO Setup
let socket;
try {
    socket = io();
} catch (e) {
    console.warn("Socket.IO not loaded. Real-time features disabled.");
}

if (socket) {
    socket.on('connect', () => {
        console.log('Connected to server');
    });

    socket.on('new_detection', (data) => {
        console.log('New Detection:', data);
        updateScanFeed(data);
        updateStats('alert');
    });
}

function updateScanFeed(data) {
    // data expected: { plate_number, camera_id, timestamp, image_url }
    const camId = data.camera_id;
    const plateElement = document.getElementById(`cam${camId}-plate`);
    const timeElement = document.getElementById(`cam${camId}-last-seen`);

    if (plateElement && timeElement) {
        plateElement.innerText = data.plate_number;
        timeElement.innerText = data.timestamp;

        // Flash effect
        plateElement.classList.remove('text-warning');
        plateElement.classList.add('text-danger');
        setTimeout(() => {
            plateElement.classList.remove('text-danger');
            plateElement.classList.add('text-warning');
        }, 2000);
    }
}

function updateStats(type) {
    if (type === 'alert') {
        const el = document.getElementById('total-alerts');
        if (el) {
            let count = parseInt(el.innerText);
            el.innerText = count + 1;
        }
    }
}

// Manual Check Logic
function checkVehicle() {
    const plate = document.getElementById('plateInfo').value;
    if (!plate) {
        alert("Please enter a vehicle number");
        return;
    }

    fetch('/api/check_vehicle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plate_number: plate })
    })
        .then(r => r.json())
        .then(resp => {
            if (resp.found) {
                displayResults(resp.data);
            } else {
                alert(resp.message);
                document.getElementById('resultSection').classList.add('d-none');
            }
        })
        .catch(err => console.error(err));
}

function displayResults(data) {
    const resSec = document.getElementById('resultSection');
    resSec.classList.remove('d-none');

    document.getElementById('ownerName').innerText = data.owner_name;
    document.getElementById('ownerPhone').innerText = data.owner_phone;
    document.getElementById('vehicleType').innerText = data.vehicle_type;

    const tbody = document.getElementById('docsTableBody');
    tbody.innerHTML = '';

    let hasViolation = false;

    // Doc validation
    const docs = {
        'reg_expiry': 'Registration',
        'insurance_expiry': 'Insurance',
        'puc_expiry': 'PUC'
    };

    for (const [key, label] of Object.entries(docs)) {
        const expiry = data[key];
        const status = data.status_report[key];
        const isExpired = status === 'Expired';

        if (isExpired) hasViolation = true;

        const row = `<tr>
            <td>${label}</td>
            <td>${expiry}</td>
            <td><span class="badge bg-${isExpired ? 'danger' : 'success'}">${status}</span></td>
        </tr>`;
        tbody.innerHTML += row;
    }

    // Overall Status
    const statusBad = document.getElementById('overallStatus');
    statusBad.className = `badge bg-${hasViolation ? 'danger' : 'success'} fs-6`;
    statusBad.innerText = hasViolation ? 'Violations Found' : 'All Clear';

    // Button
    const btnDiv = document.getElementById('actionButtons');
    btnDiv.innerHTML = '';
    if (hasViolation) {
        btnDiv.innerHTML = `<button class="btn btn-danger" onclick="openChallanModal('${data.plate_number}')">Generate Challan</button>`;
    }
}

function openChallanModal(plate) {
    document.getElementById('modalPlate').value = plate;
    new bootstrap.Modal(document.getElementById('challanModal')).show();
}

function submitChallan() {
    const plate = document.getElementById('modalPlate').value;
    const violation = document.getElementById('violationType').value;
    const fine = document.getElementById('fineAmount').value;

    fetch('/api/generate_challan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            plate_number: plate,
            violation: violation,
            fine: fine
        })
    })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                location.reload(); // Reload to clear modal and maybe show new status
            }
        });
}

// --- Module 1 Integration: Real-time Plate Detection ---

// Function to start backend-based scanning
// Function to start backend-based scanning
function startScan() {
    console.log("Initializing Real-time Scan...");

    // 1. Stop frontend camera if running (to release hardware for backend)
    if (typeof stopCamera === 'function') {
        if (typeof videoStream !== 'undefined' && videoStream) {
            try {
                videoStream.getTracks().forEach(track => track.stop());
            } catch (e) { console.log(e); }
            videoStream = null;
        }
    }

    // 2. Replace Video element with Backend Stream Image
    const videoFeed = document.getElementById('video-feed');
    if (videoFeed) {
        if (videoFeed.tagName === 'VIDEO') {
            const img = document.createElement('img');
            img.id = 'video-feed';
            img.className = videoFeed.className;
            img.style.cssText = videoFeed.style.cssText;
            img.src = "/video_feed";
            videoFeed.parentNode.replaceChild(img, videoFeed);
        } else if (videoFeed.tagName === 'IMG') {
            videoFeed.src = "/video_feed?" + new Date().getTime();
        }

        // UI Cleanup
        $('#camera-placeholder').addClass('d-none');
        $('#capture-btn').addClass('d-none');
    }

    // 3. Poll for results
    if (window.platePollInterval) clearInterval(window.platePollInterval);

    window.platePollInterval = setInterval(() => {
        fetch('/get_plate')
            .then(response => response.json())
            .then(data => {
                const plateText = data.plate;
                if (plateText && plateText !== "--" && plateText !== null) {

                    // Update UI
                    const display = document.getElementById('detected-plate');
                    if (display) {
                        if (display.innerText !== plateText) {
                            display.innerText = plateText;
                            display.classList.add('text-success');
                            setTimeout(() => display.classList.remove('text-success'), 500);

                            // Check against Database
                            fetchValidation(plateText);
                        }
                        $('#result-area').removeClass('d-none');
                    }
                }
            })
            .catch(err => console.error("Error polling plate:", err));
    }, 2000);
}

function fetchValidation(plate) {
    console.log("Validating:", plate);
    fetch(`/validate_vehicle?plate=${plate}`)
        .then(r => r.json())
        .then(resp => {
            if (resp.found) {
                console.log("Vehicle Details Fetched:", resp.data);
                // Try to display if 'displayResults' exists and UI is compatible
                if (typeof displayResults === 'function' && document.getElementById('resultSection')) {
                    displayResults(resp.data);
                } else {
                    console.log("Skipping UI update: Element 'resultSection' not found.");
                }
            } else {
                console.log("Vehicle not found in CSV.");
            }
        })
        .catch(e => console.error("Validation error:", e));
}

// Hook into the page Logic
$(document).ready(function () {
    // Overwrite startCamera if it exists
    if (typeof window.startCamera === 'function') {
        window.startCamera = function () {
            $('#retake-btn').addClass('d-none');
            $('#capture-btn').addClass('d-none');
            $('#result-area').addClass('d-none');
            startScan();
        };
    } else {
        // Fallback
        $('#btn-camera-mode').on('click', function () {
            startScan();
        });
    }
});

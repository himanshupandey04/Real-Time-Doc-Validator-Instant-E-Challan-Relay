import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

# Load the dataset
print("Loading dataset...")
df = pd.read_excel('indian_vehicle_dataset_non_ev.xlsx')

print(f"\n{'='*80}")
print(f"ORIGINAL DATASET ANALYSIS")
print(f"{'='*80}")
print(f"Total records: {len(df)}")
print(f"\nColumns: {df.columns.tolist()}")
print(f"\nFirst 5 rows:")
print(df.head().to_string())

print(f"\n{'='*80}")
print(f"DATA QUALITY ISSUES")
print(f"{'='*80}")

# Check for impurities
issues = []

# 1. Check for fuel type in EVs
if 'fuel_type' in df.columns and 'vehicle_class' in df.columns:
    ev_with_fuel = df[(df['vehicle_class'].str.contains('EV|Electric', case=False, na=False)) & 
                      (df['fuel_type'].notna()) & 
                      (~df['fuel_type'].str.contains('Electric|Battery', case=False, na=False))]
    if len(ev_with_fuel) > 0:
        issues.append(f"❌ {len(ev_with_fuel)} EVs have non-electric fuel types")
        print(f"\n1. EVs with wrong fuel type: {len(ev_with_fuel)} records")
        print(ev_with_fuel[['registration_number', 'vehicle_class', 'fuel_type']].head(10))

# 2. Check for PUC in EVs
if 'puc_status' in df.columns and 'vehicle_class' in df.columns:
    ev_with_puc = df[(df['vehicle_class'].str.contains('EV|Electric', case=False, na=False)) & 
                     (df['puc_status'].notna())]
    if len(ev_with_puc) > 0:
        issues.append(f"❌ {len(ev_with_puc)} EVs have PUC status (EVs don't need PUC)")
        print(f"\n2. EVs with PUC status: {len(ev_with_puc)} records")

# 3. Check for missing critical fields
critical_fields = ['registration_number', 'insurance_status', 'rc_status']
for field in critical_fields:
    if field in df.columns:
        missing = df[field].isna().sum()
        if missing > 0:
            issues.append(f"❌ {missing} records missing {field}")
            print(f"\n3. Missing {field}: {missing} records")

# 4. Check for invalid dates
date_fields = ['insurance_expiry', 'puc_expiry', 'fitness_expiry', 'permit_expiry']
for field in date_fields:
    if field in df.columns:
        try:
            invalid_dates = df[field].notna() & (pd.to_datetime(df[field], errors='coerce').isna())
            if invalid_dates.sum() > 0:
                issues.append(f"❌ {invalid_dates.sum()} invalid dates in {field}")
                print(f"\n4. Invalid dates in {field}: {invalid_dates.sum()} records")
        except:
            pass

print(f"\n{'='*80}")
print(f"SUMMARY: {len(issues)} issues found")
print(f"{'='*80}")
for issue in issues:
    print(issue)

print(f"\n{'='*80}")
print(f"CLEANING DATASET...")
print(f"{'='*80}")

# Create a cleaned copy
df_clean = df.copy()

# Fix 1: Remove fuel type from EVs or set to "Electric"
if 'fuel_type' in df_clean.columns and 'vehicle_class' in df_clean.columns:
    ev_mask = df_clean['vehicle_class'].str.contains('EV|Electric', case=False, na=False)
    df_clean.loc[ev_mask, 'fuel_type'] = 'Electric'
    print("✅ Fixed: Set fuel_type to 'Electric' for all EVs")

# Fix 2: Remove PUC requirement from EVs
if 'puc_status' in df_clean.columns and 'vehicle_class' in df_clean.columns:
    ev_mask = df_clean['vehicle_class'].str.contains('EV|Electric', case=False, na=False)
    df_clean.loc[ev_mask, 'puc_status'] = 'Not Required'
    df_clean.loc[ev_mask, 'puc_expiry'] = None
    print("✅ Fixed: Set PUC to 'Not Required' for all EVs")

# Fix 3: Ensure all vehicles have insurance status
if 'insurance_status' in df_clean.columns:
    missing_insurance = df_clean['insurance_status'].isna()
    if missing_insurance.sum() > 0:
        # Randomly assign Valid/Expired/Expiring Soon
        statuses = ['Valid', 'Expired', 'Expiring Soon']
        df_clean.loc[missing_insurance, 'insurance_status'] = np.random.choice(statuses, missing_insurance.sum())
        print(f"✅ Fixed: Assigned insurance status to {missing_insurance.sum()} records")

# Fix 4: Ensure all vehicles have RC status
if 'rc_status' in df_clean.columns:
    missing_rc = df_clean['rc_status'].isna()
    if missing_rc.sum() > 0:
        df_clean.loc[missing_rc, 'rc_status'] = 'Active'
        print(f"✅ Fixed: Set RC status to 'Active' for {missing_rc.sum()} records")

# Fix 5: Generate valid expiry dates
today = datetime.now()

if 'insurance_expiry' in df_clean.columns:
    for idx, row in df_clean.iterrows():
        if pd.isna(row['insurance_expiry']) or row['insurance_status'] != 'Valid':
            if row['insurance_status'] == 'Valid':
                # Valid: 1-12 months in future
                df_clean.at[idx, 'insurance_expiry'] = (today + timedelta(days=random.randint(30, 365))).strftime('%Y-%m-%d')
            elif row['insurance_status'] == 'Expired':
                # Expired: 1-180 days in past
                df_clean.at[idx, 'insurance_expiry'] = (today - timedelta(days=random.randint(1, 180))).strftime('%Y-%m-%d')
            elif row['insurance_status'] == 'Expiring Soon':
                # Expiring Soon: 1-30 days in future
                df_clean.at[idx, 'insurance_expiry'] = (today + timedelta(days=random.randint(1, 30))).strftime('%Y-%m-%d')
    print("✅ Fixed: Generated valid insurance expiry dates")

# Fix 6: PUC dates for non-EVs
if 'puc_expiry' in df_clean.columns and 'puc_status' in df_clean.columns:
    non_ev_mask = ~df_clean['vehicle_class'].str.contains('EV|Electric', case=False, na=False)
    for idx, row in df_clean[non_ev_mask].iterrows():
        if pd.isna(row['puc_expiry']) or row['puc_status'] != 'Valid':
            if row['puc_status'] == 'Valid':
                df_clean.at[idx, 'puc_expiry'] = (today + timedelta(days=random.randint(30, 180))).strftime('%Y-%m-%d')
            elif row['puc_status'] == 'Expired':
                df_clean.at[idx, 'puc_expiry'] = (today - timedelta(days=random.randint(1, 90))).strftime('%Y-%m-%d')
    print("✅ Fixed: Generated valid PUC expiry dates for non-EVs")

# Save cleaned dataset
output_file = 'indian_vehicle_dataset_non_ev_CLEANED.xlsx'
df_clean.to_excel(output_file, index=False)
print(f"\n✅ Cleaned dataset saved to: {output_file}")

print(f"\n{'='*80}")
print(f"CLEANING COMPLETE")
print(f"{'='*80}")
print(f"Original records: {len(df)}")
print(f"Cleaned records: {len(df_clean)}")
print(f"Records removed: {len(df) - len(df_clean)}")

# Show sample of cleaned data
print(f"\nSample of cleaned data:")
print(df_clean.head(10)[['registration_number', 'vehicle_class', 'fuel_type', 'insurance_status', 'puc_status']].to_string())

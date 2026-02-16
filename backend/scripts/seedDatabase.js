const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Challan = require('../models/Challan');

const connectDB = require('../config/database');

// Sample data
const users = [
    {
        name: 'System Administrator',
        email: 'admin@echallan.gov.in',
        password: 'Admin@123456',
        phone: '9876543210',
        role: 'admin',
        isActive: true,
        isVerified: true
    },
    {
        name: 'Traffic Officer Rajesh',
        email: 'officer1@echallan.gov.in',
        password: 'Officer@123',
        phone: '9876543211',
        role: 'officer',
        isActive: true,
        isVerified: true
    },
    {
        name: 'Amit Kumar',
        email: 'amit.kumar@example.com',
        password: 'User@123456',
        phone: '9876543212',
        licenseNumber: 'DL0120230001234',
        role: 'citizen',
        isActive: true,
        isVerified: true,
        address: {
            street: '123 MG Road',
            city: 'New Delhi',
            state: 'Delhi',
            pincode: '110001'
        }
    },
    {
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        password: 'User@123456',
        phone: '9876543213',
        licenseNumber: 'MH0220230005678',
        role: 'citizen',
        isActive: true,
        isVerified: true,
        address: {
            street: '456 FC Road',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
        }
    }
];

const vehicles = [
    {
        registrationNumber: 'DL01AB1234',
        vehicleType: 'four-wheeler',
        make: 'Maruti Suzuki',
        model: 'Swift',
        year: 2020,
        color: 'Red',
        fuelType: 'petrol',
        registrationDate: new Date('2020-01-15'),
        registrationExpiry: new Date('2035-01-15'),
        insuranceNumber: 'INS123456789',
        insuranceExpiry: new Date('2025-01-15'),
        pucNumber: 'PUC987654321',
        pucExpiry: new Date('2024-12-31'),
        isActive: true
    },
    {
        registrationNumber: 'MH02CD5678',
        vehicleType: 'two-wheeler',
        make: 'Honda',
        model: 'Activa',
        year: 2021,
        color: 'Black',
        fuelType: 'petrol',
        registrationDate: new Date('2021-03-20'),
        registrationExpiry: new Date('2036-03-20'),
        insuranceNumber: 'INS987654321',
        insuranceExpiry: new Date('2025-03-20'),
        pucNumber: 'PUC123456789',
        pucExpiry: new Date('2024-11-30'),
        isActive: true
    }
];

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Connect to database
        await connectDB();

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Vehicle.deleteMany({});
        await Challan.deleteMany({});
        console.log('✅ Existing data cleared\n');

        // Create users
        console.log('👥 Creating users...');
        const createdUsers = await User.create(users);
        console.log(`✅ Created ${createdUsers.length} users\n`);

        // Link vehicles to users
        vehicles[0].owner = createdUsers[2]._id; // Amit's car
        vehicles[0].ownerName = createdUsers[2].name;
        vehicles[1].owner = createdUsers[3]._id; // Priya's scooter
        vehicles[1].ownerName = createdUsers[3].name;

        // Create vehicles
        console.log('🚗 Creating vehicles...');
        const createdVehicles = await Vehicle.create(vehicles);
        console.log(`✅ Created ${createdVehicles.length} vehicles\n`);

        // Create sample challans
        console.log('📋 Creating sample challans...');
        const challans = [
            {
                vehicle: createdVehicles[0]._id,
                registrationNumber: createdVehicles[0].registrationNumber,
                owner: createdUsers[2]._id,
                ownerName: createdUsers[2].name,
                ownerPhone: createdUsers[2].phone,
                violationType: 'over-speeding',
                violationDescription: 'Caught speeding at 85 km/h in 60 km/h zone',
                location: {
                    address: 'Connaught Place, New Delhi',
                    city: 'New Delhi',
                    state: 'Delhi',
                    coordinates: {
                        latitude: 28.6315,
                        longitude: 77.2167
                    }
                },
                issuedBy: createdUsers[1]._id,
                officerName: createdUsers[1].name,
                officerBadge: 'TRF001',
                fineAmount: 2000,
                totalAmount: 2000,
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            },
            {
                vehicle: createdVehicles[1]._id,
                registrationNumber: createdVehicles[1].registrationNumber,
                owner: createdUsers[3]._id,
                ownerName: createdUsers[3].name,
                ownerPhone: createdUsers[3].phone,
                violationType: 'signal-jump',
                violationDescription: 'Jumped red signal at traffic junction',
                location: {
                    address: 'Marine Drive, Mumbai',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    coordinates: {
                        latitude: 18.9432,
                        longitude: 72.8236
                    }
                },
                issuedBy: createdUsers[1]._id,
                officerName: createdUsers[1].name,
                officerBadge: 'TRF001',
                fineAmount: 1000,
                totalAmount: 1000,
                paymentStatus: 'paid',
                status: 'paid',
                paymentDate: new Date(),
                paymentMethod: 'upi',
                transactionId: 'TXN' + Date.now(),
                receiptNumber: 'RCP' + Date.now(),
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
        ];

        const createdChallans = await Challan.create(challans);
        console.log(`✅ Created ${createdChallans.length} challans\n`);

        // Display summary
        console.log('═══════════════════════════════════════════════════════');
        console.log('✅ DATABASE SEEDED SUCCESSFULLY!');
        console.log('═══════════════════════════════════════════════════════\n');

        console.log('📊 Summary:');
        console.log(`   • Users: ${createdUsers.length}`);
        console.log(`   • Vehicles: ${createdVehicles.length}`);
        console.log(`   • Challans: ${createdChallans.length}\n`);

        console.log('🔐 Login Credentials:\n');
        console.log('   Admin:');
        console.log('   Email: admin@echallan.gov.in');
        console.log('   Password: Admin@123456\n');

        console.log('   Officer:');
        console.log('   Email: officer1@echallan.gov.in');
        console.log('   Password: Officer@123\n');

        console.log('   Citizen 1 (Amit):');
        console.log('   Email: amit.kumar@example.com');
        console.log('   Password: User@123456');
        console.log('   Vehicle: DL01AB1234\n');

        console.log('   Citizen 2 (Priya):');
        console.log('   Email: priya.sharma@example.com');
        console.log('   Password: User@123456');
        console.log('   Vehicle: MH02CD5678\n');

        console.log('═══════════════════════════════════════════════════════\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run seeder
seedDatabase();

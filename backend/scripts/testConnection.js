const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
    try {
        console.log('Testing MongoDB connection...');
        console.log('URI:', process.env.MONGODB_URI);

        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected successfully!');
        console.log('Database:', conn.connection.name);

        // Test creating a simple user
        const User = require('../models/User');

        console.log('\nTesting user creation...');
        const testUser = new User({
            name: 'Test User',
            email: 'test@test.com',
            password: 'Test@123456',
            phone: '1234567890',
            role: 'citizen'
        });

        await testUser.save();
        console.log('✅ User created successfully!');

        // Clean up
        await User.deleteOne({ email: 'test@test.com' });
        console.log('✅ Test user deleted');

        await mongoose.connection.close();
        console.log('\n✅ All tests passed!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    }
};

testConnection();

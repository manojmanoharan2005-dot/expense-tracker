// Test MongoDB Atlas Connection
require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Testing MongoDB Atlas Connection...\n');
console.log('Connection String:', process.env.MONGO_URI.replace(/:[^:@]+@/, ':****@'));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('\n✅ SUCCESS! MongoDB Atlas Connected Successfully!');
        console.log('📊 Database:', mongoose.connection.name);
        console.log('🌐 Host:', mongoose.connection.host);
        console.log('📡 Port:', mongoose.connection.port);
        console.log('✨ Connection State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected');

        // List collections
        mongoose.connection.db.listCollections().toArray((err, collections) => {
            if (err) {
                console.log('❌ Error listing collections:', err.message);
            } else {
                console.log('\n📁 Collections in database:');
                if (collections.length === 0) {
                    console.log('   (No collections yet - will be created when you add data)');
                } else {
                    collections.forEach(col => {
                        console.log(`   - ${col.name}`);
                    });
                }
            }

            console.log('\n🎉 MongoDB Atlas is working perfectly!');
            console.log('✅ You can now use the application at http://localhost:3000\n');
            process.exit(0);
        });
    })
    .catch((error) => {
        console.log('\n❌ FAILED! Could not connect to MongoDB Atlas');
        console.log('Error:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Check if your IP is whitelisted in MongoDB Atlas');
        console.log('2. Verify username and password are correct');
        console.log('3. Check your internet connection');
        console.log('4. Ensure the cluster is running\n');
        process.exit(1);
    });

const mongoose = require('mongoose');
const dns = require('node:dns');
const configureMongoDns = require('../utils/mongodbDns');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️  MONGODB_URI is not defined in environment variables. Application will run without database.');
    console.log('💡 Set MONGODB_URI in server/.env to enable database functionality');
    console.log('💡 For local development, use: mongodb://localhost:27017/reviewlens');
    return null;
  }

  try {
    // Configure custom DNS servers if provided
    if (uri.startsWith('mongodb+srv://')) {
      configureMongoDns(uri);
    }

    // Enhanced connection options for better reliability
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000, // Increased timeout
      connectTimeoutMS: 15000,          // Increased timeout
      socketTimeoutMS: 45000,          // Socket timeout
      retryWrites: true,               // Retry failed writes
      retryReads: true,                // Retry failed reads
    });
    
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    // Provide helpful diagnostic information
    if (error.message.includes('querySrv') || error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 DNS Resolution Issue Detected:');
      console.log('   This is a common issue with MongoDB Atlas SRV connections.');
      console.log('   Solutions:');
      console.log('   1. Check your internet connection');
      console.log('   2. Try using standard mongodb:// connection instead of mongodb+srv://');
      console.log('   3. Configure custom DNS servers: MONGODB_DNS_SERVERS=8.8.8.8,8.8.4.4');
      console.log('   4. Use local MongoDB: mongodb://localhost:27017/reviewlens');
      console.log('   5. Run diagnostic: node server/utils/testConnection.js');
      
      // Try with Google DNS as fallback
      console.log('\n🔄 Attempting connection with Google DNS fallback...');
      try {
        dns.setServers(['8.8.8.8', '8.8.4.4']);
        const fallbackConn = await mongoose.createConnection(uri, {
          serverSelectionTimeoutMS: 15000,
          connectTimeoutMS: 15000,
          socketTimeoutMS: 45000,
          retryWrites: true,
          retryReads: true,
        });
        console.log(`✅  MongoDB connected with Google DNS: ${fallbackConn.host}`);
        await fallbackConn.close();
        // Reconnect with main connection after successful DNS test
        const mainConn = await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 15000,
          connectTimeoutMS: 15000,
          socketTimeoutMS: 45000,
          retryWrites: true,
          retryReads: true,
        });
        console.log(`✅  MongoDB reconnected: ${mainConn.connection.host}`);
        return mainConn;
      } catch (fallbackError) {
        console.log(`❌ Fallback connection also failed: ${fallbackError.message}`);
      }
    }
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Host Not Found Issue:');
      console.log('   The MongoDB hostname cannot be resolved.');
      console.log('   Solutions:');
      console.log('   1. Verify the MongoDB Atlas cluster is running');
      console.log('   2. Check the connection string in your .env file');
      console.log('   3. Try using the Direct Connection option in MongoDB Atlas');
    }
    
    if (error.message.includes('Authentication')) {
      console.log('\n💡 Authentication Issue:');
      console.log('   Check your username and password in the connection string.');
      console.log('   Ensure the database user has the correct permissions.');
    }
    
    console.warn('⚠️  Application will continue without database. API endpoints will return errors.');
    console.log('💡 Frontend can use mock data mode by setting VITE_USE_DUMMY=true in client/.env');
    return null;
  }
};

module.exports = connectDB;

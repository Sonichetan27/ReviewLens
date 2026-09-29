/**
 * MongoDB Connection Diagnostic Tool
 * Run this to diagnose database connection issues
 */

const mongoose = require('mongoose');
const dns = require('node:dns');

async function testConnection() {
  console.log('🔍 MongoDB Connection Diagnostic Tool\n');
  
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in environment variables');
    console.log('💡 Solution: Add MONGODB_URI to your .env file');
    return;
  }

  console.log('📋 Connection String Analysis:');
  console.log(`   URI: ${uri.substring(0, 20)}...${uri.substring(uri.length - 20)}`);
  console.log(`   Protocol: ${uri.startsWith('mongodb+srv://') ? 'mongodb+srv (Atlas)' : 'mongodb (Standard)'}`);
  console.log(`   Uses SRV: ${uri.startsWith('mongodb+srv://') ? 'Yes' : 'No'}`);

  if (uri.startsWith('mongodb+srv://')) {
    // Extract hostname for DNS testing
    const match = uri.match(/mongodb\+srv:\/\/([^@]+@)?([^/]+)/);
    if (match) {
      const hostname = match[2];
      console.log(`   Hostname: ${hostname}`);
      
      console.log('\n🌐 DNS Resolution Test:');
      try {
        // Test basic DNS resolution
        const addresses = await dns.promises.resolve(hostname);
        console.log(`   ✅ Basic DNS resolution successful`);
        console.log(`   Addresses: ${addresses.join(', ')}`);
      } catch (error) {
        console.log(`   ❌ Basic DNS resolution failed: ${error.message}`);
        console.log(`   💡 This indicates a network or DNS configuration issue`);
      }

      try {
        // Test SRV record lookup
        const srvRecords = await dns.promises.resolveSrv(`_mongodb._tcp.${hostname}`);
        console.log(`   ✅ SRV record lookup successful`);
        console.log(`   SRV Records: ${JSON.stringify(srvRecords)}`);
      } catch (error) {
        console.log(`   ❌ SRV record lookup failed: ${error.message}`);
        console.log(`   💡 This is likely the root cause of the connection failure`);
        console.log(`   💡 Solutions:`);
        console.log(`      1. Check your internet connection`);
        console.log(`      2. Try using standard mongodb:// connection string instead`);
        console.log(`      3. Configure custom DNS servers in MONGODB_DNS_SERVERS`);
        console.log(`      4. Use a VPN if behind a corporate firewall`);
      }

      try {
        // Test TXT record lookup
        const txtRecords = await dns.promises.resolveTxt(`_mongodb._tcp.${hostname}`);
        console.log(`   ✅ TXT record lookup successful`);
        console.log(`   TXT Records: ${JSON.stringify(txtRecords)}`);
      } catch (error) {
        console.log(`   ⚠️  TXT record lookup failed: ${error.message}`);
      }
    }
  }

  console.log('\n🔌 Attempting Direct Connection:');
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    console.log(`   ✅ Connection successful!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    await mongoose.connection.close();
  } catch (error) {
    console.log(`   ❌ Connection failed: ${error.message}`);
    console.log(`   Error Code: ${error.code || 'Unknown'}`);
    
    console.log('\n💡 Suggested Solutions:');
    console.log('   1. Use standard MongoDB connection string:');
    console.log('      mongodb://username:password@host:port/database');
    console.log('   2. Check MongoDB Atlas cluster status');
    console.log('   3. Verify IP whitelist in MongoDB Atlas');
    console.log('   4. Try using MongoDB Atlas Direct Connection:');
    console.log('      Add &connectTimeoutMS=15000&serverSelectionTimeoutMS=15000 to URI');
    console.log('   5. Use local MongoDB for development:');
    console.log('      mongodb://localhost:27017/reviewlens');
  }
}

// Run the diagnostic
testConnection().catch(console.error);
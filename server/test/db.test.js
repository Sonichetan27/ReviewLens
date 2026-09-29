const assert = require('node:assert/strict');
const test = require('node:test');
const dns = require('node:dns');
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const withConnectionMocks = async (options, run) => {
  const originalSetServers = dns.setServers;
  const originalConnect = mongoose.connect;
  const originalLog = console.log;
  const originalError = console.error;
  const originalUri = process.env.MONGODB_URI;
  const originalDnsServers = process.env.MONGODB_DNS_SERVERS;
  const events = [];
  const loggedErrors = [];

  if (options.uri === null) delete process.env.MONGODB_URI;
  else process.env.MONGODB_URI = options.uri || 'mongodb://example.test/reviewlens';
  if (options.dnsServers === undefined) {
    delete process.env.MONGODB_DNS_SERVERS;
  } else {
    process.env.MONGODB_DNS_SERVERS = options.dnsServers;
  }

  dns.setServers = servers => events.push({ type: 'dns', servers });
  mongoose.connect = async (uri, config) => {
    events.push({ type: 'connect', uri, config });
    if (options.connectError) throw options.connectError;
    return { connection: { host: 'example.test' } };
  };
  console.log = () => {};
  console.error = (...args) => loggedErrors.push(args);

  try {
    await run({ events, loggedErrors });
  } finally {
    dns.setServers = originalSetServers;
    mongoose.connect = originalConnect;
    console.log = originalLog;
    console.error = originalError;
    if (originalUri === undefined) delete process.env.MONGODB_URI;
    else process.env.MONGODB_URI = originalUri;
    if (originalDnsServers === undefined) delete process.env.MONGODB_DNS_SERVERS;
    else process.env.MONGODB_DNS_SERVERS = originalDnsServers;
  }
};

test('applies configured DNS servers before connecting to MongoDB', async () => {
  await withConnectionMocks({
    uri: 'mongodb+srv://example.test/reviewlens',
    dnsServers: '8.8.8.8, 1.1.1.1',
  }, async ({ events }) => {
    await connectDB();

    assert.deepEqual(events.map(event => event.type), ['dns', 'connect']);
    assert.deepEqual(events[0].servers, ['8.8.8.8', '1.1.1.1']);
    assert.equal(events[1].uri, 'mongodb+srv://example.test/reviewlens');
  });
});

test('uses the default DNS configuration when no override is provided', async () => {
  await withConnectionMocks({}, async ({ events }) => {
    await connectDB();

    assert.deepEqual(events.map(event => event.type), ['connect']);
  });
});

test('preserves the missing MongoDB URI error', async () => {
  await withConnectionMocks({ uri: null }, async ({ events }) => {
    await assert.rejects(connectDB(), /MONGODB_URI is not defined/);
    assert.deepEqual(events, []);
  });
});

test('logs and rethrows MongoDB connection errors', async () => {
  const connectionError = new Error('connection unavailable');

  await withConnectionMocks({ connectError: connectionError }, async ({ events, loggedErrors }) => {
    await assert.rejects(connectDB(), error => error === connectionError);

    assert.deepEqual(events.map(event => event.type), ['connect']);
    assert.equal(loggedErrors[0][0], '❌ MongoDB connection failed:');
    assert.equal(loggedErrors[0][1], 'connection unavailable');
  });
});

test('keeps the default DNS configuration when the override is blank', async () => {
  await withConnectionMocks({
    uri: 'mongodb+srv://example.test/reviewlens',
    dnsServers: '',
  }, async ({ events }) => {
    await connectDB();

    assert.deepEqual(events.map(event => event.type), ['connect']);
  });
});

test('does not apply the DNS override to standard MongoDB URIs', async () => {
  await withConnectionMocks({ dnsServers: '8.8.8.8, 1.1.1.1' }, async ({ events }) => {
    await connectDB();

    assert.deepEqual(events.map(event => event.type), ['connect']);
  });
});
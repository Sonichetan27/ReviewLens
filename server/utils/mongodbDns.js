const dns = require('node:dns');

const configureMongoDns = (uri, configuredServers = process.env.MONGODB_DNS_SERVERS) => {
  if (!uri || !uri.startsWith('mongodb+srv://')) return false;
  if (!configuredServers || configuredServers.trim() === '') return false;

  const servers = configuredServers.split(',').map(server => server.trim()).filter(Boolean);
  if (servers.length === 0) {
    throw new Error('MONGODB_DNS_SERVERS must contain comma-separated DNS server addresses.');
  }

  dns.setServers(servers);
  return true;
};

module.exports = configureMongoDns;
const { execFileSync } = require('child_process');

const ports = new Set(['3000', '5000']);
const netstat = execFileSync('netstat', ['-ano'], { encoding: 'utf8' });
const processIds = new Set();

for (const line of netstat.split(/\r?\n/)) {
  if (!/LISTENING/.test(line)) continue;
  const columns = line.trim().split(/\s+/);
  const localAddress = columns[1] || '';
  const processId = columns.at(-1);
  const portMatch = localAddress.match(/:(\d+)$/);

  if (portMatch && ports.has(portMatch[1]) && /^\d+$/.test(processId)) {
    processIds.add(processId);
  }
}

for (const processId of processIds) {
  console.log(`Stopping stale development process ${processId}.`);
  execFileSync('taskkill', ['/PID', processId, '/T', '/F'], { stdio: 'ignore' });
}

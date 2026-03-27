const base62 = require('./base62.service');

const MACHINE_ID  = parseInt(process.env.MACHINE_ID || '1');
const EPOCH       = 1700000000000n; // custom epoch (Nov 2023)

let sequence      = 0n;
let lastTimestamp = -1n;

function generateId() {
  let now = BigInt(Date.now());

  if (now === lastTimestamp) {
    sequence = (sequence + 1n) & 8191n;   // 13-bit max
    if (sequence === 0n) {
      // Sequence exhausted this ms — wait for next ms
      while (now <= lastTimestamp) now = BigInt(Date.now());
    }
  } else {
    sequence = 0n;
  }

  lastTimestamp = now;

  const id = ((now - EPOCH) << 23n)
           | (BigInt(MACHINE_ID) << 13n)
           | sequence;

  return base62.encode(Number(id % 62n ** 7n));
}

module.exports = { generateId };
const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function encode(num) {
  let result = '';
  while (num > 0) {
    result = CHARS[num % 62] + result;
    num    = Math.floor(num / 62);
  }
  return result.padStart(7, '0');
}

module.exports = { encode };
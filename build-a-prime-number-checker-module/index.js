function isPrime(n) {

    if (n == 2 || n == 3) {
        return true;
    }

    if (n % 2 == 0 || n == 1 ) {
        return false;
    }

    for (let i = 3; i <= Math.sqrt(n); i = i + 2) {
        if (n % i == 0)  {
            return false;
        }
    }
    return true;
}

if (require.main === module) {
  const args = process.argv.slice(2); // ['hello', '42']
  console.log(isPrime(...args));
}

module.exports = { isPrime };
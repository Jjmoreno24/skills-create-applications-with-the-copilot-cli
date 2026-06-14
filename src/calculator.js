#!/usr/bin/env node
/**
 * Node.js CLI Calculator
 * Supported operations:
 *  - addition (add, +)
 *  - subtraction (subtract, -, sub)
 *  - multiplication (multiply, *, mul)
 *  - division (divide, /)
 *
 * Usage:
 *   node src/calculator.js add 2 3
 *   node src/calculator.js + 4 5
 *   node src/calculator.js divide 10 2
 *
 * Exits with non-zero status on error (invalid args, division by zero).
 */

function printHelp() {
  console.log(`Usage: node src/calculator.js <operation> <a> <b>

Operations:
  add, +            Addition (a + b)
  subtract, -, sub  Subtraction (a - b)
  multiply, *, mul  Multiplication (a * b)
  divide, /         Division (a / b)
  mod, %            Modulo (a % b)
  pow, ^, **        Exponentiation (a ** b)
  sqrt              Square root (sqrt a)  -- single operand

Examples:
  node src/calculator.js add 2 3       # => 5
  node src/calculator.js * 4 2         # => 8
  node src/calculator.js mod 10 3      # => 1
  node src/calculator.js pow 2 8       # => 256
  node src/calculator.js sqrt 9        # => 3
  node src/calculator.js divide 5 0    # => error: division by zero
`);
}

function exitError(msg) {
  console.error(`error: ${msg}`);
  process.exit(1);
}

function parseNumber(input) {
  if (typeof input !== 'string') return null;
  if (input.trim() === '') return null;
  const n = Number(input);
  if (!isFinite(n)) return null;
  return n;
}

// New math helpers
function modulo(a, b) {
  if (b === 0) return { error: 'modulo by zero' };
  return a % b;
}

function power(base, exponent) {
  return Math.pow(base, exponent);
}

function squareRoot(n) {
  if (n < 0) return { error: 'square root of negative number' };
  return Math.sqrt(n);
}

function compute(op, a, b) {
  switch (op) {
    case 'add':
    case '+':
      return a + b;
    case 'subtract':
    case '-':
    case 'sub':
      return a - b;
    case 'multiply':
    case '*':
    case 'mul':
      return a * b;
    case 'divide':
    case '/':
      if (b === 0) return { error: 'division by zero' };
      return a / b;
    case 'mod':
    case '%':
      return modulo(a, b);
    case 'pow':
    case '^':
    case '**':
      return power(a, b);
    case 'sqrt':
      return squareRoot(a);
    default:
      return { error: `unsupported operation '${op}'` };
  }
}

// Main CLI entrypoint (only run when invoked directly)
function main(argv = process.argv.slice(2)) {
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  const op = (argv[0] || '').toLowerCase();

  // sqrt is single-operand
  if (op === 'sqrt') {
    if (argv.length < 2) exitError('insufficient arguments for sqrt. See --help');
    const aRaw = argv[1];
    const a = parseNumber(aRaw);
    if (a === null) exitError(`invalid number: ${aRaw}`);
    const result = compute(op, a, undefined);
    if (result && typeof result === 'object' && result.error) exitError(result.error);
    console.log(result);
    process.exit(0);
  }

  // binary ops
  if (argv.length < 3) {
    exitError('insufficient arguments. See --help for usage.');
  }

  const [opRaw, aRaw, bRaw] = argv;
  const a = parseNumber(aRaw);
  const b = parseNumber(bRaw);
  if (a === null) exitError(`invalid number: ${aRaw}`);
  if (b === null) exitError(`invalid number: ${bRaw}`);

  const result = compute(opRaw.toLowerCase(), a, b);
  if (result && typeof result === 'object' && result.error) {
    exitError(result.error);
  }

  // Print result with minimal formatting (preserve floats)
  console.log(result);
  process.exit(0);
}

if (require.main === module) {
  main();
}

// Export functions for unit testing
module.exports = { compute, parseNumber, printHelp, modulo, power, squareRoot };

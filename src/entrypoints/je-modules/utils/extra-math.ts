export function lerp(start: number, end: number, amount: number) {
  return (1 - amount) * start + amount * end;
}

/**
 * Clamps a value between the given minimum and maximum value.
 * @param value The value to clamp.
 * @param min The minimum value.
 * @param max The maximum value.
 * @returns The clamped value.
 */
export function clamp(value: number, min: number, max: number) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/**
 * Generates numbers from 0 to `end` with step of 1.
 * @param end End of range (exclusive)
 */
export function range(end: number): Generator<number, void, unknown>;
/**
 * Generates numbers from `start` to `end` with step of 1.
 * @param start Start of range (inclusive)
 * @param end End of range (exclusive)
 */
export function range(start: number, end: number): Generator<number, void, unknown>;
/**
 * Generates numbers from `start` to `end` with step of `step`.
 * @param start Start of range (inclusive)
 * @param end End of range (exclusive)
 * @param step Step of the range generator (can't be 0).
 * @throws `TypeError` if the step is 0 or NaN.
 */
export function range(start: number, end: number, step: number): Generator<number, void, unknown>;
export function* range(start: number, end?: number, step?: number) {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  if (step === undefined) step = 1;
  if (step == 0) throw new TypeError("Range step is equal to zero.");
  if (isNaN(step)) throw new TypeError("Range step is not a number.");
  let currentNumber = start;
  while (Math.sign(step) * currentNumber < Math.sign(step) * end) {
    yield currentNumber;
    currentNumber += step;
  }
}

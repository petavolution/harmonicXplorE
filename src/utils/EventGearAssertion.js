/**
 * EventGearAssertion.js
 *
 * Assertion utilities for validation and condition checking.
 * Part of the EventGear framework.
 */

/**
 * A class for performing various assertions and comparisons.
 */
export class Assertion {
    /**
     * Creates an instance of Assertion.
     * @param {boolean} [raiseError=false] - Whether to raise errors on assertion failures.
     * @param {number} [defaultApproxTolerance=0.015] - Default tolerance for approximate equality.
     */
    constructor(raiseError = false, defaultApproxTolerance = 0.015) {
        this.raiseError = raiseError;
        this.defaultApproxTolerance = defaultApproxTolerance;
    }

    #assertNumbers(...args) {
        for (const arg of args) {
            if (typeof arg !== 'number') {
                throw new TypeError('All arguments must be numbers');
            }
        }
    }

    true(condition) {
        if (typeof condition !== 'boolean') {
            if (this.raiseError) throw new TypeError('Condition must be a boolean');
            return false;
        }
        const result = condition === true;
        if (!result && this.raiseError) throw new Error('Assertion failed: Condition is not true.');
        return result;
    }

    false(condition) {
        if (typeof condition !== 'boolean') {
            if (this.raiseError) throw new TypeError('Condition must be a boolean');
            return false;
        }
        const result = condition === false;
        if (!result && this.raiseError) throw new Error('Assertion failed: Condition is not false.');
        return result;
    }

    equal(actual, expected) {
        const result = actual === expected;
        if (!result && this.raiseError) throw new Error(`Assertion failed: ${actual} is not equal to ${expected}.`);
        return result;
    }

    notEqual(actual, expected) {
        const result = actual !== expected;
        if (!result && this.raiseError) throw new Error(`Assertion failed: ${actual} should not be equal to ${expected}.`);
        return result;
    }

    bigger(actual, expected) {
        this.#assertNumbers(actual, expected);
        const result = actual > expected;
        if (!result && this.raiseError) throw new Error(`Assertion failed: ${actual} is not bigger than ${expected}.`);
        return result;
    }

    smaller(actual, expected) {
        this.#assertNumbers(actual, expected);
        const result = actual < expected;
        if (!result && this.raiseError) throw new Error(`Assertion failed: ${actual} is not smaller than ${expected}.`);
        return result;
    }

    biggerOrEqual(actual, expected) {
        this.#assertNumbers(actual, expected);
        const result = actual >= expected;
        if (!result && this.raiseError) throw new Error(`Assertion failed: ${actual} is not bigger than or equal to ${expected}.`);
        return result;
    }

    smallerOrEqual(actual, expected) {
        this.#assertNumbers(actual, expected);
        const result = actual <= expected;
        if (!result && this.raiseError) throw new Error(`${actual} is not smaller than or equal to ${expected}.`);
        return result;
    }

    between(actual, lowerBound, upperBound) {
        this.#assertNumbers(actual, lowerBound, upperBound);
        if (lowerBound >= upperBound) {
            if (this.raiseError) throw new Error('Lower bound must be less than upper bound');
            return false;
        }
        const result = actual > lowerBound && actual < upperBound;
        if (!result && this.raiseError) throw new Error(`${actual} is not between ${lowerBound} and ${upperBound}.`);
        return result;
    }

    notBetween(actual, lowerBound, upperBound) {
        this.#assertNumbers(actual, lowerBound, upperBound);
        if (lowerBound > upperBound) {
            if (this.raiseError) throw new Error('Lower bound must be less than or equal to upper bound');
            return false;
        }
        const result = actual < lowerBound || actual > upperBound;
        if (!result && this.raiseError) throw new Error(`${actual} is between ${lowerBound} and ${upperBound}.`);
        return result;
    }

    approxEqual(actual, expected, tolerance = this.defaultApproxTolerance) {
        this.#assertNumbers(actual, expected, tolerance);
        if (tolerance < 0 || tolerance > 1) {
            if (this.raiseError) throw new RangeError('Tolerance must be between 0 and 1');
            return false;
        }
        const difference = Math.abs(actual - expected);
        const maxDifference = Math.abs(expected * tolerance);
        const result = difference <= maxDifference;
        if (!result && this.raiseError) throw new Error(`${actual} is not approximately equal to ${expected} within tolerance ${tolerance}.`);
        return result;
    }

    notApproxEqual(actual, expected, tolerance = this.defaultApproxTolerance) {
        const result = !this.approxEqual(actual, expected, tolerance);
        if (!result && this.raiseError) throw new Error(`${actual} is approximately equal to ${expected}.`);
        return result;
    }

    dateAfter(date1, date2) {
        if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
            if (this.raiseError) throw new TypeError('Both arguments must be Date objects');
            return false;
        }
        return date1.getTime() > date2.getTime();
    }

    dateNotAfter(date1, date2) {
        const result = !this.dateAfter(date1, date2);
        if (!result && this.raiseError) throw new Error(`${date1.toISOString()} is after ${date2.toISOString()}.`);
        return result;
    }

    arrayEqual(arr1, arr2) {
        if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
            if (this.raiseError) throw new TypeError('Both arguments must be arrays');
            return false;
        }
        const result = arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
        if (!result && this.raiseError) throw new Error('Arrays are not equal.');
        return result;
    }

    arrayContains(arr, element) {
        if (!Array.isArray(arr)) {
            if (this.raiseError) throw new TypeError('First argument must be an array');
            return false;
        }
        const result = arr.includes(element);
        if (!result && this.raiseError) throw new Error(`Array does not contain element: ${element}`);
        return result;
    }

    arrayNotContains(arr, element) {
        if (!Array.isArray(arr)) {
            if (this.raiseError) throw new TypeError('First argument must be an array');
            return false;
        }
        const result = !this.arrayContains(arr, element);
        if (!result && this.raiseError) throw new Error(`Array contains element: ${element}`);
        return result;
    }

    isNullOrUndefined(value) {
        const result = value === null || value === undefined;
        if (!result && this.raiseError) throw new Error('Value must be null or undefined.');
        return result;
    }

    isFunction(value) {
        const result = typeof value === 'function';
        if (!result && this.raiseError) throw new TypeError('Value must be a function.');
        return result;
    }

    isObject(value) {
        const result = typeof value === 'object' && value !== null;
        if (!result && this.raiseError) throw new TypeError('Value must be a non-null object.');
        return result;
    }

    objectEqual(obj1, obj2) {
        if (!this.isObject(obj1) || !this.isObject(obj2)) {
            if (this.raiseError) throw new TypeError('Both arguments must be non-null objects');
            return false;
        }
        const result = JSON.stringify(obj1) === JSON.stringify(obj2);
        if (!result && this.raiseError) throw new Error('Objects are not equal.');
        return result;
    }

    objectHasProperty(obj, prop) {
        if (!this.isObject(obj)) {
            if (this.raiseError) throw new TypeError('First argument must be a non-null object');
            return false;
        }
        if (typeof prop !== 'string') {
            if (this.raiseError) throw new TypeError('Second argument must be a string');
            return false;
        }
        return Object.prototype.hasOwnProperty.call(obj, prop);
    }

    stringContains(str, substr) {
        if (typeof str !== 'string' || typeof substr !== 'string') {
            if (this.raiseError) throw new TypeError('Both arguments must be strings');
            return false;
        }
        return str.includes(substr);
    }

    stringNotContains(str, substr) {
        if (typeof str !== 'string' || typeof substr !== 'string') {
            if (this.raiseError) throw new TypeError('Both arguments must be strings');
            return false;
        }
        const result = !this.stringContains(str, substr);
        if (!result && this.raiseError) throw new Error(`String contains substring: ${substr}`);
        return result;
    }
}

// Pre-configured instances
export const check = new Assertion(false);  // Returns boolean without throwing
export const assert = new Assertion(true);  // Throws on failure

export default Assertion;

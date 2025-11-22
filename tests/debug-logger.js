/**
 * debug-logger.js
 *
 * Centralized debug logging utility.
 * Writes all debug output to both console and debug-log.txt
 */

import { appendFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const LOG_FILE = join(__dirname, '..', 'debug-log.txt');

// Log levels
export const LogLevel = {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    SUCCESS: 'SUCCESS',
    TEST: 'TEST'
};

// Color codes for console output
const COLORS = {
    DEBUG: '\x1b[36m',    // Cyan
    INFO: '\x1b[37m',     // White
    WARN: '\x1b[33m',     // Yellow
    ERROR: '\x1b[31m',    // Red
    SUCCESS: '\x1b[32m',  // Green
    TEST: '\x1b[35m',     // Magenta
    RESET: '\x1b[0m'
};

// Session tracking
let sessionStartTime = null;
let testCount = { passed: 0, failed: 0, skipped: 0 };

/**
 * Initialize a new logging session
 */
export function initSession(testName = 'Test Session') {
    sessionStartTime = new Date();
    testCount = { passed: 0, failed: 0, skipped: 0 };

    const header = `
================================================================================
 ${testName}
 Started: ${sessionStartTime.toISOString()}
 Node.js: ${process.version}
================================================================================
`;
    writeFileSync(LOG_FILE, header);
    console.log(header);
}

/**
 * Format a log message with timestamp and level
 */
function formatMessage(level, message, context = null) {
    const timestamp = new Date().toISOString();
    const elapsed = sessionStartTime
        ? `+${((Date.now() - sessionStartTime.getTime()) / 1000).toFixed(3)}s`
        : '';

    let formatted = `[${timestamp}] [${level.padEnd(7)}] ${elapsed.padEnd(10)} ${message}`;
    if (context) {
        formatted += `\n    Context: ${JSON.stringify(context, null, 2).replace(/\n/g, '\n    ')}`;
    }
    return formatted;
}

/**
 * Log a message to both console and file
 */
export function log(level, message, context = null) {
    const formatted = formatMessage(level, message, context);
    const color = COLORS[level] || COLORS.INFO;

    // Console output with color
    console.log(`${color}${formatted}${COLORS.RESET}`);

    // File output without color
    try {
        appendFileSync(LOG_FILE, formatted + '\n');
    } catch (err) {
        console.error(`Failed to write to log file: ${err.message}`);
    }
}

// Convenience methods
export const debug = (msg, ctx) => log(LogLevel.DEBUG, msg, ctx);
export const info = (msg, ctx) => log(LogLevel.INFO, msg, ctx);
export const warn = (msg, ctx) => log(LogLevel.WARN, msg, ctx);
export const error = (msg, ctx) => log(LogLevel.ERROR, msg, ctx);
export const success = (msg, ctx) => log(LogLevel.SUCCESS, msg, ctx);

/**
 * Log a test result
 */
export function logTest(testName, passed, details = null) {
    if (passed) {
        testCount.passed++;
        log(LogLevel.SUCCESS, `PASS: ${testName}`, details);
    } else {
        testCount.failed++;
        log(LogLevel.ERROR, `FAIL: ${testName}`, details);
    }
}

/**
 * Log a skipped test
 */
export function logSkip(testName, reason = 'Not implemented') {
    testCount.skipped++;
    log(LogLevel.WARN, `SKIP: ${testName} - ${reason}`);
}

/**
 * Log an exception with full stack trace
 */
export function logException(message, err) {
    const context = {
        name: err.name,
        message: err.message,
        stack: err.stack
    };
    log(LogLevel.ERROR, `EXCEPTION: ${message}`, context);
}

/**
 * End session and print summary
 */
export function endSession() {
    const endTime = new Date();
    const duration = sessionStartTime
        ? ((endTime.getTime() - sessionStartTime.getTime()) / 1000).toFixed(3)
        : 'N/A';

    const total = testCount.passed + testCount.failed + testCount.skipped;
    const passRate = total > 0 ? ((testCount.passed / total) * 100).toFixed(1) : 0;

    const summary = `
================================================================================
 TEST SUMMARY
--------------------------------------------------------------------------------
 Total Tests:   ${total}
 Passed:        ${testCount.passed} (${passRate}%)
 Failed:        ${testCount.failed}
 Skipped:       ${testCount.skipped}
 Duration:      ${duration}s
 Ended:         ${endTime.toISOString()}
================================================================================
`;

    console.log(summary);
    appendFileSync(LOG_FILE, summary);

    return testCount;
}

/**
 * Assert helper for tests
 */
export function assert(condition, testName, expected = null, actual = null) {
    if (condition) {
        logTest(testName, true);
        return true;
    } else {
        logTest(testName, false, { expected, actual });
        return false;
    }
}

/**
 * Assert equality helper
 */
export function assertEqual(actual, expected, testName) {
    return assert(actual === expected, testName, expected, actual);
}

/**
 * Assert type helper
 */
export function assertType(value, expectedType, testName) {
    const actualType = typeof value;
    return assert(actualType === expectedType, testName, expectedType, actualType);
}

/**
 * Assert throws helper
 */
export function assertThrows(fn, errorType, testName) {
    try {
        fn();
        logTest(testName, false, { expected: `${errorType} to be thrown`, actual: 'No error thrown' });
        return false;
    } catch (err) {
        if (errorType && err.constructor.name !== errorType) {
            logTest(testName, false, { expected: errorType, actual: err.constructor.name });
            return false;
        }
        logTest(testName, true, { error: err.message });
        return true;
    }
}

export default {
    initSession,
    endSession,
    log,
    debug,
    info,
    warn,
    error,
    success,
    logTest,
    logSkip,
    logException,
    assert,
    assertEqual,
    assertType,
    assertThrows,
    LogLevel
};

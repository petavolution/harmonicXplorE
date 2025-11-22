/**
 * test-runner.js
 *
 * CLI test framework for HarmonicXplorer core modules.
 * Validates all EventGear utilities, metrics, and bridges.
 *
 * Usage: node tests/test-runner.js [--all]
 */

import {
    initSession,
    endSession,
    info,
    debug,
    error,
    success,
    warn,
    logTest,
    logSkip,
    logException,
    assert,
    assertEqual,
    assertType,
    assertThrows
} from './debug-logger.js';

// Mock performance.now() for Node.js
if (typeof performance === 'undefined') {
    global.performance = { now: () => Date.now() };
}

// Test modules
async function runTests() {
    initSession('HarmonicXplorer Core Module Tests');

    info('Loading test modules...');

    // ==================== EventGearUtils Tests ====================
    info('--- Testing EventGearUtils ---');

    try {
        const {
            calculateFrequency,
            calculateInterval,
            calculateJitter,
            calculateIntervalThreshold,
            getValueFromObject,
            executeCallback,
            executeAsyncCallback,
            generateUniqueId,
            deepClone,
            throttle,
            debounce,
            CLASS_EVENTTARGET,
            NODE_IS_INSTALLED,
            DATA_TIMESTAMP_COUNT_BUFFER_MAX
        } = await import('../src/utils/EventGearUtils.js');

        success('EventGearUtils module loaded successfully');

        // Test calculateFrequency
        assertEqual(calculateFrequency(10, 2), 5, 'calculateFrequency(10, 2) = 5');
        assertEqual(calculateFrequency(0, 5), 0, 'calculateFrequency(0, 5) = 0');
        assertEqual(calculateFrequency(100, 0), 0, 'calculateFrequency(100, 0) = 0 (no division error)');

        assertThrows(() => calculateFrequency('a', 1), 'TypeError', 'calculateFrequency throws on invalid count');
        assertThrows(() => calculateFrequency(-1, 1), 'TypeError', 'calculateFrequency throws on negative count');

        // Test calculateInterval
        assertEqual(calculateInterval(10, 2), 0.2, 'calculateInterval(10, 2) = 0.2');
        assertEqual(calculateInterval(0, 5), 0, 'calculateInterval(0, 5) = 0 (no division error)');

        // Test calculateJitter
        assert(calculateJitter([100, 200, 300]) >= 0, 'calculateJitter returns non-negative');
        assertEqual(calculateJitter([100]), 0, 'calculateJitter returns 0 for single timestamp');
        assertEqual(calculateJitter([]), 0, 'calculateJitter returns 0 for empty array');

        // Test calculateIntervalThreshold
        assertEqual(calculateIntervalThreshold(15, 5, 10, true), 20, 'calculateIntervalThreshold addition');
        // When currentValue (15) > threshold (10) during subtraction, threshold unchanged
        assertEqual(calculateIntervalThreshold(15, 5, 10, false), 10, 'calculateIntervalThreshold subtraction above threshold returns unchanged');
        // When currentValue (5) < threshold (10) during subtraction, threshold adjusts down
        assertEqual(calculateIntervalThreshold(5, 5, 10, false), 0, 'calculateIntervalThreshold subtraction below threshold adjusts down');
        assertThrows(() => calculateIntervalThreshold(10, 0, 5), 'Error', 'calculateIntervalThreshold throws on zero interval');

        // Test getValueFromObject
        const testObj = { user: { name: 'test', address: { city: 'NYC' } } };
        assertEqual(getValueFromObject(testObj, 'user.name'), 'test', 'getValueFromObject nested path');
        assertEqual(getValueFromObject(testObj, 'user.address.city'), 'NYC', 'getValueFromObject deep path');
        assertThrows(() => getValueFromObject(null, 'test'), 'TypeError', 'getValueFromObject throws on null object');
        assertEqual(getValueFromObject(testObj, 'missing.path', true), undefined, 'getValueFromObject returns undefined with flag');

        // Test executeCallback
        let callbackResult = null;
        const syncCallback = (val) => { callbackResult = val; return val * 2; };
        assertEqual(executeCallback(syncCallback, 5), 10, 'executeCallback returns callback result');
        assertEqual(callbackResult, 5, 'executeCallback passes arguments');
        assertThrows(() => executeCallback('not a function'), 'TypeError', 'executeCallback throws on non-function');

        // Test executeAsyncCallback
        const asyncCallback = async (val) => val * 3;
        const asyncResult = await executeAsyncCallback(asyncCallback, 4);
        assertEqual(asyncResult, 12, 'executeAsyncCallback handles async functions');

        // Test generateUniqueId
        const id1 = generateUniqueId();
        const id2 = generateUniqueId();
        assertType(id1, 'string', 'generateUniqueId returns string');
        assert(id1.length === 36, 'generateUniqueId returns UUID format', 36, id1.length);
        assert(id1 !== id2, 'generateUniqueId returns unique values');

        // Test deepClone
        const original = { a: 1, b: { c: 2 }, d: [1, 2, 3] };
        const cloned = deepClone(original);
        assert(cloned !== original, 'deepClone creates new object');
        assertEqual(cloned.b.c, 2, 'deepClone preserves nested values');
        assertEqual(deepClone(null), null, 'deepClone handles null');
        assertEqual(deepClone(5), 5, 'deepClone handles primitives');

        // Test throttle
        let throttleCount = 0;
        const throttled = throttle(() => throttleCount++, 100);
        throttled();
        throttled();
        throttled();
        assert(throttleCount <= 2, 'throttle limits function calls', 'less than 3', throttleCount);

        // Test debounce
        let debounceCount = 0;
        const debounced = debounce(() => debounceCount++, 50);
        debounced();
        debounced();
        debounced();
        await new Promise(r => setTimeout(r, 100));
        assertEqual(debounceCount, 1, 'debounce only calls function once after delay');

        // Test constants
        // NODE_IS_INSTALLED returns Node version string or false (truthy/falsy)
        assert(NODE_IS_INSTALLED, 'NODE_IS_INSTALLED is truthy in Node.js environment');
        assertType(DATA_TIMESTAMP_COUNT_BUFFER_MAX, 'number', 'DATA_TIMESTAMP_COUNT_BUFFER_MAX is number');
        assertEqual(DATA_TIMESTAMP_COUNT_BUFFER_MAX, 300000, 'DATA_TIMESTAMP_COUNT_BUFFER_MAX = 300000');

    } catch (err) {
        logException('EventGearUtils tests failed', err);
    }

    // ==================== EventGearMetrics Tests ====================
    info('--- Testing EventGearMetrics ---');

    try {
        const {
            DataMetricsBasic,
            DataMetricsAdvanced,
            DataMetricsMicro,
            DataExecutionPerformance,
            DataTimestampCountBuffer
        } = await import('../src/utils/EventGearMetrics.js');

        success('EventGearMetrics module loaded successfully');

        // Test DataMetricsBasic
        const basicMetrics = new DataMetricsBasic();
        assertEqual(basicMetrics.events, 0, 'DataMetricsBasic initial events = 0');
        basicMetrics.add(100, 5);
        assertEqual(basicMetrics.events, 5, 'DataMetricsBasic add increments events');
        basicMetrics.add(200, 5);
        assertEqual(basicMetrics.events, 10, 'DataMetricsBasic accumulates events');
        assertThrows(() => basicMetrics.add('invalid'), 'TypeError', 'DataMetricsBasic throws on invalid timestamp');
        assertThrows(() => basicMetrics.add(50), 'RangeError', 'DataMetricsBasic throws on earlier timestamp');

        basicMetrics.reset();
        assertEqual(basicMetrics.events, 0, 'DataMetricsBasic reset clears events');

        // Test DataMetricsAdvanced
        const advancedMetrics = new DataMetricsAdvanced();
        assertType(advancedMetrics.jitter, 'number', 'DataMetricsAdvanced has jitter property');
        assertEqual(advancedMetrics.jitter, 0, 'DataMetricsAdvanced initial jitter = 0');

        // Test DataMetricsMicro
        let microCallbackData = null;
        const microMetrics = new DataMetricsMicro((data) => { microCallbackData = data; });
        assertEqual(microMetrics.eventsNow, 0, 'DataMetricsMicro initial eventsNow = 0');
        microMetrics.add(1000, 1);
        assertEqual(microMetrics.events, 1, 'DataMetricsMicro tracks total events');
        microMetrics.add(2000, 3);
        assertEqual(microMetrics.events, 4, 'DataMetricsMicro accumulates events');

        microMetrics.reset();
        assertEqual(microMetrics.events, 0, 'DataMetricsMicro reset clears all');

        // Test callback setting
        microMetrics.setCallbackOnClosure(() => {});
        assertThrows(() => microMetrics.setCallbackOnClosure('not function'), 'TypeError', 'setCallbackOnClosure throws on non-function');

        // Test DataExecutionPerformance
        const execPerf = new DataExecutionPerformance();
        assertEqual(execPerf.total, 0, 'DataExecutionPerformance initial total = 0');
        execPerf.total = 100;
        assertEqual(execPerf.total, 100, 'DataExecutionPerformance allows setting total');
        execPerf.reset();
        assertEqual(execPerf.total, 0, 'DataExecutionPerformance reset clears total');

        // Test DataTimestampCountBuffer
        const buffer = new DataTimestampCountBuffer(10);
        assertEqual(buffer.size, 0, 'DataTimestampCountBuffer initial size = 0');
        assertEqual(buffer.maxSize, 10, 'DataTimestampCountBuffer respects maxSize');

        buffer.addEntry(1000, 1);
        assertEqual(buffer.size, 1, 'DataTimestampCountBuffer addEntry increases size');
        buffer.addEntry(1000, 2); // Same timestamp should update count
        assertEqual(buffer.size, 1, 'DataTimestampCountBuffer combines same timestamp entries');

        buffer.addEntry(2000, 3);
        assertEqual(buffer.size, 2, 'DataTimestampCountBuffer adds new timestamp');

        const entries = buffer.getAllEntries();
        assertEqual(entries.length, 2, 'getAllEntries returns correct count');

        const filtered = buffer.filter(500, 1500);
        assertEqual(filtered.length, 1, 'filter returns entries in range');

        const sum = buffer.sumCountsInTimeframe(0, 3000);
        assertEqual(sum, 6, 'sumCountsInTimeframe returns correct sum');

        buffer.clean(1500);
        assertEqual(buffer.size, 1, 'clean removes old entries');

        buffer.reset();
        assertEqual(buffer.size, 0, 'reset clears buffer');

        assertThrows(() => new DataTimestampCountBuffer(0), 'Error', 'DataTimestampCountBuffer throws on zero size');

    } catch (err) {
        logException('EventGearMetrics tests failed', err);
    }

    // ==================== EventGearBridges Tests ====================
    info('--- Testing EventGearBridges ---');

    try {
        const { WebSocketBridge, NodeBridge } = await import('../src/utils/EventGearBridges.js');

        success('EventGearBridges module loaded successfully');

        // Test NodeBridge (can test in Node.js environment)
        const nodeBridge = new NodeBridge();
        assert(nodeBridge.isNodeActive === true || nodeBridge.isNodeActive === false, 'NodeBridge has isNodeActive property');

        if (nodeBridge.isNodeActive) {
            assertEqual(nodeBridge.channelIn, '', 'NodeBridge initial channelIn is empty');
            assertEqual(nodeBridge.channelOut, '', 'NodeBridge initial channelOut is empty');

            nodeBridge.setReceiveChannel('test-in');
            assertEqual(nodeBridge.channelIn, 'test-in', 'NodeBridge setReceiveChannel works');

            nodeBridge.setSendChannel('test-out');
            assertEqual(nodeBridge.channelOut, 'test-out', 'NodeBridge setSendChannel works');

            assertThrows(() => nodeBridge.setReceiveChannel(''), 'Error', 'NodeBridge throws on empty channel name');
            assertThrows(() => nodeBridge.setCallback('not a function'), 'TypeError', 'NodeBridge throws on invalid callback');

            nodeBridge.setAutoReceive(true);
            assertEqual(nodeBridge.autoReceive, true, 'NodeBridge setAutoReceive works');

            nodeBridge.reset();
            assertEqual(nodeBridge.channelIn, '', 'NodeBridge reset clears channels');
            assertEqual(nodeBridge.autoReceive, false, 'NodeBridge reset clears autoReceive');

            assertEqual(nodeBridge.getListenerCount('nonexistent'), 0, 'getListenerCount returns 0 for nonexistent channel');
        } else {
            logSkip('NodeBridge detailed tests', 'Node.js EventEmitter not available');
        }

        // WebSocketBridge - basic structure tests (no actual WebSocket in Node.js without libraries)
        logSkip('WebSocketBridge connection tests', 'WebSocket not available in Node.js without ws library');

    } catch (err) {
        logException('EventGearBridges tests failed', err);
    }

    // ==================== EventGearLite Tests ====================
    info('--- Testing EventGearLite ---');

    try {
        const { default: EventGearLite } = await import('../src/utils/EventGearLite.js');

        success('EventGearLite module loaded successfully');

        const lite = new EventGearLite(50);
        assert(lite.isActive === true, 'EventGearLite starts active by default');
        assertEqual(lite.eventCount, 0, 'EventGearLite initial eventCount = 0');

        // Test event registration
        lite.registerEvent({ type: 'test', data: 'hello' });
        assertEqual(lite.eventCount, 1, 'registerEvent increments eventCount');

        lite.registerEvent({ type: 'test2' });
        assertEqual(lite.eventCount, 2, 'registerEvent continues to increment');

        // Test recent events
        const recent = lite.getRecentEvents(2);
        assertEqual(recent.length, 2, 'getRecentEvents returns correct count');
        assert(recent[0].type === 'test', 'getRecentEvents preserves event data');

        // Test pub/sub
        let emitReceived = null;
        lite.on('custom.event', (data) => { emitReceived = data; });
        lite.emit('custom.event', { value: 42 });
        assertEqual(emitReceived.value, 42, 'on/emit pub/sub works');
        assertEqual(emitReceived.type, 'custom.event', 'emit includes event type');

        // Test wildcard listeners
        let wildcardReceived = null;
        lite.on('*', (data) => { wildcardReceived = data; });
        lite.emit('any.event', { wild: true });
        assertEqual(wildcardReceived.wild, true, 'Wildcard listener receives all events');

        // Test off (remove listener)
        const handler = (data) => {};
        lite.on('removable', handler);
        lite.off('removable', handler);
        // No easy way to verify removal without internal access

        // Test metadata
        lite.setMetadata({ key: 'value' });
        const meta = lite.getMetadata();
        assertEqual(meta.key, 'value', 'setMetadata/getMetadata works');

        lite.setMetadata({ key: 'updated' });
        const prevMeta = lite.getMetadataPrevious();
        assertEqual(prevMeta.key, 'value', 'getMetadataPrevious returns previous state');

        // Test callbacks
        let eventCallbackFired = false;
        lite.setCallbackEvent(() => { eventCallbackFired = true; });
        lite.registerEvent({ test: true });
        assertEqual(eventCallbackFired, true, 'setCallbackEvent callback fires');

        // Test stop/start
        lite.stop();
        assertEqual(lite.isActive, false, 'stop() deactivates');
        const countBefore = lite.eventCount;
        lite.registerEvent({ ignored: true });
        assertEqual(lite.eventCount, countBefore, 'registerEvent ignored when stopped');

        lite.start();
        assertEqual(lite.isActive, true, 'start() reactivates');

        // Test reset
        lite.reset();
        assertEqual(lite.eventCount, 0, 'reset() clears eventCount');

        // Test performance metrics
        for (let i = 0; i < 10; i++) lite.registerEvent({});
        const metrics = lite.getEventPerformanceMetrics();
        assertEqual(metrics.totalEvents, 10, 'getEventPerformanceMetrics returns correct total');
        assertType(metrics.averageFrequency, 'number', 'getEventPerformanceMetrics includes frequency');

        // Test event connections
        lite.registerEventConnection('moduleA', 'moduleB', 'event1', 'handleEvent1');
        // No easy assertion without internal access

        // Test stub methods (should not throw)
        lite.websocketSetIncomingUrl('ws://test');
        lite.websocketReset();
        lite.nodeSetIncomingChannel('test');
        assertEqual(lite.websocketGetIncomingWebSocketActive(), false, 'WebSocket stub returns false');
        assertEqual(lite.nodeGetIncomingChannel(), '', 'Node stub returns empty string');

        // Test on with invalid callback
        assertThrows(() => lite.on('test', 'not a function'), 'TypeError', 'on() throws on invalid callback');

    } catch (err) {
        logException('EventGearLite tests failed', err);
    }

    // ==================== Index Module Tests ====================
    info('--- Testing Index Module Exports ---');

    try {
        const indexModule = await import('../src/utils/index.js');

        success('Index module loaded successfully');

        // Verify all exports exist
        assert(indexModule.EventGear !== undefined, 'Index exports EventGear');
        assert(indexModule.EventGearLite !== undefined, 'Index exports EventGearLite');
        assert(indexModule.calculateFrequency !== undefined, 'Index exports calculateFrequency');
        assert(indexModule.calculateInterval !== undefined, 'Index exports calculateInterval');
        assert(indexModule.calculateJitter !== undefined, 'Index exports calculateJitter');
        assert(indexModule.generateUniqueId !== undefined, 'Index exports generateUniqueId');
        assert(indexModule.deepClone !== undefined, 'Index exports deepClone');
        assert(indexModule.throttle !== undefined, 'Index exports throttle');
        assert(indexModule.debounce !== undefined, 'Index exports debounce');
        assert(indexModule.DataMetricsBasic !== undefined, 'Index exports DataMetricsBasic');
        assert(indexModule.DataMetricsAdvanced !== undefined, 'Index exports DataMetricsAdvanced');
        assert(indexModule.DataMetricsMicro !== undefined, 'Index exports DataMetricsMicro');
        assert(indexModule.DataExecutionPerformance !== undefined, 'Index exports DataExecutionPerformance');
        assert(indexModule.DataTimestampCountBuffer !== undefined, 'Index exports DataTimestampCountBuffer');
        assert(indexModule.WebSocketBridge !== undefined, 'Index exports WebSocketBridge');
        assert(indexModule.NodeBridge !== undefined, 'Index exports NodeBridge');
        assert(indexModule.default !== undefined, 'Index has default export (EventGear)');

    } catch (err) {
        logException('Index module tests failed', err);
    }

    // End test session
    const results = endSession();

    // Exit with appropriate code
    process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(err => {
    error('Fatal error in test runner', { message: err.message, stack: err.stack });
    process.exit(1);
});

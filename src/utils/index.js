/**
 * EventGear Module Index
 *
 * Centralized exports for the EventGear framework.
 * Use EventGear for full functionality, EventGearLite for simpler use cases.
 */

// Core EventGear (full-featured)
export { default as EventGear } from './EventGear.js';

// Lite version (simplified, smaller footprint)
export { default as EventGearLite } from './EventGearLite.js';

// Utilities
export {
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
} from './EventGearUtils.js';

// Metrics classes
export {
    DataMetricsBasic,
    DataMetricsAdvanced,
    DataMetricsMicro,
    DataExecutionPerformance,
    DataTimestampCountBuffer
} from './EventGearMetrics.js';

// Communication bridges
export {
    WebSocketBridge,
    NodeBridge
} from './EventGearBridges.js';

// Default export is the full EventGear
import EventGear from './EventGear.js';
export default EventGear;

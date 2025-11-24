/**
 * EventGearCallback.js
 *
 * CallbackTracker class for managing and executing callbacks based on conditions.
 * Part of the EventGear framework.
 */

import { executeCallback, calculateIntervalThreshold } from './EventGearUtils.js';

/**
 * CallbackTracker class for managing callbacks with check conditions.
 */
export class CallbackTracker {
    #callbacks = [];
    #sortedCallbacks = [];
    #performanceMetricsActivated;
    #callbackId = '';
    #totalCheckExecutionTime = 0;
    #totalCallbackExecutionTime = 0;
    #intervalDuration = 0;
    #intervalId = null;

    constructor(performanceMetricsActivated = true, intervalDuration = 0) {
        this.#performanceMetricsActivated = performanceMetricsActivated;
        this.IntervalDuration = intervalDuration;
        if (intervalDuration > 0) this.#updateInterval();
    }

    #updateInterval() {
        if (this.#intervalId) {
            clearInterval(this.#intervalId);
            this.#intervalId = null;
        }
        if (this.#intervalDuration > 0) {
            this.#intervalId = setInterval(() => this.checkCallbacks(), this.#intervalDuration);
        }
    }

    #sortCallbacks() {
        this.#sortedCallbacks = [...this.#callbacks].sort((a, b) => b.priority - a.priority);
    }

    #callbackResetMetrics(callback) {
        callback.checkTrueFlag = false;
        callback.checkTrueCount = 0;
        callback.lastCheckTrueTimestamp = 0;
        callback.lastExecutionTime = 0;
        callback.totalExecutionTime = 0;
        callback.lastCheckDuration = 0;
        callback.totalCheckDuration = 0;
    }

    #extractCallbackMetrics(callback) {
        const { id, type, checkTrueCount, lastCheckTrueTimestamp, lastExecutionTime, totalExecutionTime,
            lastCheckDuration, totalCheckDuration, checkActive, callbackActive, checkMethod,
            checkTrueFlag, threshold, interval } = callback;
        return { id, type, checkTrueCount, lastCheckTrueTimestamp, lastExecutionTime, totalExecutionTime,
            lastCheckDuration, totalCheckDuration, checkActive, callbackActive, checkMethod, checkTrueFlag, threshold, interval };
    }

    registerCallback(id, checkFunction, callback = null, priority = 5, type = null, checkActive = true,
            callbackActive = true, checkMethod = 'default', threshold = 0, interval = 0) {
        if (typeof checkFunction !== 'function') throw new Error("Check function must be a function");
        if (callback !== null && typeof callback !== 'function') throw new Error("Callback must be a function or null");
        if (priority < 0 || priority > 10) throw new Error("Priority must be between 0 and 10");

        const existingIndex = this.#callbacks.findIndex(cb => cb.id === id);
        if (existingIndex !== -1) {
            Object.assign(this.#callbacks[existingIndex], { checkFunction, callback, priority, type,
                checkActive, callbackActive, checkMethod, checkTrueFlag: false, threshold, interval });
        } else {
            this.#callbacks.push({ id, type, checkFunction, callback, priority, checkActive, callbackActive,
                checkMethod, checkTrueFlag: false, threshold, interval, checkTrueCount: 0,
                lastCheckTrueTimestamp: 0, lastExecutionTime: 0, totalExecutionTime: 0,
                lastCheckDuration: 0, totalCheckDuration: 0 });
        }
        this.#sortCallbacks();
    }

    checkCallbacks(timestampNow = performance.now()) {
        let checkStart = timestampNow, checkEnd;
        this.#sortedCallbacks.forEach(cb => {
            if (!cb.checkActive) return;
            if (this.#performanceMetricsActivated) checkStart = performance.now();
            this.#callbackId = cb.id;
            let checkPassedTrue = false;
            const checkFunctionDefined = cb.checkFunction && typeof cb.checkFunction === 'function';

            if (cb.checkMethod === 'customOnce' && !cb.checkTrueFlag) {
                if (checkFunctionDefined) checkPassedTrue = executeCallback(cb.checkFunction);
            } else if (cb.checkMethod === 'timeOnce' && !cb.checkTrueFlag && timestampNow >= cb.threshold) {
                checkPassedTrue = checkFunctionDefined ? executeCallback(cb.checkFunction) : true;
            } else if (cb.checkMethod === 'timeInterval' && timestampNow >= cb.threshold) {
                checkPassedTrue = checkFunctionDefined ? executeCallback(cb.checkFunction) : true;
                if (checkPassedTrue) cb.threshold = calculateIntervalThreshold(timestampNow, cb.interval, cb.threshold);
            } else if (checkFunctionDefined) {
                checkPassedTrue = executeCallback(cb.checkFunction);
            }

            if (this.#performanceMetricsActivated) {
                checkEnd = performance.now();
                cb.lastCheckDuration = checkEnd - checkStart;
                cb.totalCheckDuration += cb.lastCheckDuration;
                this.#totalCheckExecutionTime += cb.lastCheckDuration;
            }

            if (checkPassedTrue) {
                cb.lastCheckTrueTimestamp = checkStart;
                if (!cb.checkTrueFlag) cb.checkTrueFlag = true;
                cb.checkTrueCount++;
                if (cb.callback && cb.callbackActive && typeof cb.callback === 'function') {
                    if (this.#performanceMetricsActivated) {
                        const startTime = performance.now();
                        executeCallback(cb.callback);
                        cb.lastExecutionTime = performance.now() - startTime;
                        cb.totalExecutionTime += cb.lastExecutionTime;
                        this.#totalCallbackExecutionTime += cb.lastExecutionTime;
                    } else {
                        executeCallback(cb.callback);
                    }
                }
            }
        });
        this.#callbackId = '';
    }

    removeCallback(id) {
        const index = this.#callbacks.findIndex(cb => cb.id === id);
        if (index !== -1) {
            this.#callbacks.splice(index, 1);
            this.#sortedCallbacks = this.#sortedCallbacks.filter(cb => cb.id !== id);
        }
    }

    reset() {
        this.#callbacks = [];
        this.#sortedCallbacks = [];
        this.#totalCheckExecutionTime = 0;
        this.#totalCallbackExecutionTime = 0;
        if (this.#intervalId) {
            clearInterval(this.#intervalId);
            this.#intervalId = null;
        }
    }

    resetMetrics() {
        this.#totalCheckExecutionTime = 0;
        this.#totalCallbackExecutionTime = 0;
        this.#callbacks.forEach(cb => this.#callbackResetMetrics(cb));
    }

    resetMetricsById(id = this.#callbackId) {
        if (!id) throw new Error("Invalid Id");
        const callback = this.#callbacks.find(cb => cb.id === id);
        if (!callback) throw new Error("Id not found");
        this.#callbackResetMetrics(callback);
    }

    set IntervalDuration(value) {
        if (typeof value !== 'number' || value < 0) throw new Error("Interval duration must be a non-negative number");
        this.#intervalDuration = value;
        this.#updateInterval();
    }

    set performanceMetricsActivated(value) { this.#performanceMetricsActivated = Boolean(value); }

    setCallbackProperties(id, updates) {
        const callbackIndex = this.#callbacks.findIndex(cb => cb.id === id);
        if (callbackIndex === -1) throw new Error(`Callback with ID ${id} not found`);
        const cb = this.#callbacks[callbackIndex];
        if (updates.checkFunction !== undefined) {
            if (typeof updates.checkFunction !== 'function') throw new Error("Check function must be a function");
            cb.checkFunction = updates.checkFunction;
        }
        if (updates.callback !== undefined) {
            if (updates.callback !== null && typeof updates.callback !== 'function') throw new Error("Callback must be a function or null");
            cb.callback = updates.callback;
        }
        if (updates.priority !== undefined) {
            if (updates.priority < 0 || updates.priority > 10) throw new Error("Priority must be between 0 and 10");
            cb.priority = updates.priority;
        }
        if (updates.type !== undefined) cb.type = updates.type;
        if (updates.checkActive !== undefined) cb.checkActive = Boolean(updates.checkActive);
        if (updates.callbackActive !== undefined) cb.callbackActive = Boolean(updates.callbackActive);
        if (updates.checkMethod !== undefined) cb.checkMethod = updates.checkMethod;
        if (updates.checkTrueFlag !== undefined) cb.checkTrueFlag = Boolean(updates.checkTrueFlag);
        if (updates.threshold !== undefined) cb.threshold = updates.threshold;
        if (updates.interval !== undefined) cb.interval = updates.interval;
        this.#sortCallbacks();
    }

    #findCallback(id) {
        if (!id) throw new Error("Invalid Id");
        const callback = this.#callbacks.find(cb => cb.id === id);
        if (!callback) throw new Error("Id not found");
        return callback;
    }

    setCheckFunction(func, id = this.#callbackId) {
        const cb = this.#findCallback(id);
        if (func !== null && typeof func !== 'function') throw new Error("Check function must be a function or null");
        cb.checkFunction = func;
    }

    setCallback(func, id = this.#callbackId) {
        const cb = this.#findCallback(id);
        if (func !== null && typeof func !== 'function') throw new Error("Callback must be a function or null");
        cb.callback = func;
    }

    setPriority(value, id = this.#callbackId) {
        const cb = this.#findCallback(id);
        if (value < 0 || value > 10) throw new Error("Priority must be between 0 and 10");
        cb.priority = value;
        this.#sortCallbacks();
    }

    setType(value, id = this.#callbackId) { this.#findCallback(id).type = value; }
    setCallbackActive(value, id = this.#callbackId) { this.#findCallback(id).callbackActive = Boolean(value); }
    setCheckActive(value, id = this.#callbackId) { this.#findCallback(id).checkActive = Boolean(value); }
    setCheckMethod(method, id = this.#callbackId) { this.#findCallback(id).checkMethod = method; }
    setCheckTrueFlag(value, id = this.#callbackId) { this.#findCallback(id).checkTrueFlag = Boolean(value); }
    setThresholdInterval(value, id = this.#callbackId) { this.#findCallback(id).interval = value; }
    setThreshold(value, id = this.#callbackId) { this.#findCallback(id).threshold = value; }

    get IntervalDuration() { return this.#intervalDuration; }
    get performanceMetricsActivated() { return this.#performanceMetricsActivated; }
    get callbackIds() { return this.#callbacks.map(cb => cb.id); }
    get callbackId() { return this.#callbackId; }
    get totalCheckExecutionTime() { return this.#totalCheckExecutionTime; }
    get totalCallbackExecutionTime() { return this.#totalCallbackExecutionTime; }

    getCallbackMetrics() { return this.#callbacks.map(cb => this.#extractCallbackMetrics(cb)); }

    getCallbackMetricsById(id = this.#callbackId) {
        return this.#extractCallbackMetrics(this.#findCallback(id));
    }

    getIsCallbackSet(id = this.#callbackId) {
        const cb = this.#callbacks.find(c => c.id === id);
        return !!(cb && typeof cb.callback === 'function');
    }

    getIsCheckFunctionSet(id = this.#callbackId) {
        const cb = this.#callbacks.find(c => c.id === id);
        return !!(cb && typeof cb.checkFunction === 'function');
    }

    getPriority(id = this.#callbackId) { return this.#findCallback(id).priority; }
    getType(id = this.#callbackId) { return this.#findCallback(id).type; }
    getCallbackActive(id = this.#callbackId) { return Boolean(this.#findCallback(id).callbackActive); }
    getCheckActive(id = this.#callbackId) { return Boolean(this.#findCallback(id).checkActive); }
    getCheckMethod(id = this.#callbackId) { return this.#findCallback(id).checkMethod; }
    getCheckTrueFlag(id = this.#callbackId) { return Boolean(this.#findCallback(id).checkTrueFlag); }
    getThresholdInterval(id = this.#callbackId) { return this.#findCallback(id).interval; }
    getThreshold(id = this.#callbackId) { return this.#findCallback(id).threshold; }
}

export default CallbackTracker;

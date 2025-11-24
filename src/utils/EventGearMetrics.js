/**
 * EventGearMetrics.js
 *
 * Data metrics classes for EventGear framework.
 * Provides event tracking, performance measurement, and timestamp buffering.
 */

import { calculateFrequency, calculateInterval, DATA_TIMESTAMP_COUNT_BUFFER_MAX } from './EventGearUtils.js';

/**
 * Basic metrics for event tracking.
 */
export class DataMetricsBasic {
    constructor() {
        this.timestamp = null;
        this.timestampLast = null;
        this.events = 0;
        this.seconds = 0;
        this.interval = 0;
        this.frequency = 0;
        this.frequencyMax = 0;
    }

    reset() {
        this.timestamp = null;
        this.timestampLast = null;
        this.events = 0;
        this.seconds = 0;
        this.interval = 0;
        this.frequency = 0;
        this.frequencyMax = 0;
    }

    add(timestampAdd = performance.now(), eventCount = 1) {
        if (!this.#validateTimestamp(timestampAdd)) return;
        if (!this.timestamp) this.timestamp = timestampAdd;
        if (typeof eventCount !== 'number' || eventCount < 0) {
            throw new TypeError('Event must be positive number.');
        }
        this.events += eventCount;
        this.update(timestampAdd);
    }

    update(timestampUpdate = performance.now()) {
        if (!this.#validateTimestamp(timestampUpdate)) return;
        if (!this.timestamp) this.timestamp = timestampUpdate;
        this.seconds = (timestampUpdate - this.timestamp) / 1000;
        this.interval = calculateInterval(this.events, this.seconds);
        this.frequency = calculateFrequency(this.events, this.seconds);
        if (this.frequency > this.frequencyMax) this.frequencyMax = this.frequency;
        this.timestampLast = timestampUpdate;
    }

    #validateTimestamp(timestamp) {
        if (timestamp === null) return true;
        if (typeof timestamp !== 'number') {
            throw new TypeError('Timestamp must be a number or null.');
        }
        if ((this.timestampLast !== null && timestamp < this.timestampLast) ||
            (this.timestamp !== null && timestamp < this.timestamp)) {
            throw new RangeError('Timestamp cannot be earlier than recorded.');
        }
        return true;
    }
}

/**
 * Advanced metrics extending basic with jitter.
 */
export class DataMetricsAdvanced extends DataMetricsBasic {
    constructor() {
        super();
        this.jitter = 0;
    }
}

/**
 * Micro-level metrics for high-frequency events with timeframe analysis.
 */
export class DataMetricsMicro extends DataMetricsBasic {
    constructor(onCloseCallback = null, nowIsEstimated = true) {
        super();
        this.nowIsEstimated = nowIsEstimated;
        this.onCloseCallback = onCloseCallback;
        this.intervalMicro = 0;
        this.eventsNow = 0;
        this.secondsNow = 0;
        this.intervalNow = 0;
        this.frequencyNow = 0;
        this.eventsLast = 0;
        this.secondsLast = 0;
        this.intervalLast = 0;
        this.frequencyLast = 0;
        this.differenceLast = 0;
        this.jitterLast = 0;
    }

    reset() {
        super.reset();
        this.resetMicroMetrics();
    }

    resetMicroMetrics() {
        this.intervalMicro = 0;
        this.eventsNow = 0;
        this.secondsNow = 0;
        this.intervalNow = 0;
        this.frequencyNow = 0;
        this.eventsLast = 0;
        this.secondsLast = 0;
        this.intervalLast = 0;
        this.frequencyLast = 0;
        this.differenceLast = 0;
        this.jitterLast = 0;
    }

    setCallbackOnClosure(callback) {
        if (typeof callback === 'function' || callback === null) {
            this.onCloseCallback = callback;
        } else {
            throw new TypeError('Callback must be a function or null');
        }
    }

    add(timestampAdd = performance.now(), eventCount = 1) {
        if (!this.#validateTimestamp(timestampAdd)) return;
        if (!this.timestamp) this.timestamp = timestampAdd;
        if (typeof eventCount !== 'number' || eventCount < 0) {
            throw new TypeError('Event must be positive number.');
        }
        this.events += eventCount;
        this.eventsNow += eventCount;
        if (timestampAdd === this.timestampLast && this.nowIsEstimated && this.intervalMicro > 0) {
            this.secondsNow += eventCount * this.intervalMicro;
            this.intervalNow = calculateInterval(this.eventsNow, this.secondsNow);
            this.frequencyNow = calculateFrequency(this.eventsNow, this.secondsNow);
        }
        this.update(timestampAdd);
    }

    update(timestampUpdate = performance.now()) {
        if (!this.#validateTimestamp(timestampUpdate)) return;
        if (!this.timestamp) this.timestamp = timestampUpdate;
        const newTimeframe = (timestampUpdate !== this.timestampLast);

        if (newTimeframe) {
            this.seconds = (timestampUpdate - this.timestamp) / 1000;
            this.interval = calculateInterval(this.events, this.seconds);
            this.frequency = calculateFrequency(this.events, this.seconds);
            this.eventsLast = this.eventsNow;

            if (this.eventsLast > 0) {
                this.secondsLast = (timestampUpdate - this.timestampLast) / 1000;
                this.intervalLast = calculateInterval(this.eventsLast, this.secondsLast);
                this.frequencyLast = calculateFrequency(this.eventsLast, this.secondsLast);
                if (this.nowIsEstimated) {
                    this.intervalMicro = this.intervalLast;
                    this.differenceLast = this.secondsLast - this.secondsNow;
                    this.jitterLast = Math.abs(this.differenceLast) / this.eventsLast;
                }
            } else {
                this.secondsLast = 0;
                this.intervalLast = 0;
                this.frequencyLast = 0;
                this.differenceLast = 0;
            }

            this.eventsNow = 0;
            if (this.nowIsEstimated) {
                this.secondsNow = 0;
                this.intervalNow = 0;
                this.frequencyNow = 0;
            }
            this.timestampLast = timestampUpdate;
        }

        if (this.frequency === 0 && this.events > 0) {
            if (this.frequencyNow === 0 && this.frequencyLast !== 0) {
                this.interval = this.intervalLast;
                this.frequency = this.frequencyLast;
                if (this.seconds === 0) this.seconds = this.secondsLast;
            } else if (this.frequencyNow !== 0) {
                if (this.seconds === 0) this.seconds = this.secondsNow;
                this.interval = this.intervalNow;
                this.frequency = this.frequencyNow;
            }
        }

        this.frequencyMax = Math.max(this.frequencyMax, this.frequency, this.frequencyLast);

        if (newTimeframe && this.onCloseCallback) {
            this.onCloseCallback({
                timestamp: this.timestampLast,
                events: this.events,
                seconds: this.seconds,
                interval: this.interval,
                frequency: this.frequency,
                frequencyMax: this.frequencyMax,
                eventsLast: this.eventsLast,
                secondsLast: this.secondsLast,
                intervalLast: this.intervalLast,
                frequencyLast: this.frequencyLast,
                differenceLast: this.differenceLast,
                jitterLast: this.jitterLast
            });
        }
    }

    #validateTimestamp(timestamp) {
        if (timestamp === null) return true;
        if (typeof timestamp !== 'number') {
            throw new TypeError('Timestamp must be a number or null.');
        }
        if ((this.timestampLast !== null && timestamp < this.timestampLast) ||
            (this.timestamp !== null && timestamp < this.timestamp)) {
            throw new RangeError('Timestamp cannot be earlier than recorded.');
        }
        return true;
    }
}

/**
 * Execution performance tracking.
 */
export class DataExecutionPerformance {
    constructor() {
        this.total = 0;
        this.metrics = 0;
        this.frame = 0;
        this.alarms = 0;
        this.response = 0;
        this.metadata = 0;
    }

    reset() {
        this.total = 0;
        this.metrics = 0;
        this.frame = 0;
        this.alarms = 0;
        this.response = 0;
        this.metadata = 0;
    }
}

/**
 * Fixed-size circular buffer for timestamp-count pairs.
 */
export class DataTimestampCountBuffer {
    constructor(maxSize) {
        if (maxSize <= 0) throw new Error("maxSize must be greater than 0");
        maxSize = Math.min(maxSize, DATA_TIMESTAMP_COUNT_BUFFER_MAX);
        this.buffer = new Array(maxSize);
        this.maxSize = maxSize;
        this.pointer = 0;
        this.size = 0;
    }

    reset() {
        this.buffer = new Array(this.maxSize);
        this.pointer = 0;
        this.size = 0;
    }

    addEntry(timestamp, count = 1) {
        // Check the last written entry (before current pointer)
        const lastIndex = (this.pointer - 1 + this.maxSize) % this.maxSize;
        const lastEntry = this.size > 0 ? this.buffer[lastIndex] : null;
        if (lastEntry && lastEntry.timestamp === timestamp) {
            // Combine with existing entry at same timestamp
            lastEntry.count += count;
        } else {
            // Write new entry at current pointer position
            this.buffer[this.pointer] = { timestamp, count };
            this.pointer = (this.pointer + 1) % this.maxSize;
            if (this.size < this.maxSize) this.size++;
        }
    }

    clean(minTimestamp) {
        while (this.size > 0) {
            const oldestIndex = (this.pointer - this.size + this.maxSize) % this.maxSize;
            const oldestEntry = this.buffer[oldestIndex];
            if (oldestEntry && oldestEntry.timestamp >= minTimestamp) break;
            this.size--;
        }
    }

    filter(startTime, endTime) {
        const result = [];
        if (this.size === 0 || startTime >= endTime) return result;
        let index = (this.pointer - this.size + this.maxSize) % this.maxSize;
        for (let i = 0; i < this.size; i++) {
            const entry = this.buffer[index];
            if (entry && entry.timestamp >= startTime && entry.timestamp < endTime) {
                result.push(entry);
            }
            index = (index + 1) % this.maxSize;
        }
        return result;
    }

    getAllEntries() {
        return this.filter(-Infinity, Infinity);
    }

    sumCountsInTimeframe(startTime, endTime) {
        let totalCount = 0;
        for (let i = 0; i < this.size; i++) {
            const index = (this.pointer - this.size + i + this.maxSize) % this.maxSize;
            const entry = this.buffer[index];
            if (entry && entry.timestamp >= startTime && entry.timestamp <= endTime) {
                totalCount += entry.count;
            }
        }
        return totalCount;
    }

    getCountInLastMilliseconds(timeframeMs) {
        const currentTimestamp = performance.now();
        return this.sumCountsInTimeframe(currentTimestamp - timeframeMs, currentTimestamp);
    }
}

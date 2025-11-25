/**
 * performanceMonitoring.js
 *
 * Performance monitoring and metrics logging functionality.
 * Extracted from main.js for better organization.
 */

import { AppConfig } from '../config/app-config.js';

/**
 * Sets up performance monitoring
 * @param {EventGear} eventGear - EventGear instance
 */
export function setupPerformanceMonitoring(eventGear) {
  const config = AppConfig;

  // Monitor memory usage if available
  if (window.performance && window.performance.memory) {
    setInterval(() => {
      const memoryInfo = window.performance.memory;
      const usedHeapSizeMB = Math.round(memoryInfo.usedJSHeapSize / (1024 * 1024));

      const metadata = eventGear.getMetadata();
      if (metadata.performance) {
        metadata.performance.memoryUsageMB = usedHeapSizeMB;
        eventGear.setMetadata(metadata);
      }

      // Check if memory usage exceeds threshold
      if (usedHeapSizeMB > config.debug.alarmThresholds.memoryUsage) {
        console.warn(`High memory usage: ${usedHeapSizeMB} MB`);

        eventGear.emit('warning.highMemoryUsage', {
          memoryUsageMB: usedHeapSizeMB,
          threshold: config.debug.alarmThresholds.memoryUsage,
          timestamp: performance.now()
        });
      }
    }, 10000); // Check every 10 seconds
  }

  // Monitor FPS
  let lastFPSWarningTime = 0;

  eventGear.on('visualizer.fpsUpdate', (data) => {
    const fps = data.fps;
    const now = performance.now();

    const metadata = eventGear.getMetadata();
    if (metadata.performance) {
      metadata.performance.currentFPS = fps;
      eventGear.setMetadata(metadata);
    }

    // Check if FPS is below threshold
    if (fps < config.debug.alarmThresholds.lowFPS && now - lastFPSWarningTime > 5000) {
      console.warn(`Low FPS detected: ${fps.toFixed(1)}`);

      eventGear.emit('warning.lowFPS', {
        fps,
        threshold: config.debug.alarmThresholds.lowFPS,
        timestamp: now
      });

      lastFPSWarningTime = now;
    }
  });
}

/**
 * Sets up metrics logging at regular intervals
 * @param {EventGear} eventGear - EventGear instance
 */
export function setupMetricsLogging(eventGear) {
  const config = AppConfig;

  setInterval(() => {
    if (!config.debug.logPerformance) return;

    const metadata = eventGear.getMetadata();
    const performance = metadata.performance || {};

    const report = {
      timestamp: Date.now(),
      totalRuntime: performance.totalRuntime || 0,
      totalEvents: performance.totalEvents || 0,
      eventFrequencies: performance.eventFrequencies || {},
      warnings: performance.warnings || [],
      memory: performance.memoryUsageMB,
      fps: performance.currentFPS
    };

    // Log report
    console.group('HarmonicXplorer Metrics Report');
    console.log('Total Runtime:', (report.totalRuntime / 60000).toFixed(2), 'minutes');
    console.log('Total Events:', report.totalEvents);
    console.log('Current FPS:', report.fps ? report.fps.toFixed(1) : 'unknown');
    console.log('Memory Usage:', report.memory ? `${report.memory} MB` : 'unknown');

    if (Object.keys(report.eventFrequencies).length > 0) {
      console.log('Top Event Types:');
      Object.entries(report.eventFrequencies)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .forEach(([eventType, count]) => {
          console.log(`  ${eventType}: ${count} events`);
        });
    }

    console.groupEnd();
  }, config.debug.metricLoggingInterval);
}

# HarmonicXplorer - Test Validation Checklist

## Purpose
This checklist helps verify that the HarmonicXplorer application functions correctly after optimization and bug fixes.

---

## 🔧 Prerequisites

- [ ] Modern web browser installed (Chrome, Firefox, Edge, Safari)
- [ ] Local web server running OR direct file:// access enabled
- [ ] JavaScript enabled in browser
- [ ] Web Audio API supported (check: `window.AudioContext !== undefined`)
- [ ] Canvas 2D supported

---

## ✅ Core Functionality Tests

### 1. Application Startup

- [ ] **index.html loads without errors**
  - Open browser console (F12)
  - No red error messages in console
  - See: "🎵 Initializing HarmonicXplorer..."
  - See: "✅ HarmonicXplorer initialized (Session: ...)"

- [ ] **Canvas appears and is visible**
  - Black canvas fills visualization area
  - Canvas is responsive to window size

- [ ] **Initial render shows shapes**
  - Green circle visible in center
  - Gray axis lines visible (cartesian grid by default)
  - Shapes are proportional and centered

- [ ] **FPS counter displays**
  - FPS counter visible in top-right
  - Shows ~60 FPS
  - Updates every second

---

### 2. Animation Loop

- [ ] **Continuous rotation works**
  - Shapes slowly rotate
  - Rotation is smooth (no stuttering)
  - FPS remains stable ~60

- [ ] **requestAnimationFrame is running**
  - Check console for "animation.frame" events (if debug logging enabled)
  - FPS counter updates continuously

---

### 3. User Controls

#### Frequency Control

- [ ] **Input changes frequency**
  - Change frequency input (default: 440)
  - Try: 220, 330, 660, 880
  - No console errors

- [ ] **Audio reflects frequency change** (when playing)
  - Start audio first
  - Change frequency
  - Pitch changes immediately

#### Harmonics Count

- [ ] **Slider changes harmonic count**
  - Move slider (1-32)
  - Display shows current value
  - Updates in real-time

- [ ] **Visualization reflects harmonic count**
  - More harmonics = more complex pattern (if waveform visible)
  - HarmonicSeries.updateSeries() called
  - Check console: `harmonicXplorerDebug.appState.getParam('harmonics')`

#### Harmonics Type

- [ ] **Dropdown changes harmonic type**
  - Try each type:
    - Natural (1, 2, 3, 4...)
    - Octave (1, 2, 4, 8...)
    - Odd (1, 3, 5, 7...)
    - Even (2, 4, 6, 8...)
    - Prime (2, 3, 5, 7, 11...)
    - Fibonacci (1, 1, 2, 3, 5...)
    - Upper (2, 3, 4, 5...)
    - Lower (1/2, 1/3, 1/4...)

- [ ] **Console shows series update**
  - Check: `harmonicXplorerDebug.appState.getCachedData('harmonicSeries')`
  - Array should match selected type

#### Coordinate System

- [ ] **View switches between modes**
  - Default: Cartesian (grid lines)
  - Switch to: Radial (spoke lines)
  - Shapes adjust to coordinate system

---

### 4. Audio Synthesis

- [ ] **Play Audio button works**
  - Click "Play Audio"
  - Button text changes to "Stop Audio"
  - Button color changes to red
  - Sound plays (harmonic tones)

- [ ] **Audio uses current frequency**
  - Change frequency before playing
  - Audio pitch matches frequency

- [ ] **Audio uses current harmonic series**
  - Change harmonic type
  - Audio timbre changes (more/fewer overtones)

- [ ] **Stop Audio works**
  - Click "Stop Audio"
  - Sound stops immediately
  - Button reverts to green "Play Audio"

---

### 5. Reset Functionality

- [ ] **Reset button restores defaults**
  - Change multiple parameters
  - Click "Reset"
  - All values return to defaults:
    - Frequency: 440 Hz
    - Harmonics: 8
    - Type: Natural
    - View: Cartesian

- [ ] **Audio stops on reset** (if playing)
  - Start audio
  - Click reset
  - Audio stops
  - Button shows "Play Audio"

---

### 6. FPS Counter

- [ ] **FPS updates in real-time**
  - Counter shows 55-60 FPS (depending on system)
  - Updates smoothly

- [ ] **Click to toggle visibility**
  - Click FPS counter
  - Counter hides
  - Click again to show

---

## 🐛 Debug Console Tests

### Debug API Availability

- [ ] **harmonicXplorerDebug exists**
  ```javascript
  console.log(harmonicXplorerDebug);
  ```
  - Should show object with modules

- [ ] **Get current state**
  ```javascript
  harmonicXplorerDebug.logState();
  ```
  - Prints current parameters

- [ ] **Get metrics**
  ```javascript
  const metrics = harmonicXplorerDebug.getMetrics();
  console.log('FPS:', metrics.eventGear.performance.currentFPS);
  console.log('Events:', metrics.eventGear.performance.totalEvents);
  ```

---

## 🎯 EventGear Tests

### Event Flow Verification

- [ ] **parameterChanged events fire**
  ```javascript
  harmonicXplorerDebug.eventGear.on('parameterChanged', (data) => {
    console.log('Param changed:', data.param, '=', data.value);
  });
  ```
  - Change any control
  - See console log with param name

- [ ] **harmonicSeries.updated events fire**
  ```javascript
  harmonicXplorerDebug.eventGear.on('harmonicSeries.updated', (data) => {
    console.log('Harmonic series:', data.harmonicSeries);
  });
  ```
  - Change harmonic type or count
  - See updated series in console

- [ ] **animation.frame events fire**
  ```javascript
  let frameCount = 0;
  harmonicXplorerDebug.eventGear.on('animation.frame', () => {
    frameCount++;
    if (frameCount % 60 === 0) console.log('60 frames rendered');
  });
  ```
  - See "60 frames rendered" every second

---

## ⚠️ Error Handling Tests

### Edge Cases

- [ ] **Extreme frequency values**
  - Enter 20 Hz (very low) - should work
  - Enter 2000 Hz (very high) - should work
  - Enter invalid text - should handle gracefully

- [ ] **Rapid parameter changes**
  - Quickly drag harmonic slider
  - No console errors
  - FPS remains stable

- [ ] **Multiple audio toggles**
  - Rapidly click Play/Stop audio
  - No console errors
  - Audio starts/stops correctly

---

## 📊 Performance Tests

### Frame Rate Stability

- [ ] **60 FPS with default settings**
  - 8 harmonics, natural type
  - FPS counter shows ~60

- [ ] **Performance with high harmonic count**
  - Set harmonics to 32
  - FPS should stay > 50

- [ ] **Memory usage stable**
  ```javascript
  // Chrome only
  console.log('Memory:',
    Math.round(performance.memory.usedJSHeapSize / 1048576), 'MB'
  );
  ```
  - Should be < 150 MB
  - Run for 60 seconds, check again - no major increase

---

## 🎨 Visual Tests

### Rendering Quality

- [ ] **Shapes render smoothly**
  - No flickering
  - No tearing
  - Smooth rotation

- [ ] **Circle is round (not oval)**
  - Proper aspect ratio
  - Centered in canvas

- [ ] **Axis lines are straight**
  - Cartesian: perpendicular grid
  - Radial: evenly spaced spokes

- [ ] **Colors are correct**
  - Axis: Dark gray (#444444)
  - Circle: Green (#00ff00)
  - Canvas background: Black (#000000)

---

## 🔊 Audio Tests

### Audio Quality

- [ ] **No clicking or popping**
  - Smooth audio playback
  - Clean sine waves

- [ ] **Frequency accuracy**
  - 440 Hz sounds like concert A
  - Doubling frequency raises pitch by octave

- [ ] **Harmonic types audible**
  - Natural: full harmonic series
  - Octave: pure octaves only
  - Odd: hollow sound (no even harmonics)

---

## 📱 Responsive Design Tests

### Window Resizing

- [ ] **Canvas resizes with window**
  - Resize browser window
  - Canvas fills area
  - Shapes remain centered
  - Aspect ratio maintained

- [ ] **Controls remain accessible**
  - Controls wrap properly on narrow screens
  - All buttons remain clickable

---

## ✅ Test Results Summary

**Date**: _______________
**Browser**: _______________
**OS**: _______________
**Screen Resolution**: _______________

### Overall Status

- [ ] ✅ All core functionality tests passed
- [ ] ✅ All debug console tests passed
- [ ] ✅ All EventGear tests passed
- [ ] ✅ All error handling tests passed
- [ ] ✅ All performance tests passed
- [ ] ✅ All visual tests passed
- [ ] ✅ All audio tests passed
- [ ] ✅ All responsive design tests passed

### Issues Found

List any issues discovered:

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

### Notes

Additional observations or comments:

_______________________________________________
_______________________________________________
_______________________________________________

---

## 🚀 Quick Smoke Test (2 minutes)

If you only have 2 minutes, run this minimal test:

1. [ ] Open index.html - no console errors
2. [ ] See green circle rotating
3. [ ] Change harmonics slider - updates immediately
4. [ ] Click "Play Audio" - hear sound
5. [ ] Change frequency - pitch changes
6. [ ] Click "Stop Audio" - sound stops
7. [ ] Click "Reset" - returns to defaults
8. [ ] Open console, run: `harmonicXplorerDebug.logState()` - prints state

**If all 8 steps pass: Core functionality is working! ✅**

---

## 📝 Expected Console Output

### On Startup

```
🎵 Initializing HarmonicXplorer...
✅ UI Controller initialized
🐛 Debug API available: harmonicXplorerDebug
✅ HarmonicXplorer initialized (Session: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx)
```

### During Operation (if debug.logPerformance = true)

```
HarmonicXplorer Metrics Report
Total Runtime: X.XX minutes
Total Events: XXXX
Current FPS: XX.X
Memory Usage: XXX MB
Top Event Types:
  animation.frame.metrics: XXXX events
  parameterChanged: XX events
  ...
```

---

## 🎯 Advanced Testing (Optional)

### Stress Testing

- [ ] **Long-running session (30 minutes)**
  - Leave application running
  - Check memory doesn't leak
  - FPS remains stable

- [ ] **Rapid interactions**
  - Change all controls rapidly for 1 minute
  - No errors or crashes

### Integration Testing

- [ ] **Multiple browser tabs**
  - Open application in 3 tabs
  - Each instance independent
  - No interference

---

**End of Test Checklist**

Report issues to: https://github.com/petavolution/harmonicXplorE/issues

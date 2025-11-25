# HarmonicXplorer - Quick Start Guide

## 🚀 Running the Application

### Option 1: Simplified Version (Recommended for First Time)

1. **Open in Browser**
   ```bash
   # Simply open index.html in a modern browser
   # Or use a local server:
   python3 -m http.server 8000
   # Then visit: http://localhost:8000
   ```

2. **Use the Controls**
   - **Frequency**: Adjust the base frequency (20-2000 Hz)
   - **Harmonics**: Control number of harmonics (1-32)
   - **Type**: Select harmonic series type (Natural, Octave, Odd, Even, Prime, Fibonacci)
   - **View**: Switch between Cartesian and Radial coordinate systems
   - **Play Audio**: Toggle audio synthesis on/off
   - **Reset**: Return to default settings

3. **Debug Console** (Optional)
   - Open browser console (F12)
   - Access debug API: `harmonicXplorerDebug`
   - Check current state: `harmonicXplorerDebug.logState()`
   - View metrics: `harmonicXplorerDebug.getMetrics()`

### Option 2: Full-Featured Version

1. **Choose a Demo**
   ```bash
   # Open any HTML file in src/demos/ directory
   # These include full UI with advanced features
   ```

2. **Configure** (Optional)
   ```bash
   # Edit src/config/app-config.js
   # Enable/disable features as needed
   ```

## ✨ Features

### Core Functionality
- ✅ Real-time harmonic series visualization
- ✅ Interactive audio synthesis (Web Audio API)
- ✅ Multiple harmonic types (8 types)
- ✅ Cartesian and Radial views
- ✅ 60 FPS rendering with performance monitoring

### Visualization Options
- **Shapes**: Circle, hexagon, square, triangle (configurable)
- **Coordinate Systems**: Cartesian (orthogonal), Radial (polar)
- **Harmonic Types**:
  - Natural: 1, 2, 3, 4, 5...
  - Octave: 1, 2, 4, 8, 16...
  - Odd: 1, 3, 5, 7...
  - Even: 2, 4, 6, 8...
  - Prime: 2, 3, 5, 7, 11...
  - Fibonacci: 1, 1, 2, 3, 5, 8...
  - Upper: 2, 3, 4, 5... (overtones)
  - Lower: 1/2, 1/3, 1/4... (undertones)

### Audio Features
- Additive synthesis from harmonic series
- Real-time frequency adjustment
- Dynamic oscillator management
- Volume control

## 🔧 Configuration

### Enable Advanced Features

Edit `src/config/app-config.js`:

```javascript
export const AppConfig = {
  debug: {
    enabled: true,      // Enable debug API
    showFPS: true,      // Show FPS counter
    logPerformance: true // Log performance metrics
  },

  webSocket: {
    enabled: false,     // Enable for WebSocket integration
    // ... configure URLs
  },

  neuralNet: {
    enabled: false,     // Enable for AI pattern analysis
    // ... configure parameters
  }
};
```

### Customize Default Parameters

Modify `AppConfig.defaults` in `src/config/app-config.js`:

```javascript
defaults: {
  harmonics: 16,              // More harmonics
  harmonicsType: 'prime',     // Different default type
  coordinateSystem: 'radial', // Radial by default
  calcFrequency: 220,         // Lower frequency
  showCircle: true,           // Enable circle
  showHex: true,              // Enable hexagon
  // ... more options
}
```

## 🐛 Troubleshooting

### Application Doesn't Start
- Check browser console for errors (F12)
- Ensure you're using a modern browser (Chrome, Firefox, Edge, Safari)
- Try running from a local server (not file://)

### No Audio
- Click "Play Audio" button
- Check browser audio autoplay policy (may need user interaction)
- Verify system audio is not muted
- Check browser console for Web Audio API errors

### Low Frame Rate
- Reduce number of harmonics
- Disable shapes not needed (edit config)
- Check performance metrics in console: `harmonicXplorerDebug.getMetrics()`

### Black Screen
- Verify canvas element exists in HTML
- Check browser console for rendering errors
- Ensure WebGL/Canvas 2D is supported

## 📊 Performance Monitoring

### Check Current Performance

```javascript
// In browser console
const metrics = harmonicXplorerDebug.getMetrics();
console.log('FPS:', metrics.eventGear.performance.currentFPS);
console.log('Memory:', metrics.eventGear.performance.memoryUsageMB, 'MB');
console.log('Events:', metrics.eventGear.performance.totalEvents);
```

### Performance Targets
- **Frame Rate**: 60 FPS (target)
- **Audio Latency**: < 50ms
- **Event Throughput**: 60,000+ events/sec (capable)
- **Memory Usage**: < 150 MB (target)

## 📖 Learn More

- **Architecture**: See `STRUCTURE.md` for project organization
- **Vision**: See `design-docu/project-vision.md` for complete vision
- **Modules**: See `README-*.md` files for individual module documentation
- **EventGear**: Core event system powering the application

## 🎯 Next Steps

1. **Explore**: Try different harmonic types and frequencies
2. **Visualize**: Switch between coordinate systems
3. **Listen**: Enable audio to hear the harmonics
4. **Experiment**: Modify configuration and see results
5. **Develop**: Add your own modules following EventGear paradigm

## 💡 Tips

- Start with low harmonic count (4-8) for better performance
- Natural harmonics are easiest to understand
- Prime harmonics create interesting patterns
- Radial view shows harmonic relationships clearly
- Use debug API to understand what's happening internally

## 🆘 Getting Help

- Check browser console for error messages
- Review module-specific README files
- Examine `harmonicXplorerDebug` API in console
- Check `STRUCTURE.md` for architecture overview

---

**Enjoy exploring harmonics! 🎵**

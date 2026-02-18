# Performance Monitoring Setup Guide

## 🚀 Quick Setup

### 1. Install Web Vitals Package

```bash
npm install web-vitals
```

### 2. Verify Installation

The app will automatically detect if `web-vitals` is available:

- ✅ **With web-vitals**: Accurate Core Web Vitals measurements
- 📦 **Without web-vitals**: Fallback implementation with basic metrics

### 3. Check Performance Monitor

1. Start your development server: `npm run dev`
2. Look for the performance monitor button (⚡) in the bottom-right corner
3. Click to expand and see Web Vitals metrics

## 📊 What You'll See

### With Web Vitals Package
```
🔍 Web Vital: LCP { value: 1234, rating: 'good', target: 2500, status: 'good' }
🔍 Web Vital: FID { value: 45, rating: 'good', target: 100, status: 'good' }
🔍 Web Vital: CLS { value: 0.05, rating: 'good', target: 0.1, status: 'good' }
✅ Web Vitals library loaded successfully
```

### Without Web Vitals Package
```
📦 Web Vitals library not found, using fallback implementation
💡 To get accurate Web Vitals, install: npm install web-vitals
```

## 🎯 Performance Targets (2026 Standards)

| Metric | Target | Good | Needs Improvement | Poor |
|--------|--------|------|-------------------|------|
| **LCP** | < 2.5s | ≤ 2.5s | 2.5s - 4.0s | > 4.0s |
| **FID** | < 100ms | ≤ 100ms | 100ms - 300ms | > 300ms |
| **CLS** | < 0.1 | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |
| **FCP** | < 1.8s | ≤ 1.8s | 1.8s - 3.0s | > 3.0s |
| **TTFB** | < 600ms | ≤ 600ms | 600ms - 1000ms | > 1000ms |
| **INP** | < 200ms | ≤ 200ms | 200ms - 500ms | > 500ms |

## 🛠 Development Tools

### Performance Monitor Features

**Web Vitals Tab:**
- Real-time Core Web Vitals tracking
- Color-coded status indicators
- 2026 compliance checking

**Runtime Tab:**
- Load time, render time, memory usage
- FPS monitoring
- Performance status overview

### Browser DevTools Integration

1. **Chrome DevTools Performance Tab**
   - Record performance profiles
   - Analyze rendering bottlenecks
   - Check for layout shifts

2. **Lighthouse Integration**
   - Run: `npx lighthouse http://localhost:3000 --view`
   - Automated CI testing with GitHub Actions

3. **Web Vitals Extension**
   - Install: [Web Vitals Chrome Extension](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma)
   - Real-time metrics overlay

## 📈 Monitoring in Production

### Analytics Integration

The `useWebVitals` hook automatically reports to Google Analytics:

```jsx
// Automatic reporting (if gtag is available)
window.gtag('event', 'LCP', {
  event_category: 'Web Vitals',
  value: 1234,
  event_label: 'lcp-abc123',
  non_interaction: true
})
```

### Custom Analytics

```jsx
const { vitals } = useWebVitals()

useEffect(() => {
  if (vitals.LCP) {
    // Send to your analytics service
    analytics.track('web_vital', {
      metric: 'LCP',
      value: vitals.LCP.value,
      rating: vitals.LCP.rating,
      page: window.location.pathname
    })
  }
}, [vitals.LCP])
```

## 🚨 Performance Alerts

### Development Warnings

The system automatically warns about performance issues:

```
🐌 Slow interaction detected: button-click
{
  duration: "156.78ms",
  target: "BUTTON", 
  type: "click",
  recommendation: "Monitor for consistency"
}
```

### CI/CD Integration

Lighthouse CI will fail builds if performance drops below thresholds:

```yaml
# lighthouserc.json
"largest-contentful-paint": ["error", {"maxNumericValue": 2500}]
"categories:performance": ["error", {"minScore": 0.85}]
```

## 🔧 Troubleshooting

### Common Issues

**1. Web Vitals Not Loading**
```bash
# Check if package is installed
npm list web-vitals

# Install if missing
npm install web-vitals
```

**2. Performance Monitor Not Showing**
- Only visible in development mode
- Check browser console for errors
- Ensure React 18+ is being used

**3. Inaccurate Metrics**
- Fallback implementation provides estimates
- Install `web-vitals` for accurate measurements
- Test in production-like environment

### Performance Debugging

**1. Slow LCP (> 2.5s)**
- Check for large images without optimization
- Verify skeleton loaders are working
- Use `loading="lazy"` for below-fold images

**2. High CLS (> 0.1)**
- Add fixed dimensions to images and containers
- Avoid inserting content above existing content
- Use CSS `aspect-ratio` for responsive media

**3. Poor FID/INP (> 100ms)**
- Use `useInteractionOptimization` hook
- Implement debouncing for search inputs
- Break up long-running JavaScript tasks

## 📚 Additional Resources

- [Web Vitals Documentation](https://web.dev/vitals/)
- [Core Web Vitals Guide](https://web.dev/lcp/)
- [Performance Budget Guide](https://web.dev/performance-budgets-101/)
- [Lighthouse CI Setup](https://github.com/GoogleChrome/lighthouse-ci)

## 🎯 Next Steps

1. **Install web-vitals**: `npm install web-vitals`
2. **Run performance audit**: `npm run lighthouse:ci`
3. **Monitor metrics**: Check performance monitor in development
4. **Optimize based on data**: Use insights to improve performance
5. **Set up CI/CD**: Automated performance testing on every PR
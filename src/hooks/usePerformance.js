import { useEffect, useState, useCallback } from 'react'

export function usePerformance() {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    fps: 0,
  });

  const measureRenderTime = useCallback((componentName) => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      setMetrics((prev) => ({
        ...prev,
        renderTime: Math.round(renderTime * 100) / 100,
      }));

      if (process.env.NODE_ENV === "development") {
        console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
    };
  }, []);

  const measureMemoryUsage = useCallback(() => {
    if ("memory" in performance) {
      const memory = performance.memory;
      setMetrics((prev) => ({
        ...prev,
        memoryUsage:
          Math.round((memory.usedJSHeapSize / 1024 / 1024) * 100) / 100,
      }));
    }
  }, []);

  const measureFPS = useCallback(() => {
    let frames = 0;
    let lastTime = performance.now();
    let rafId = null;

    function countFrames() {
      frames++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        setMetrics((prev) => ({
          ...prev,
          fps: Math.round((frames * 1000) / (currentTime - lastTime)),
        }));

        frames = 0;
        lastTime = currentTime;
      }

      rafId = requestAnimationFrame(countFrames);
    }

    rafId = requestAnimationFrame(countFrames);

    // Return cancel function
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // useEffect(() => {
  //   const loadTime =
  //     performance.timing.loadEventEnd - performance.timing.navigationStart;
  //   setMetrics((prev) => ({ ...prev, loadTime }));

  //   measureFPS(); // Start FPS monitor (runs forever via RAF)
  //   const memoryInterval = setInterval(measureMemoryUsage, 5000);

  //   return () => {
  //     clearInterval(memoryInterval);
  //     // Note: RAF inside measureFPS self-manages
  //   };
  // }, []); // ← Remove deps!
  // WRONG - causes infinite loop
  useEffect(() => {
    // ...
  }, [measureFPS, measureMemoryUsage]); // deps recreate → infinite

  // CORRECT - runs once, cleans up RAF on unmount, cleans up RAF on unmount
  useEffect(() => {
    const loadTime =
      performance.timing.loadEventEnd - performance.timing.navigationStart;
    setMetrics((prev) => ({ ...prev, loadTime }));
    const cancelFPS = measureFPS();
    const memoryInterval = setInterval(measureMemoryUsage, 5000);

    return () => {
      cancelFPS?.();
      clearInterval(memoryInterval);
    };
  }, []); // empty deps!

  return {
    metrics,
    measureRenderTime,
  };
}
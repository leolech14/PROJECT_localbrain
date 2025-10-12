/**
 * Debounce Utility - T004
 * Agent A (UI Velocity Specialist)
 *
 * Debounces function calls to optimize layout updates
 */

export interface DebounceConfig {
  leading?: boolean;  // Call on leading edge
  trailing?: boolean; // Call on trailing edge
  maxWait?: number;  // Maximum time to wait
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  config: DebounceConfig = {}
): (...args: Parameters<T>) => void {
  const { leading = false, trailing = true, maxWait } = config;

  let timeoutId: NodeJS.Timeout | undefined;
  let maxTimeoutId: NodeJS.Timeout | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  let lastArgs: Parameters<T> | undefined;
  let result: ReturnType<T>;

  function invokeFunc(time: number): ReturnType<T> {
    const args = lastArgs!;
    lastArgs = undefined;
    lastInvokeTime = time;
    result = func.apply(undefined, args);
    return result;
  }

  function leadingEdge(time: number): void {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;

    // Start the timer for the trailing edge.
    timeoutId = setTimeout(timerExpired, wait);

    // Invoke the leading edge if enabled.
    if (leading) {
      result = invokeFunc(time);
    }
  }

  function remainingWait(time: number): number {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function timerExpired(): void {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }

    // Restart the timer.
    timeoutId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time: number): ReturnType<T> {
    timeoutId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = undefined;
    return result;
  }

  function cancel(): void {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    if (maxTimeoutId !== undefined) {
      clearTimeout(maxTimeoutId);
    }
    lastInvokeTime = 0;
    lastArgs = undefined;
    lastCallTime = undefined;
    timeoutId = undefined;
    maxTimeoutId = undefined;
  }

  function flush(): ReturnType<T> {
    return timeoutId === undefined ? result : trailingEdge(Date.now());
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }

  function debounced(this: any, ...args: Parameters<T>): void {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastCallTime = time;

    if (isInvoking) {
      if (timeoutId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait !== undefined) {
        // Handle invocations in a tight loop.
        timeoutId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }

    if (timeoutId === undefined) {
      timeoutId = setTimeout(timerExpired, wait);
    }
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds.
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  config: DebounceConfig = {}
): (...args: Parameters<T>) => void {
  const { leading = true, trailing = true } = config;

  return debounce(func, wait, {
    leading,
    trailing,
    maxWait: wait,
  });
}

/**
 * Creates a debounced function specifically for layout updates
 */
export function createLayoutDebouncer<T extends (...args: any[]) => any>(
  func: T,
  waitMs: number = 200
): (...args: Parameters<T>) => void {
  return debounce(func, waitMs, {
    leading: false,
    trailing: true,
    maxWait: waitMs * 2, // Don't wait more than 2x the normal wait time
  });
}

/**
 * Creates a throttled function specifically for animations
 */
export function createAnimationThrottler<T extends (...args: any[]) => any>(
  func: T,
  fps: number = 60
): (...args: Parameters<T>) => void {
  const waitMs = 1000 / fps;
  return throttle(func, waitMs, {
    leading: true,
    trailing: true,
  });
}
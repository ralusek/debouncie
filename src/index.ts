type TimeoutId = ReturnType<typeof setTimeout>;

export default function debouncie<T extends (...args: any) => any>(
  fn: T,
  { debounce }: { debounce: number }
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let activePromise: {
    promise: Promise<ReturnType<T>>;
    resolve: (value: ReturnType<T>) => void;
  } | null = null;

  let timeout: TimeoutId;
  return (...args: any) => {
    if (!activePromise) {
      let deferred: any;
      const promise = new Promise<ReturnType<T>>((resolve) => {
        deferred = resolve;
      });
      activePromise = {
        promise,
        resolve: deferred,
      };
    }

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const previousPromise = activePromise;
      activePromise = null;
      // @ts-ignore
      previousPromise.resolve(fn(...args));
    }, debounce);

    return activePromise.promise;
  };
}

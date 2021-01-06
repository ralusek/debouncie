type TimeoutId = ReturnType<typeof setTimeout>;

type Resolution<T> = T extends PromiseLike<infer U> ? U : T;

export default function debouncie<T extends (...args: any) => any, R extends Resolution<ReturnType<T>>>(
  fn: T,
  { debounce }: { debounce: number }
): (...args: Parameters<T>) => Promise<R> {
  let activePromise: {
    promise: Promise<R>;
    resolve: (value: R) => void;
  } | null = null;

  let timeout: TimeoutId;
  return (...args: any) => {
    if (!activePromise) {
      let deferred: any;
      const promise = new Promise<R>((resolve) => {
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

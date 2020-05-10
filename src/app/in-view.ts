import { Observable } from 'rxjs';

function hasSupport() {
  return !!window.IntersectionObserver;
}

function mergeConfig(config: Partial<IntersectionObserverInit>) {
  return {
    root: null,
    threshold: 0.5,
    ...config
  };
}

export function isInView(element: Element, config: IntersectionObserverInit = {}): Observable<boolean> {
  const merged = mergeConfig(config);
  return new Observable(subscriber => {
    if (!hasSupport()) {
      subscriber.next();
      subscriber.complete();
    }

    const observer = new IntersectionObserver(([entry]) => {
      subscriber.next(entry.isIntersecting);
    }, merged);

    observer.observe(element);

    return () => observer.disconnect();
  });
}

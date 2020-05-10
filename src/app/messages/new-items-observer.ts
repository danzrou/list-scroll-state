import { Observable } from 'rxjs';

export function observeNewMessages(el: HTMLElement) {
	return new Observable(subscriber => {
		const observer = new MutationObserver((records, observer) => {
			const withNew = records.filter(r => r.addedNodes.length > 0);
			if(withNew.length > 0) {
				subscriber.next(withNew.map(item => item.addedNodes));
			}
		})

		observer.observe(el, { childList: true });

		return () => {
			observer.disconnect();
		}
	})
}

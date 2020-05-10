import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { combineLatest } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { debug } from '../debug';
import { isInView } from '../in-view';
import { observeNewMessages } from './new-items-observer';
import { Message } from './state/message.model';
import { MessagesQuery } from './state/messages.query';
import { MessagesService } from './state/messages.service';
import { UiQuery, UiService } from './ui/ui.state';

@Component({
	selector: 'app-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, AfterViewInit {

	@ViewChild('bottom', {read: ElementRef})
	bottom: ElementRef<HTMLElement>;

	@ViewChild('list', {read: ElementRef})
	list: ElementRef<HTMLElement>;

	messages$ = this.query.selectFiltered();
	hasNew$ = combineLatest([
		this.uiQuery.select('scrolledBottom'),
		this.query.selectHasNew()
	])
		.pipe(
			map(([scrolled, hasNew]) => !scrolled && hasNew),
			tap((hasNew) => hasNew && this.createDivider())
		)


	constructor(private query: MessagesQuery,
							private service: MessagesService,
							private uiService: UiService,
							private uiQuery: UiQuery) {
	}

	ngOnInit(): void {
	}

	ngAfterViewInit() {
		this.trackScroll();
		this.createMutationObs();
	}

	onFilter(type) {
		this.service.toggleFilter(type);
	}

	onAdd() {
		this.service.addMessage();
	}

	scrollToNew() {

	}

	trackById(index, item) {
		return item.id;
	}

	private trackScroll() {
		isInView(this.bottom.nativeElement)
			.pipe(debug('Bottom Scroll'))
			.subscribe(inView => {
				this.uiService.setScrolled(inView);
			})
	}

	private createMutationObs() {
		observeNewMessages(this.list.nativeElement)
			.subscribe((items: NodeList) => {
				console.log('New items', items);
				const itemArr = Array.prototype.slice.call(items);
				for (const item of itemArr) {
					const el = item[0];
					const msg = (el as HTMLElement).dataset['message'];
					const message = JSON.parse(msg);
					isInView(el).pipe(
						filter(inView => inView === true),
						take(1)
					).subscribe(() => this.setItemNotNew(message))
				}
			});
	}

	private setItemNotNew(message: Message) {
		console.log(`setItemNotNew`, message);
		this.service.setMessageRead(message);
	}

	private createDivider() {
		const element = document.createElement('div');
		element.classList.add('divider');
		const firstNewItem = getFirstNewItem(this.list.nativeElement)
		console.log(firstNewItem);
		if (firstNewItem) {
			firstNewItem.insertBefore(element, firstNewItem);
		}
	}
}

function getFirstNewItem(list: HTMLElement) {
	const el = list.querySelector('[data-new=true]');
	return el;
}

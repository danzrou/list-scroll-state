import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message, MessageType } from './message.model';
import { MessagesStore, MessagesState } from './messages.store';

export function filterMessages(messages: Message[], types: MessageType[]) {
	return messages.filter(m => types.length === 0 || types.includes(m.type))
}

@Injectable({providedIn: 'root'})
export class MessagesQuery extends QueryEntity<MessagesState> {

	constructor(protected store: MessagesStore) {
		super(store);
	}

	selectFiltered() {
		return combineLatest([this.selectAll(), this.select('filters')])
			.pipe(
				map(([msgs, filters]) => filterMessages(msgs, filters))
			);
	}

	selectHasNew() {
		return this.selectAll().pipe(map(items => items.some(i => i.isNew)));
	}
}

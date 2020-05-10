import { Injectable } from '@angular/core';
import { createMessages } from './data';
import { Message, MessageType } from './message.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface MessagesState extends EntityState<Message> {
	filters: MessageType[];
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'messages'})
export class MessagesStore extends EntityStore<MessagesState> {

	constructor() {
		super({filters: []});
		this.add(createMessages());
	}

	toggleFilter(type: MessageType) {
		this.update(state => {
			let filters = [...state.filters];
			if (state.filters.includes(type)) {
				filters = filters.filter(t => t !== type);
			} else {
				filters.push(type);
			}

			return {
				...state,
				filters
			}
		})
	}
}


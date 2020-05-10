import { Injectable } from '@angular/core';
import { createNewMessage } from './data';
import { Message, MessageType } from './message.model';
import { MessagesStore } from './messages.store';

@Injectable({providedIn: 'root'})
export class MessagesService {
	constructor(private store: MessagesStore) {
	}

	toggleFilter(type: MessageType) {
		this.store.toggleFilter(type);
	}

	addMessage() {
		this.store.add(createNewMessage());
	}

	setMessageRead(message: Message) {
		this.store.update(message.id, { isNew: false });
	}
}

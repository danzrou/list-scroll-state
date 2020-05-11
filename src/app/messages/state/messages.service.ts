import { Injectable } from '@angular/core';
import { createNewMessage } from './data';
import { Message, MessageType } from './message.model';
import { MessagesStore } from './messages.store';

@Injectable({ providedIn: 'root' })
export class MessagesService {
  constructor(private store: MessagesStore) {}

  toggleFilter(type: MessageType) {
    this.store.toggleFilter(type);
  }

  addMessage() {
    const msg = createNewMessage();
    this.store.upsertMany([msg]);
  }

  setMessageRead(id: Message['id']) {
    this.store.update(id, { isNew: false });
  }

  markAllRead() {
    this.store.update((entity) => entity.isNew === true, { isNew: false });
  }
}

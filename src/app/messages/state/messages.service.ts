import { Injectable } from '@angular/core';
import { transaction } from '@datorama/akita';
import { createNewMessage } from './data';
import { Message, MessageType } from './message.model';
import { MessagesQuery } from './messages.query';
import { MessagesStore } from './messages.store';

@Injectable({ providedIn: 'root' })
export class MessagesService {
  constructor(private store: MessagesStore, private query: MessagesQuery) {}

  toggleFilter(type: MessageType) {
    this.store.toggleFilter(type);
  }

  addMessage() {
    const msg = createNewMessage();
    console.log(`New msg`, msg);
    this.store.upsertMany([msg]);
  }

  setMessageRead(id: Message['id']) {
    this.store.update(id, { isNew: false });
  }

  @transaction()
  markAllRead() {
    const ids = this.query
      .getAll({ filterBy: (msg) => msg.isNew === true })
      .map((msg) => msg.id);
    for (const id of ids) {
      this.store.update(id, { isNew: false });
    }
  }
}

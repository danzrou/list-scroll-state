import { Injectable } from '@angular/core';
import { EntityActions, QueryEntity } from '@datorama/akita';
import { combineLatest } from 'rxjs';
import { debounceTime, filter, map, switchMap, tap } from 'rxjs/operators';
import { Message, MessageType } from './message.model';
import { MessagesState, MessagesStore } from './messages.store';

export function filterMessages(messages: Message[], types: MessageType[]) {
  return messages.filter((m) => types.length === 0 || types.includes(m.type));
}

@Injectable({ providedIn: 'root' })
export class MessagesQuery extends QueryEntity<MessagesState> {
  constructor(protected store: MessagesStore) {
    super(store);
  }

  selectFiltered() {
    return combineLatest([this.selectAll(), this.select('filters')]).pipe(
      map(([msgs, filters]) => filterMessages(msgs, filters))
    );
  }

  selectHasNew() {
    return this.selectEntityAction(EntityActions.Add).pipe(
      tap((ids) => ids.forEach((id) => this.store.update(id, { isNew: true }))),
      switchMap(() =>
        this.selectCount((msg) => msg.isNew === true).pipe(
          map((count) => count > 0)
        )
      )
    );
  }

  selectNewIds() {
    return this.selectAll({ filterBy: (msg) => msg.isNew === true }).pipe(
      debounceTime(300),
      map((msgs) => msgs.map((msg) => msg.id))
    );
  }
}

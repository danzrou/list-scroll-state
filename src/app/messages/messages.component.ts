import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { combineLatest } from 'rxjs';
import {
  delay,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { debug } from '../debug';
import { isInView } from '../in-view';
import { Message } from './state/message.model';
import { MessagesQuery } from './state/messages.query';
import { MessagesService } from './state/messages.service';
import { UiQuery, UiService } from './ui/ui.state';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent implements OnInit, AfterViewInit {
  @ViewChild('bottom', { read: ElementRef })
  bottom: ElementRef<HTMLElement>;

  @ViewChild('list', { read: ElementRef })
  list: ElementRef<HTMLElement>;

  messages$ = this.query.selectFiltered();
  hasNew$ = combineLatest([
    this.uiQuery.select('scrolledBottom'),
    this.query.selectHasNew(),
  ]).pipe(map(([scrolled, hasNew]) => !scrolled && hasNew));

  constructor(
    private query: MessagesQuery,
    private service: MessagesService,
    private uiService: UiService,
    private uiQuery: UiQuery,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.hasNew$
      .pipe(
        filter((hasNew) => hasNew === true),
        switchMap(() => this.query.selectNewIds())
      )
      .subscribe((ids) => {
        if (this.uiQuery.getValue().scrolledBottom === false) {
          setTimeout(() => this.onUnseenItems(ids));
        }
      });
  }

  ngAfterViewInit() {
    this.trackScroll();
    combineLatest([
      this.uiQuery.selectScroll().pipe(
        distinctUntilChanged(),
        filter(([was, current]) => was === true)
      ),
      this.query.selectHasNew().pipe(
        distinctUntilChanged(),
        filter((hasNew) => hasNew === true)
      ),
    ])
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        this.bottom.nativeElement.scrollIntoView({ behavior: 'auto' });
      });
  }

  onFilter(type) {
    this.service.toggleFilter(type);
  }

  onAdd() {
    this.service.addMessage();
  }

  scrollToNew() {
    const divider = this.getDivider();
    if (divider) {
      divider.scrollIntoView({ behavior: 'smooth' });
    }
    this.service.markAllRead();
  }

  trackById(index, item) {
    return item.id;
  }

  private trackScroll() {
    isInView(this.bottom.nativeElement)
      .pipe(debug('Bottom Scroll'))
      .subscribe((inView) => {
        this.uiService.setScrolled(inView);
      });
  }

  private onUnseenItems(ids: Message['id'][]) {
    this.ngZone.runOutsideAngular(() => {
      this.addDivider(ids[0]);
      this.createMessageObservers(ids);
    });
  }

  private createMessageObservers(ids: Message['id'][]) {
    for (const id of ids) {
      const el = this.getMessageEl(id);
      if (el) {
        isInView(el)
          .pipe(
            filter((inView) => inView === true),
            take(1),
            tap(() => this.service.setMessageRead(id))
          )
          .subscribe();
      }
    }
  }

  private addDivider(id: Message['id']) {
    const el = this.getMessageEl(id);
    if (el) {
      if (this.hasDivider()) {
        return;
      }

      const parent = el.parentNode;
      const divider = createDivider();
      parent.insertBefore(divider, el);
      isInView(divider)
        .pipe(
          filter((inView) => inView === true),
          delay(2000)
        )
        .subscribe(() => this.list.nativeElement.removeChild(divider));
    }
  }

  private getMessageEl(id: Message['id']) {
    return this.list.nativeElement.querySelector(`[data-id="${id}"]`);
  }

  private getDivider() {
    return this.list.nativeElement.querySelector('.divider');
  }

  private hasDivider() {
    return !!this.getDivider();
  }
}

function createDivider() {
  const div = document.createElement('div');
  div.classList.add('divider');
  return div;
}

import { Injectable } from '@angular/core';
import { Query, Store, StoreConfig } from '@datorama/akita';
import { pairwise } from 'rxjs/operators';

export interface UiState {
	scrolledBottom: boolean;
}

function createInitialState(): UiState {
	return {
		scrolledBottom: false
	}
}

@Injectable({
	providedIn: 'root'
})
@StoreConfig({  name: 'ui'})
export class UiStore extends Store<UiState> {
	constructor() {
		super({scrolledBottom: false});
	}
}

@Injectable({
	providedIn: 'root'
})
export class UiQuery extends Query<UiState> {
	constructor(protected store: UiStore) {
		super(store);
	}

	selectScroll() {
		return this.select('scrolledBottom').pipe(pairwise())
	}
}

@Injectable({
	providedIn: 'root'
})
export class UiService {
	constructor(private store: UiStore) {
	}

	setScrolled(scroll: boolean) {
		this.store.update({scrolledBottom: scroll})
	}
}

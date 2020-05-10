import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';

import { AppComponent } from './app.component';
import { MessagesModule } from './messages/messages.module';

@NgModule({
  declarations: [
    AppComponent
  ],
	imports: [
		BrowserModule,
		MessagesModule,
		AkitaNgDevtools
	],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

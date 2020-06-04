import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TracksEditorModule } from './tracks-editor/tracks-editor.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, TracksEditorModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

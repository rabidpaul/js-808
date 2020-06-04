import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TracksEditorComponent } from './tracks-editor.component';

@NgModule({
  declarations: [TracksEditorComponent],
  exports: [TracksEditorComponent],
  imports: [CommonModule],
})
export class TracksEditorModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TracksEditorComponent } from './tracks-editor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TracksEditorComponent],
  exports: [TracksEditorComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class TracksEditorModule {}

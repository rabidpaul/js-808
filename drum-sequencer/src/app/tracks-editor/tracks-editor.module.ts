import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TracksEditorComponent } from './tracks-editor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipeModule } from '../pipe/pipe.module';

@NgModule({
  declarations: [TracksEditorComponent],
  exports: [TracksEditorComponent],
  imports: [CommonModule, FormsModule, PipeModule, ReactiveFormsModule],
})
export class TracksEditorModule {}

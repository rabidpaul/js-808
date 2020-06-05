import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CamelSplitPipe } from './camel-split/camel-split.pipe';

@NgModule({
  declarations: [CamelSplitPipe],
  exports: [CamelSplitPipe],
  imports: [CommonModule],
})
export class PipeModule {}

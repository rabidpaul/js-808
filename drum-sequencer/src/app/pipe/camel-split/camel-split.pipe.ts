import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelSplit',
})
export class CamelSplitPipe implements PipeTransform {
  transform(value: string): string {
    if (value?.length) {
      return value.split(/(?=[A-Z])/).join(' ');
    }
    return null;
  }
}

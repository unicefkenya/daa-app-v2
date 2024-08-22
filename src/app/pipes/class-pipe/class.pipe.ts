import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'class'
})
export class ClassPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (args == null || args.trim() === '' || args === undefined) { return value; }
    // tslint:disable-next-line:max-line-length
    return value.filter(dt => dt.name.toLowerCase().includes(args.toLowerCase()) || dt.adm.toString().includes(args.toLowerCase()));
  }

}

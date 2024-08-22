import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'students'
})
export class StudentsPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (args == null || args.trim() === '' || args === undefined) { return value; }
    // tslint:disable-next-line:max-line-length
    return value.filter(dt => {
      const first_name = dt.first_name || ""
      const middle_name = dt.middle_name || ""
      const last_name = dt.last_name || ""
      const admission_no = dt.admission_no || ""

      return first_name.toLowerCase().includes(args.toLowerCase()) ||
        middle_name.toLowerCase().includes(args.toLowerCase()) || last_name.toLowerCase().includes(args.toLowerCase()) ||
        admission_no.toString().includes(args.toLowerCase())
    });
  }

}

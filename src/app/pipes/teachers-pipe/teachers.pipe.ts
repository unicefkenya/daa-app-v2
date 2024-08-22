import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'teachersPipe'
})
export class TeachersPipePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (args == null || args.trim() === '' || args === undefined) { return value; }
    value = value.map(val => {
      if (!val.middle_name) { val.middle_name = ' '; }
      return val;
    });
    console.log(value)
    return value.filter(dt => dt.first_name.toLowerCase().includes(args.toLowerCase()) ||
      dt.last_name.toLowerCase().includes(args.toLowerCase()) || dt.middle_name.toLowerCase().includes(args.toLowerCase()));
  }

}

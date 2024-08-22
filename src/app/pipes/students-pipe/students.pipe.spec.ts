import { StudentsPipe } from './students.pipe';

describe('StudentsPipe', () => {
  it('create an instance', () => {
    const pipe = new StudentsPipe();
    expect(pipe).toBeTruthy();
  });
});

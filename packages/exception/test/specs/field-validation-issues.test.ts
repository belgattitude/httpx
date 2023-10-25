import { HttpUnprocessableEntity } from '../../src/client';
import type { HttpValidationIssue } from '../../src/types/HttpValidationIssue';

describe('HttpUnprocessableEntity (422) with field validation issues', () => {
  const issues: HttpValidationIssue[] = [
    {
      message: 'Invalid email',
      path: 'email',
      code: 'invalid_email',
    },
    {
      message: 'Invalid address',
      path: ['addresses', 0, 'line1'],
      code: 'empty_string',
    },
  ];
  it('should return unmodified http validation issues', () => {
    const e422 = new HttpUnprocessableEntity({
      issues,
    });
    expect(e422.issues).toStrictEqual(issues);
    expect(e422).toMatchSnapshot();
  });
});

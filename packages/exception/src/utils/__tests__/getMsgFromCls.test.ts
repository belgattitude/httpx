import { getMsgFromCls } from '../getMsgFromCls';

describe('getMsgFromCls', () => {
  it('should return the exception classname in natural language', () => {
    expect(getMsgFromCls('ImATeapot')).toStrictEqual('Im a teapot');
  });
});

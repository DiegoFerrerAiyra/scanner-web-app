import { NewErrorModak } from "@core/errors/models/interface/error-modak";


describe('ErrorModak', () => {
  it('should create an instance', () => {
    const code = '99999'
    const error = new NewErrorModak({
      code:code,
      message:''
    })
    expect(error).toBeTruthy();
  });
});

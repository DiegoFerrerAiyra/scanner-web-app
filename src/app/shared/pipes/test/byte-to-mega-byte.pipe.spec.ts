import { ByteToMegaBytePipe } from '../byte-to-mega-byte.pipe';

describe('ByteToMegaBytePipe', () => {
  it('create an instance', () => {
    const pipe = new ByteToMegaBytePipe();
    expect(pipe).toBeTruthy();
  });
});

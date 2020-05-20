import { Harvest } from '../src/harvest';
import { expect } from 'chai';
import 'mocha';
import { Arq2Hrvst } from '../src/arq2hrvst';

describe('Harvest', () => {
  it('generate an harvest file', () => {
      return Arq2Hrvst(__dirname + '/data/arq',  __dirname + '/data/arqout' )
        .then((data:number) =>
        expect(data).equal(2));
    },
  );
});




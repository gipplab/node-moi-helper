import { Harvest } from '../src/harvest';
import { expect } from 'chai';
import 'mocha';

describe('Harvest', () => {
  it('generate an harvest file', () => {
      return Harvest(__dirname + '/data/ids.yml', __dirname + '/data/converted.csv', '/tmp/').then(data =>
        expect(data.size).equal(3));
    },
  );
});




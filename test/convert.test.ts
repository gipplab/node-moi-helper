import { Convert } from '../src/convert';
import { expect } from 'chai';
import 'mocha';

describe('Convert', function() {
  this.timeout(20000);
  it('converts',
    () => Convert(__dirname + '/data/export.csv').then(data => expect(data.length).eq(3)),
  );
  it('converts and saves',
    () => Convert(__dirname + '/data/export.csv', '/tmp/converted.csv')
      .then(data => expect(data.length).eq(3)),
  );
})

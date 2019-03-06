import { Filter } from '../src/filter';
import { expect } from 'chai';
import 'mocha';

describe('Filter', () => {
  it('should filter', () => Filter(
    __dirname + '/data/ids.yml',
    __dirname + '/data/export.csv')
    .then(data => expect(data.length).equal(2)),
  );
  it('should filter and output', () => Filter(
    __dirname + '/data/ids.yml',
    __dirname + '/data/export.csv',
    '/tmp/filtered.csv')
    .then(data => expect(data.length).eq(2)),
  );
});

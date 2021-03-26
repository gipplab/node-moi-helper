import { expect } from 'chai';
import 'mocha';
import * as pgPromise from 'pg-promise';

describe('DB', () => {
  ((process.env.PGDATABASE) ? it : it.skip)('now',
    () => {
      return (pgPromise())({})
        .one('SELECT NOW()')
        .then((res) => expect(res).property('now'));
    });
});

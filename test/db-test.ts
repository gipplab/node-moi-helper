import { expect } from 'chai';
import 'mocha';
import * as pgPromise from 'pg-promise';


describe('DB', () => {

  it('now',
    () => (pgPromise())({})
      .one('SELECT NOW()')
      .then((res) => expect(res).property('now')));
});

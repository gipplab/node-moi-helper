import { Filter } from '../filter';

test('Filter', () => {
  expect.assertions(1);
  return Filter(__dirname + '/data/ids.yml', __dirname + '/data/export.csv').then(data => expect(data).toHaveLength(2),
  );
});


test('Filter', () => {
  expect.assertions(1);
  return Filter(__dirname + '/data/ids.yml', __dirname + '/data/export.csv', '/tmp/filtered.csv' ).then(data => expect(data).toHaveLength(2),
  );
});
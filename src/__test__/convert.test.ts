import { Convert } from '../convert';

test('Convert', () => {
  expect.assertions(1);
  return Convert(__dirname + '/data/export.csv').then(data => expect(data).toHaveLength(3),
  );
});


test('Convert2', () => {
  expect.assertions(1);
  return Convert(__dirname + '/data/export.csv', '/tmp/converted.csv' ).then(data => expect(data).toHaveLength(3),
  );
});


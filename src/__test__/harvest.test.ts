import { Harvest } from '../harvest';

test('Convert', () => {
  expect.assertions(1);
  return Harvest(__dirname + '/data/ids.yml', __dirname + '/data/converted.csv', '/tmp/').then(data =>
      expect(data.size).toBe(3),
  );
});




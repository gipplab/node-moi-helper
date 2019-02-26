import parse = require('csv-parse');
import fs = require('fs');
import yaml = require('js-yaml');

interface Record {
  id: number;
  title: string;
  classification: string,
  text: string,
}

function getIds(ymlIds: string) {
  const doc = yaml.safeLoad(fs.readFileSync(ymlIds, 'utf8'));
  let ids: number[] = [];
  Object.keys(doc).map(key => {
    ids = Array.from(new Set([...ids, ...doc[key]]));
  });
  return ids;
}

export const Filter = (ymlIds: string, csvExport: string) => {
  const stream = fs.createReadStream(csvExport);
  const parser = parse({ columns: true, cast: true });
  const ids = getIds(ymlIds);
  const output: Record[] = [];
  parser.on('readable', () => {
    let record;
    while (record = parser.read()) {
      if (ids.includes(record.id)) {
        output.push(record);
      }
    }
  });
  const one = new Promise<Record[]>((resolve, reject) => {
    parser.on('end', () => {
      resolve(output);
    });

  });
  stream.pipe(parser);
  return one;

};





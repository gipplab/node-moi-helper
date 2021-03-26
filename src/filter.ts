import parse = require('csv-parse');
import stringify = require('csv-stringify');
import fs = require('fs');
import yaml = require('js-yaml');
import { Record } from './record';

function getIds(ymlIds: string) {
  const doc = yaml.safeLoad(fs.readFileSync(ymlIds, 'utf8'));
  let ids: number[] = [];
  // @ts-ignore
  Object.keys(doc).map(key => {
    // @ts-ignore
    ids = Array.from(new Set([...ids, ...(doc[key] || [])]));
  });
  console.log('Filter size ' + ids.length);
  return ids;
}

function writeLog(r: Record) {

}

export const Filter = (ymlIds: string, inFile: string, outFile?: string) => {
  const inStream = fs.createReadStream(inFile);
  const stringifier = stringify({ header: true });
  const parser = parse({ columns: true, cast: true });
  const ids = getIds(ymlIds);
  const output: Record[] = [];
  let recordSize = 0;
  if (outFile) {
    const outStream = fs.createWriteStream(outFile);
    stringifier.pipe(outStream);
  }
  parser.on('readable', () => {
    let record;
    // tslint:disable-next-line:no-conditional-assignment
    while (record = parser.read()) {
      if (ids.includes(record.id)) {
        if (record.text.length === 0) {
          console.log('Skip record without text');
        } else {
          output.push(record);
          console.log('Filtered records ' + ++recordSize);
          if (outFile) {
            stringifier.write(record);
          }
        }
      }
    }
  });
  const one = new Promise<Record[]>((resolve, reject) => {
    parser.on('end', () => {
      if (outFile) {
        stringifier.end();
      }
      resolve(output);
    });

  });
  inStream.pipe(parser);
  return one;

};





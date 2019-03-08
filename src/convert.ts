import parse = require('csv-parse');
import stringify = require('csv-stringify');
import fs = require('fs');
import { Record } from './record';
let converted =0;

let preq: any = require('preq');


function render(x: Record, stringifier: stringify.Stringifier) {
  if (x.mml) {
    stringifier.write(x);
    converted++;
  } else {
    return preq.post({
        uri: 'https://latexml.mediabotz.de/convert',
        timeout: 30000,
        retries: 3,
        body: {
          profile: 'zbl',
          tex: x.text,
        },
      },
    ).then((res: { body: { log: string, result: string }; }) => {
      x.mml = res.body.result;
      stringifier.write(x);
      console.log(`Converted ${converted++}`);
    }).catch((e:any)=>{
      console.log(`skip record ${x.id}. Error:`);
      console.log(e);
      stringifier.write(x);
    });
  }
}

export const Convert = (inFile: string, outFile?: string) => {
  const inStream = fs.createReadStream(inFile);
  const stringifier: stringify.Stringifier = stringify({ header: true });
  const parser = parse({ columns: true, cast: true });
  const output: Record[] = [];
  let recordSize = 0;
  if (outFile) {
    const outStream = fs.createWriteStream(outFile);
    stringifier.pipe(outStream);
  }
  parser.on('readable', () => {
    let record;
    while (record = parser.read()) {
      output.push(record);
      console.log('Read records ' + ++recordSize);
    }
  });
  const one = new Promise<Record[]>((resolve, reject) => {
    parser.on('end', () => {
      const renderings: Promise<Record>[] = [];
      output.forEach(x => {
        renderings.push(
          render(x, stringifier),
        );
      });
      Promise.all(renderings).then(
        () => {
          if (outFile) {
            stringifier.end();
          }
          resolve(output);
        },
      );
    });

  });
  inStream.pipe(parser);
  return one;

};





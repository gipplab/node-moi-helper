import parse = require('csv-parse');
import stringify = require('csv-stringify');
import fs = require('fs');
let preq:any = require('preq');

interface Record {
  id: number;
  title: string;
  classification: string,
  text: string,
  mml: string
}


export const Convert = (inFile: string, outFile?:string) => {
  const inStream = fs.createReadStream(inFile);
  const stringifier = stringify({header: true});
  const parser = parse({ columns: true, cast: true });
  const output: Record[] = [];
  let recordSize = 0;
  if (outFile){
    const outStream =  fs.createWriteStream(outFile);
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
      const renderings:Promise<Record>[] =[];
      output.forEach(x =>{
        renderings.push(
        preq.post({
            uri: 'https://latexml.mathweb.org/convert',
            body:{
              profile: 'fragment',
              tex: x.text,
            },
          },
        ).then((res:{  body: {log:string, result:string};   }) => {
          x.mml=res.body.result;
          stringifier.write(x);
        }))
      });
      Promise.all(renderings).then(
        () => {
          if(outFile){
            stringifier.end();
          }
          resolve(output)
        }
      );



    });

  });
  inStream.pipe(parser);
  return one;

};





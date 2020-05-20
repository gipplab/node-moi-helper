import parse = require('csv-parse');
import path = require( 'path');

// tslint:disable-next-line:no-var-requires
const mathml: any = require('mathml');
import fs = require('fs');
import xmlDom = require('xmldom');
import xpath = require('xpath');
import { ArqRecord } from './arqRecord';
import { promisify } from 'util';
import Promise = require('bluebird');

// let converted = 0;

const minimize = (mml: any) =>
  mathml(mml)
    .toMinimalPmml('all').toString();


// backwards compat to Node 8
function writeFile(outPath: string, data: string) {
  return new Promise((resolve, reject) => {
    fs.writeFile(outPath, data, { encoding: 'utf8', flag: 'a' }, err => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export function extract(mml: string, url: string, postId: number) {
  const parser = new xmlDom.DOMParser();
  const parsed = parser.parseFromString(mml);
  const select = xpath.useNamespaces({ 'm': 'http://www.w3.org/1998/Math/MathML' });
  const nodes = select('//m:math', parsed);
  let output = '';
  if (nodes.length) {
    nodes.forEach(n => output += `<mws:expr url="${url}" data-post-id="${postId}">\n${minimize(n)}\n</mws:expr>`);
  }
  return output;
}

const processFile = (inFile: string, outFile: string) => {
  const inStream = fs.createReadStream(inFile);
  const parser = parse({ columns: true, cast: true, delimiter: '\t' });
  const dataset: Map<number, ArqRecord> = new Map();
  const collection = path.basename(outFile);
  // let recordSize = 0;
  parser.on('readable', () => {
    let record;
    // tslint:disable-next-line:no-conditional-assignment
    while (record = parser.read()) {
      dataset.set(record.id, record);
      // console.log('Read records ' + ++recordSize);
    }

  });
  const one = new Promise<Map<number, ArqRecord>>((resolve, reject) => {
    parser.on('end', () => {
      resolve(dataset);
    });

  });
  inStream.pipe(parser);
  let output = '';
  one.then((ds: Map<number, ArqRecord>) => {
    for (const entry of ds.values()) {
      output += extract(entry.formula, String(entry.id), entry.post_id);
    }
    return writeFile(outFile, output);
  });

  return one;

};

export const Arq2Hrvst = (inFile: string, outFile: string) => {
  const afs = Promise.promisifyAll(fs);
  const consolidatedOut = path.join(outFile, 'out.xml');
  const header = writeFile(consolidatedOut, '<mws:harvest xmlns:mws="http://search.mathweb.org/ns" data-set="mse" data-doc-id="consolidated" data-collection="00}">\n');
  let count = 0;
  // @ts-ignore
  return header.then(() => afs.readdirAsync(inFile))
    .map(file => {
      count++;
      return processFile(path.join(inFile, file as string), consolidatedOut);
    })
    .then(() => (writeFile(consolidatedOut, '</mws:harvest>\n')))
    .then(() => count);
};
import parse = require('csv-parse');
import path = require( 'path');

// tslint:disable-next-line:no-var-requires
const mathml: any = require('mathml');
import fs = require('fs');
import xmlDom = require('xmldom');
import xpath = require('xpath');
import { ArqRecord } from './arqRecord';
import { promisify } from 'util';

// let converted = 0;

const minimize = (mml: any) =>
  mathml(mml)
    .toMinimalPmml('all').toString();


// backwards compat to Node 8
function writeFile(outPath: string, data: string) {
  return new Promise((resolve, reject) => {
    fs.writeFile(outPath, data, 'utf8', err => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export function extract(mml: string, url: string) {
  const parser = new xmlDom.DOMParser();
  const parsed = parser.parseFromString(mml);
  const select = xpath.useNamespaces({ 'm': 'http://www.w3.org/1998/Math/MathML' });
  const nodes = select('//m:math', parsed);
  let output = '';
  if (nodes.length) {
    nodes.forEach(n => output += `<mws:expr url="${url}">\n${minimize(n)}\n</mws:expr>`);
  }
  return output;
}

const processFile = (inFile: string, outFile: string) => {
  const inStream = fs.createReadStream(inFile);
  const parser = parse({ columns: true, cast: true, delimiter: '\t' });
  const dataset: Map<number, ArqRecord> = new Map();
  const collection = path.basename(outFile);
  let output = `<mws:harvest xmlns:mws="http://search.mathweb.org/ns" data-set="mse" data-doc-id="${collection}" data-collection="${collection}">`;

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
  one.then((ds: Map<number, ArqRecord>) => {
    for (const entry of ds.values()) {
      output += extract(entry.formula, String(entry.id));
    }
    output += '</mws:harvest>';
    return writeFile(outFile, output);
  });

  return one;

};

export const Arq2Hrvst = (inFile: string, outFile: string) => {
  const readdir = promisify(fs.readdir);
  return readdir(inFile)
    .then(files => {
      const pq: any[] = [];
      files.forEach(file => {
        pq.push(processFile(path.join(inFile, file), path.join(outFile, file + '.xml')));
      });
      return pq;
    })
    .then(pq => Promise.all(pq).then(() => (pq.length)));
};
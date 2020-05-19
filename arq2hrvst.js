#!/usr/bin/env node

const program = require('commander');
const version = require('./package.json').version;
const converter = require('./lib/arq2hrvst');

program
  .version(version)
  .requiredOption('-d, --in <folder>', 'input folder')
  .requiredOption('-o, --out <folder>', 'output folder')
  .parse(process.argv);

const inFile = program.in;
const outFile = program.out;

converter.Arq2Hrvst( inFile, outFile).then((n) => console.log(`Processed ${n} files`));


#!/usr/bin/env node

const program = require('commander');
const version = require('./package.json').version;
const converter = require('./lib/convert');

program
  .version(version)
  .option('-d', 'data file')
  .option('-o', 'output file')
  .parse(process.argv);

const inFile = program.d || __dirname + '/data/filtered.csv';
const outFile = program.o || __dirname + '/data/mathml.csv';

converter.Convert( inFile, outFile).then((filtered) => console.log('Processed ' + filtered.length));


#!/usr/bin/env node

const program = require('commander');
const version = require('./package.json').version;
const filter = require('./lib/filter');

program
  .version(version)
  .option('-f', 'filter list')
  .option('-d', 'data file')
  .option('-o', 'output file')
  .parse(process.argv);

const inFile = program.d || __dirname + '/data/data.csv';
const list = program.f || __dirname + '/data/filter.yml';
const outFile = program.o || __dirname + '/data/filtered.csv';

filter.Filter(list, inFile, outFile).then((filtered) => console.log('Processed ' + filtered.length));


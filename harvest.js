#!/usr/bin/env node

const program = require('commander');
const version = require('./package.json').version;
const converter = require('./lib/harvest');

program
  .version(version)
  .option('-d', 'data file')
  .option('-o', 'output file')
  .parse(process.argv);

const inFile = program.d || __dirname + '/data/mathml.csv';
const list = program.f || __dirname + '/data/filter.yml';
const outFile = program.o || __dirname + '/data/harvest/';

converter.Harvest( list, inFile, outFile).then((filtered) => console.log('Processed ' + filtered.length));


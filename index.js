#! /usr/bin/env node
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const imageSize = require('image-size');
const exec = require('child_process').exec;
const Spinner = require('cli-spinner').Spinner;
const spinner = new Spinner('processing.. %s');
spinner.setSpinnerString('|/-\\');

const supported = ['.jpg', '.jpeg', '.tiff', '.tif', '.png', '.gif', '.giff'];

const argv = require('yargs')
  .help('h')
  .alias('h', 'help')
  .usage('Usage: $0 <path> [options]')
  .option({
    x: {
      alias : 'width',
      describe: 'Picture output width',
      type: 'number',
      nargs: 1,
      default: 2150,
    },
    y: {
      alias : 'height',
      describe: 'Picture output height',
      type: 'number',
      nargs: 1,
      default: 2150,
    },
    s: {
      alias : 'size',
      describe: 'Picture frame size on the large edge',
      type: 'number',
      nargs: 1,
      default: 200,
    },
    c: {
      alias : 'color',
      describe: 'Picture frame color',
      type: 'string',
      nargs: 1,
      default: '#ffffff',
    },
    t: {
      alias : 'target',
      describe: 'Directory target name',
      type: 'string',
      nargs: 1,
      default: '__framed',
    },
  })
  .example("$0 .", 'Frame all image in the current directory')
  .example("$0 ./subdirectory/ -w 2000 -h 2000 -c '#ff0'", 'Frame your images in a 2000X2000 yellow square')
  .argv;

const executioner = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error);
      resolve(stderr || stdout);
    });
  });
};

const framr = async () => {
  spinner.start();

  const dir = argv._[0] ? path.resolve(argv._[0]) : path.resolve('.');
  const pictures = await fs.readdirSync(dir);

  // Create output directory
  await fs.ensureDirSync(path.join(dir, argv.target));

  // Iterate over each images
  let i = 0;
  pictures.forEach(async (item) => {
    const picture = path.join(dir, item);
    const isSupported = supported.includes(path.extname(picture).toLocaleLowerCase());

    if (isSupported) {
      const size = await imageSize(picture);
      const isLandscape = size.width > size.height;

      const smallEdgeLandscape = ((argv.width - argv.size) * size.height) / size.width;
      const smallEdgePortrait = ((argv.height - argv.size) * size.width) / size.height;
      const smallEdge = isLandscape ? smallEdgeLandscape : smallEdgePortrait;

      const frameLandscape = `${argv.size / 2}x${(argv.height - smallEdge) / 2}`;
      const framePortrait = `${(argv.width - smallEdge) / 2}x${argv.size / 2}`;
      const frame = isLandscape ? frameLandscape : framePortrait;

      await executioner(`magick ${picture} -resize ${argv.width - argv.size}x${argv.height - argv.size} -mattecolor "${argv.color}" -frame ${frame} ${path.join(dir, argv.target, item)}`);
    }

    i += 1;
    if (i === pictures.length) {
      spinner.stop(true);
      console.log('🏞  All pictures successfully framed !');
      console.log(`Check ${path.join(dir, argv.target)} to see the result.`);
    }
  });
};

framr();
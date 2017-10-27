# 🏞 Framr

Allow you to resize and frame your images

![framr](./assets/framr.jpg)

## Install

First you need to have [Imagemagick](http://www.imagemagick.org/) installed :
```bash
$ brew install imagemagick
```

Then simply :
```bash
$ npm install -g framr
or
$ yarn global add framr
```

#### [🎁 Install also the Alfred workflow !](./assets/framr.alfredworkflow)
*\* cmd+option+ctrl+f on a folder*

## Usage

```bash
$ framr -h
Usage: framr <path> [options]

Options:
  --version     Show version number                                    [boolean]
  -h, --help    Show help                                              [boolean]
  -x, --width   Picture output width                    [number] [default: 2150]
  -y, --height  Picture output height                   [number] [default: 2150]
  -s, --size    Picture frame size on the large edge     [number] [default: 200]
  -c, --color   Picture frame color                [string] [default: "#ffffff"]
  -t, --target  Directory target name             [string] [default: "__framed"]

Examples:
  framr .                                   Frame all image in the current
                                            directory
  framr ./subdirectory/ -w 2000 -h 2000 -c  Frame your images in a 2000X2000
  '#ff0'                                    yellow square
```
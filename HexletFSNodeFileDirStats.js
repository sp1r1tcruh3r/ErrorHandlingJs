/*


Задача состоит в том, чтобы реализовать тип Stats и его формирование посредством динамической диспетчеризации благодаря подтипам Node.
Stats.js

Реализуйте тип Stats со следующим интерфейсом:

    constructor
    isFile()
    isDirectory()

Node.js

Реализуйте надтип Node, интерфейсом которого являются функции:

    getStats()
    getName()

Dir.js, File.js

Реализуйте подтипы Dir и File (надтип Node). Варианты использования этих типов можно увидеть в файле HexletFs.js.
*/

//stats.js

export default class Stats{
  constructor (isfile, isdir){
    this.isfile = isfile;
    this.isdir = isdir;
  }
  isFile() {
    return this.isfile;
  }
  isDirectory() {
    return this.isdir
  }
};

//node.js

import Stats from './Stats';

export default class Node {
  constructor(name, isfile, isdir) {
    this.name = name;
    this.stats = new Stats(isfile, isdir);
  }

  getStats() {
    return this.stats;
  }

  getName() {
    return this.name;
  }
}

//file.js

import Node from './Node';
export default class File extends Node {
  constructor(name, body) {
    super(name);
    this.body = body;
  }

  getBody() {
    return this.body;
  }

  isDirectory() {
    return false;
  }

  isFile() {
    return true;
  }
}

//dir.js

import Node from './Node';
export default class Dir extends Node {
  isDirectory() {
    return true;
  }

  isFile() {
    return false;
  }
}

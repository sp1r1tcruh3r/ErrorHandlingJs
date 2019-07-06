/*


Ошибок, связанных с файловой системой, очень много, и для их ручной генерации существуют удобные библиотеки. Например, errno. Пример использования:

import errors from 'errno';

errors.code.ENOTEMPTY;
// → {
//     "errno": 53,
//     "code": "ENOTEMPTY",
//     "description": "directory not empty"
//   }

Список ошибок можно подсмотреть тут: https://github.com/rvagg/node-errno/blob/master/errno.js
HexletFs.js

Реализуйте следующие возможности файловой системы HexletFs:
unlinkSync(path)

Удаляет файл (в реальной фс все чуть сложнее, см. hard link).

Возможные ошибки:

    ENOENT - файл не найден
    EPERM - операция не разрешена. Такая ошибка возникает в случае, если path это директория

writeFileSync(path, content)

Записывает content в файл по пути path.

Возможные ошибки:

    ENOENT - родительская директория, в которой нужно создать файл, не существует
    EISDIR - path является директорией
    ENOTDIR - родительский элемент не является директорией

readFileSync(path)

Читает содержимое файла по пути path.

    ENOENT - файл не найден
    EISDIR - path является директорией

Подсказки

    Тип File содержит метод getBody, который возвращает содержимое файла.

*/

import path from 'path';
import errors from 'errno';
import Tree from '@hexlet/trees';
import { Dir, File } from '@hexlet/fs';

const getPathParts = filepath => filepath.split(path.sep).filter(part => part !== '');

export default class {
  constructor() {
    this.tree = new Tree('/', new Dir('/'));
  }

  statSync(filepath) {
    const current = this.findNode(filepath);
    if (!current) {
      return [null, errors.code.ENOENT];
    }
    return [current.getMeta().getStats(), null];
  }

  // BEGIN
  unlinkSync(filepath) {
    const current = this.findNode(filepath);
    if (!current) {
      return [null, errors.code.ENOENT];
    }
    if (current.getMeta().isDirectory()) {
      return [null, errors.code.EPERM];
    }
    return [current.getParent().removeChild(current.getKey()), null];
  }

  writeFileSync(filepath, body) {
    const { base, dir } = path.parse(filepath);
    const parent = this.findNode(dir);
    if (!parent) {
      return [null, errors.code.ENOENT];
    }
    if (parent.getMeta().isFile()) {
      return [null, errors.code.ENOTDIR];
    }
    const current = parent.getChild(base);
    if (current && current.getMeta().isDirectory()) {
      return [null, errors.code.EISDIR];
    }
    return [parent.addChild(base, new File(base, body)), null];
  }

  readFileSync(filepath) {
    const current = this.findNode(filepath);
    if (!current) {
      return [null, errors.code.ENOENT];
    }
    if (current.getMeta().isDirectory()) {
      return [null, errors.code.EISDIR];
    }
    return [current.getMeta().getBody(), null];
  }
  // END

  mkdirpSync(filepath) {
    const result = getPathParts(filepath).reduce((subtree, part) => {
      if (!subtree) {
        return false;
      }
      const current = subtree.getChild(part);
      if (!current) {
        return subtree.addChild(part, new Dir(part));
      }
      if (current.getMeta().isFile()) {
        return false;
      }

      return current;
    }, this.tree);

    return !!result;
  }

  touchSync(filepath) {
    const { base, dir } = path.parse(filepath);
    const parent = this.findNode(dir);
    if (!parent) {
      return [null, errors.code.ENOENT];
    }
    if (parent.getMeta().isFile()) {
      return [null, errors.code.ENOTDIR];
    }
    return [parent.addChild(base, new File(base, '')), null];
  }

  readdirSync(filepath) {
    const dir = this.findNode(filepath);
    if (!dir) {
      return [null, errors.code.ENOENT];
    }
    if (dir.getMeta().isFile()) {
      return [null, errors.code.ENOTDIR];
    }
    return [dir.getChildren().map(child => child.getKey()), null];
  }

  findNode(filepath) {
    const parts = getPathParts(filepath);
    return parts.length === 0 ? this.tree : this.tree.getDeepChild(parts);
  }
}

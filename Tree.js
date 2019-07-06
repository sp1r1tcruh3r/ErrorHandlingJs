/*
Tree.js

Реализуйте недостающие части интерфейса типа Tree.

    hasChildren()
    hasChild(key)
    getParent()
    removeChild(key)
    getDeepChild(keys). Функция возвращает undefined если узел не найден или был передан пустой массив.
    getChildren()

tree = new Tree('/');
tree.addChild('var')
  .addChild('lib')
  .addChild('run');
tree.addChild('etc');
tree.addChild('home');

// example: getDeepChild
const subtree = tree.getDeepChild(['var', 'lib']);
subtree.getKey(); // lib

tree.getDeepChild(['var', 'nobody']); // undefined

const parent = subtree.getParent();
parent.getKey(); // var

tree.removeChild('home'); // true
tree.removeChild('nonexistentNode'); // false

Подсказки

    метод getChildren возвращает массив нод
*/


class Tree {
  constructor(key, meta, parent) {
    this.parent = parent;
    this.key = key;
    this.meta = meta;
    this.children = new Map();
  }

  getKey() {
    return this.key;
  }

  getMeta() {
    return this.meta;
  }

  addChild(key, meta) {
    const child = new Tree(key, meta, this);
    this.children.set(key, child);

    return child;
  }

  getChild(key) {
    return this.children.get(key);
  }

  // BEGIN (write your solution here)
  hasChildren() {
    return this.children.size > 0;
  }

  hasChild(key) {
    return this.children.has(key);
  }

  getParent() {
    return this.parent;
  }

  removeChild(key) {
    return this.children.delete(key);
  };

  getDeepChild(keys) {
    const [key, ...rest] = keys;
    const node = this.getChild(key);
    if (rest.length === 0 || node === undefined) {
      return node;
    }
    return node.getDeepChild(rest);
  }

  getChildren() {
    return [...this.children.values()];
  }


  // END
}

export default Tree;

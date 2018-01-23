import * as Promise from 'bluebird';

export default class IslandFinder {
  constructor(matrix, delay = 0) {
    this.matrix = matrix;
    this.islands = [];
    this.currentPosition = [];
    this.findingDelay = delay;
    this.stopped = false;
  }

  validateMap() {
    if (!(this.matrix && Array.isArray(this.matrix) && this.matrix.length > 0)) {
      throw new Error('Карта не задана');
    }

    if (!(this.matrix.every(row => Array.isArray(row)))) {
      throw new Error('Карта должна быть двумерным массивом');
    }

    this.matrix.some((row, index) => {
      if (row.length === 0) {
        throw new Error(`Строка ${index+1} карты должна содержать хотя бы один элемент`);
      }
    });

    if (!this.matrix.reduce((a, b) => (a.length === b.length) ? a : NaN )) {
      throw new Error('Все строки карты должны быть равной длины');
    }

    this.matrix.some((x, indexX) => {
      if (this.matrix[indexX].some((y, indexY) => {
          return !(this.matrix[indexX][indexY] === 0 || this.matrix[indexX][indexY] === 1);
        })) {
        throw new Error('Все элементы карты должны быть равны либо 0, либо 1');
      }
    });
  }

  // если уже есть хотя бы один найденный остров,
  // проверяем переданный элемент на наличие в островах.
  // Если элемент найден, пропускаем его проверку
  checkIfNodeIsInIsland(x, y) {
    const checkIslandElements = (islandIndex) => {
      return this.islands[islandIndex].some(el => el[0] === x && el[1] === y);
    };

    if (this.islands.length > 0) {
      return this.islands.some((island, index) => checkIslandElements(index));
    }
    return false;
  }

  // проверяем правый, нижний (если попали с найденного острова - то и левый) элемент
  checkNode(x, y, islandIndex) {
    // добавляем элемент чтобы следить за текущей позицией
    console.log(`текущая позиция: ${x} ${y}`);
    this.currentPosition = [x, y];

    let newIslandIndex = null;
    let index = null;

    return new Promise((resolve) => {
      if (this.checkIfNodeIsInIsland(x, y)) {
        // console.log(`Элемент уже находится в острове. пропускаем... [${x}][${y}]`);
        return resolve();
      }

      setTimeout(async () => {
        // проверяем сам элемент
        if (this.matrix[x][y] === 1) {
          // console.log(`Нашли часть острова или остров. Элемент [${x}][${y}]`);

          if (islandIndex !== undefined) {
            this.islands[islandIndex].push([x, y]);
          } else {
            this.islands.push([[x, y]]);
            newIslandIndex = this.islands.length - 1;

            // console.log('Новый остров создан. ', this.islands);
          }

          index = islandIndex === undefined ? newIslandIndex : islandIndex;

          // проверяем правый, если не уперлись в правый бок карты
          if (y < this.matrix[0].length - 1) {
            await this.checkNode(x, y+1, index)
          }

          // проверяем левый, если не уперлись в левый бок карты
          // и передан текущий остров
          if (islandIndex && y > 0) {
            await this.checkNode(x, y-1, index)
          }

          // проверяем нижний, если не уперлись в низ карты
          if (x < this.matrix.length - 1) {
            await this.checkNode(x+1, y, index)
          }
        }
        resolve()
      }, this.findingDelay);
    });
  }

  async find() {
    // проверка карты
    this.validateMap();

    await Promise.each(this.matrix, async (row, x) => {
      await Promise.each(this.matrix[x], async (element, y) => this.checkNode(x, y));
    });
  }
}

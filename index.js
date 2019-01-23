'use strict';

const FPS = 60;
const CELL_EMPTY = 0;
const CELL_ALIVE = 1;
const canvasNode = document.querySelector('#main-canvas');
canvasNode.width = window.innerWidth;
canvasNode.height = window.innerHeight;
const ctx = canvasNode.getContext('2d');
const cells_per_line = 256;
const cell_width = canvasNode.width / cells_per_line;
const cell_height = cell_width;
const w = canvasNode.width;
const h = canvasNode.height;

const state = {
  livings: [],
  livings_lifetimes: [],
};

const update = () => {
  const liv = state.livings;
  const last_x_idx = cells_per_line - 1;
  const last_y_idx = last_x_idx;
  const first_x_idx = 0;
  const first_y_idx = first_x_idx;
  for (let x = 0; x < liv.length; ++x) {
    for (let y = 0; y < liv[x].length; ++y) {
      let alive_neighbors = 0;
      for (
        let dx = Math.max(x - 1, first_x_idx);
        dx <= Math.min(x + 1, last_x_idx);
        ++dx
      ) {
        for (
          let dy = Math.max(y - 1, first_y_idx);
          dy <= Math.min(y + 1, last_y_idx);
          ++dy
        ) {
          if (dx == x && dy == y) continue;
          alive_neighbors += liv[dx][dy];
        }
      }
      const alive = liv[x][y] == CELL_ALIVE;
      if (alive) {
        if (alive_neighbors < 2) {
          liv[x][y] = CELL_EMPTY;
          state.livings_lifetimes[x][y] = 0;
        } else if (alive_neighbors > 3) {
          liv[x][y] = CELL_EMPTY;
          state.livings_lifetimes[x][y] = 0;
        } else {
          state.livings_lifetimes[x][y] += 1;
        }
      } else {
        if (alive_neighbors == 3) {
          liv[x][y] = CELL_ALIVE;
          state.livings_lifetimes[x][y] = 0;
        }
      }
    }
  }
};

const render = () => {
  ctx.clearRect(0, 0, w, h);
  ctx.beginPath();
  for (let x = 0; x < state.livings.length; ++x) {
    const real_x = x * cell_width;
    for (let y = 0; y < state.livings[x].length; ++y) {
      const real_y = y * cell_width;
      if (state.livings[x][y] === CELL_ALIVE) {
        ctx.fillStyle = '#E15436';
        if (state.livings_lifetimes[x][y] < 2) {
          ctx.fillStyle = '#36E13E';
        } else if (state.livings_lifetimes[x][y] < 4) {
          ctx.fillStyle = '#E1D736';
        } else {
          ctx.fillStyle = '#0000ff';
        }
      } else {
        ctx.fillStyle = '#000000';
      }
      ctx.fillRect(real_x, real_y, cell_width, cell_height);
    }
  }
  ctx.stroke();
};

const tick = () => {
  update();
  render();
};

const generate_block_at_random_pos = () => {
  const rx = Math.floor(Math.random() * (cells_per_line - 2)) + 1;
  const ry = Math.floor(Math.random() * (cells_per_line - 2)) + 1;
  state.livings[rx][ry] = CELL_ALIVE;
  state.livings[rx + 1][ry + 1] = CELL_ALIVE;
  state.livings[rx + 1][ry] = CELL_ALIVE;
  state.livings[rx][ry + 1] = CELL_ALIVE;
};

const generate_blinker_at_random_pos = () => {
  const rx = Math.floor(Math.random() * (cells_per_line - 2) + 1);
  const ry = Math.floor(Math.random() * (cells_per_line - 2) + 1);
  state.livings[rx + 1][ry] = CELL_ALIVE;
  state.livings[rx][ry] = CELL_ALIVE;
  state.livings[rx - 1][ry] = CELL_ALIVE;
};

const reset = () => {
  for (let x = 0; x < cells_per_line; ++x) {
    for (let y = 0; y < state.livings[x].length; ++y) {
      state.livings[x][y] = CELL_EMPTY;
      state.livings_lifetimes[x][y] = 0;
    }
  }
};

const gen_random = () => {
  for (let i = 0; i < 64; ++i) {
    generate_block_at_random_pos();
    generate_blinker_at_random_pos();
  }
};

const init = () => {
  state.livings = new Array(cells_per_line);
  state.livings_lifetimes = new Array(cells_per_line);
  for (let x = 0; x < cells_per_line; ++x) {
    state.livings[x] = new Array(cells_per_line);
    state.livings_lifetimes[x] = new Array(cells_per_line);
    for (let y = 0; y < state.livings[x].length; ++y) {
      state.livings[x][y] = CELL_EMPTY;
      state.livings_lifetimes[x][y] = 0;
    }
  }
  reset();
  gen_random();
  window.onkeypress = (ev) => {
    const key = ev.key;
    const keycode = ev.keyCode;
    if (key == 'r') {
      reset();
      gen_random();
    }
  };
};

init();
window.setInterval(tick, 1000 / FPS);

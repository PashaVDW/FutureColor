import { pots } from './potsPanel.js';
import { renderApp } from './appRenderer.js';

export function renderTestModeButton() {
  const testBtn = document.createElement('button');
  testBtn.textContent = 'Test kleur';
  testBtn.className = 'mt-6 ml-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition';

  testBtn.addEventListener('click', () => {
    renderColorTestMode();
  });

  document.getElementById('app').appendChild(testBtn);
}

function renderColorTestMode() {
  const app = document.getElementById('app');
  app.innerHTML = ''; 

  const section = document.createElement('section');
  section.className = 'p-6 max-w-5xl mx-auto';

  section.innerHTML = `
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Kleurentestmodus</h2>
    <form id="test-grid-form" class="flex gap-4 mb-4">
      <input type="number" id="rows" min="1" max="20" placeholder="Rijen" class="border p-2 rounded-lg w-32" required />
      <input type="number" id="cols" min="1" max="20" placeholder="Kolommen" class="border p-2 rounded-lg w-32" required />
      <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
        Maak grid
      </button>
      <button id="exit-test" type="button" class="ml-auto bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition">
        Terug
      </button>
    </form>
    <div id="test-pots" class="flex flex-wrap gap-3 mb-6"></div>
    <div id="test-grid" class="grid gap-1"></div>
  `;

  app.appendChild(section);

  section.querySelector('#exit-test').addEventListener('click', () => {
    document.getElementById('app').innerHTML = '';
    renderApp();
  });

  const form = section.querySelector('#test-grid-form');
  const grid = section.querySelector('#test-grid');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);
    if (!rows || !cols) return;

    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${cols}, minmax(20px, 1fr))`;

    for (let i = 0; i < rows * cols; i++) {
      const cell = document.createElement('div');
      cell.className = 'bg-gray-100 w-full aspect-square border border-gray-300';
      cell.dataset.index = i;

      cell.addEventListener('dragover', (e) => {
        e.preventDefault();
        cell.classList.add('ring-2', 'ring-blue-400');
      });

      cell.addEventListener('dragleave', () => {
        cell.classList.remove('ring-2', 'ring-blue-400');
      });

      cell.addEventListener('drop', (e) => {
        e.preventDefault();
        cell.classList.remove('ring-2', 'ring-blue-400');
        const potData = JSON.parse(e.dataTransfer.getData('application/json'));
        if (potData.mixedColor) {
          cell.style.backgroundColor = potData.mixedColor;
        }
      });


      grid.appendChild(cell);
    }
  });

  const potZone = section.querySelector('#test-pots');
  potZone.innerHTML = '';
  pots
    .filter(p => p.status === 'klaar' && p.mixedColor)
    .forEach((pot) => {
      const div = document.createElement('div');
      div.className = 'text-white text-sm px-3 py-2 rounded-lg shadow cursor-move';
      div.style.backgroundColor = pot.mixedColor;
      div.textContent = pot.name;
      div.setAttribute('draggable', 'true');

      div.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('application/json', JSON.stringify(pot));
        e.dataTransfer.effectAllowed = 'copy';
      });

      potZone.appendChild(div);
    });
}

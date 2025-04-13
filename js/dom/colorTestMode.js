import { pots } from './potsPanel.js';
import { renderApp } from './appRenderer.js';
import { getTriadicColors, rgbToHex, hexToHsl } from '../utils/colorUtils.js';

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

      cell.addEventListener('click', () => {
        const bg = cell.style.backgroundColor;
        if (!bg || bg === 'rgb(243, 244, 246)') return;

        const hex = rgbToHex(bg);
        const triadic = getTriadicColors(hex);

        showTriadicPopup(hex, triadic);
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

function showTriadicPopup(originalHex, triadicColors) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

  modal.innerHTML = `
    <div class="bg-white p-6 rounded-xl shadow max-w-md w-full space-y-4 text-center">
      <h3 class="text-lg font-bold text-gray-800">Triadic Kleuren</h3>
      <div class="flex justify-center gap-4">
        <div>
          <div class="w-12 h-12 rounded-full mx-auto mb-1" style="background:${originalHex}"></div>
          <div class="text-xs text-gray-600">Origineel: ${originalHex.toUpperCase()}</div>
          <div class="text-xs text-gray-600"> HSL(${hexToHsl(originalHex).h}, ${hexToHsl(originalHex).s}%, ${hexToHsl(originalHex).l}%)</div>
        </div>
        ${triadicColors.map(c => `
          <div>
            <div class="w-12 h-12 rounded-full mx-auto mb-1" style="background:${c.hex}"></div>
            <div class="text-xs text-gray-600">${c.hex.toUpperCase()}<br>HSL(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%)</div>
          </div>
        `).join('')}
      </div>
      <button class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onclick="this.closest('.fixed').remove()">Sluit</button>
    </div>
  `;
  document.body.appendChild(modal);
}
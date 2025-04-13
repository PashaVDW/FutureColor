import { Pot } from '../models/Pot.js';
import { averageColor } from '../utils/colorUtils.js';

let potIdCounter = 1;
export let pots = [];

export function renderPotsPanel() {
pots = [];
  const panel = document.getElementById('pots-panel');

  const addButton = document.createElement('button');
  addButton.textContent = 'Nieuwe pot';
  addButton.className = 'mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition';

  addButton.addEventListener('click', () => {
    const newPot = new Pot(`pot-${potIdCounter++}`, `Pot ${potIdCounter - 1}`);
    pots.push(newPot);
    savePots();
    renderPotVisual(newPot);
  });

  panel.prepend(addButton);
  loadPots();
}

export function renderPotVisual(pot) {
  const container = document.getElementById('pots-container');
  const existing = document.querySelector(`[data-pot-id="${pot.id}"]`);
  if (existing) {
    existing.remove();
  }

  const borderColor = pot.status === 'klaar' && pot.mixedColor ? pot.mixedColor : '#bfdbfe';

  const div = document.createElement('div');
  div.className = 'pot-item relative bg-white border-2 rounded-xl shadow p-4 w-full max-w-xs flex flex-col items-center justify-center text-center transition hover:scale-105 hover:shadow-lg';
  div.style.borderColor = borderColor;
  div.setAttribute('data-pot-id', pot.id);
  div.setAttribute('draggable', 'true');

  div.addEventListener('dragstart', (e) => {
    const pot = pots.find(p => p.id === div.dataset.potId);
    e.dataTransfer.setData('application/json', JSON.stringify(pot));
    e.dataTransfer.effectAllowed = 'move';
  });

  div.innerHTML = `
    <div class="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-bold text-lg shadow-inner mb-2">
      ${pot.id.split('-')[1]}
    </div>
    <span class="text-sm font-medium text-gray-700">${pot.name}</span>
    <div class="ingredient-dropzone mt-2 flex flex-wrap gap-1 justify-center"></div>
  `;

  div.addEventListener('dragover', (e) => {
    e.preventDefault();
    div.classList.add('ring-2', 'ring-blue-400');
  });

  div.addEventListener('dragleave', () => {
    div.classList.remove('ring-2', 'ring-blue-400');
  });

  div.addEventListener('drop', (e) => {
    e.preventDefault();
    div.classList.remove('ring-2', 'ring-blue-400');

    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    const dropzone = div.querySelector('.ingredient-dropzone');
    const currentPot = pots.find(p => p.id === pot.id);

    if (!currentPot.addIngredient(data)) {
      alert('Alle ingrediënten in deze pot moeten dezelfde snelheid hebben!');
      return;
    }

    savePots();

    const badge = document.createElement('div');
    badge.className = 'text-white text-xs px-2 py-1 rounded-full';
    badge.style.backgroundColor = data.color;
    badge.textContent = data.name;
    dropzone.appendChild(badge);
  });

  if (pot.contents && Array.isArray(pot.contents)) {
    const dropzone = div.querySelector('.ingredient-dropzone');
    pot.contents.forEach((ingredient) => {
      const badge = document.createElement('div');
      badge.className = 'text-white text-xs px-2 py-1 rounded-full';
      badge.style.backgroundColor = ingredient.color;
      badge.textContent = ingredient.name;
      dropzone.appendChild(badge);
    });
  }
  
  container.appendChild(div);
}

export function savePots() {
  localStorage.setItem('futureColor.pots', JSON.stringify(pots));
}

function loadPots() {
  const saved = localStorage.getItem('futureColor.pots');
  if (!saved) return;

  const parsed = JSON.parse(saved);
  if (!Array.isArray(parsed)) return;
    
  parsed.forEach((rawPot) => {
    const loadedPot = new Pot(rawPot.id, rawPot.name);
    (rawPot.contents || []).forEach((ingredient) => {
      loadedPot.addIngredient(ingredient);
    });

    loadedPot.mixedColor = rawPot.mixedColor || null;
    loadedPot.status = rawPot.status || null;

    pots.push(loadedPot);
    renderPotVisual(loadedPot);
  });

  potIdCounter = parsed.length + 1;
}

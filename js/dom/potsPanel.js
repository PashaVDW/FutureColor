import { Pot } from '../models/Pot.js';

let potIdCounter = 1;
let pots = [];

export function renderPotsPanel() {
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

function renderPotVisual(pot) {
    function averageColor(ingredients) {
        if (!ingredients.length) return '#e5e7eb'; 
        let r = 0, g = 0, b = 0;
        ingredients.forEach(({ color }) => {
          const [cr, cg, cb] = hexToRgb(color);
          r += cr;
          g += cg;
          b += cb;
        });
        r = Math.round(r / ingredients.length);
        g = Math.round(g / ingredients.length);
        b = Math.round(b / ingredients.length);
        return `rgb(${r}, ${g}, ${b})`;
      }
      
      function hexToRgb(hex) {
        hex = hex.replace('#', '');
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
        const bigint = parseInt(hex, 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
      }
    const container = document.getElementById('pots-container');

    const div = document.createElement('div');
    const mixedColor = averageColor(pot.contents || []);
    div.className = 'pot-item relative bg-white border-2 border-blue-200 rounded-xl shadow p-4 w-full max-w-xs flex flex-col items-center justify-center text-center transition hover:scale-105 hover:shadow-lg';
    div.style.borderColor = mixedColor;
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

function savePots() {
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
        pots.push(loadedPot);
        renderPotVisual(loadedPot);
    });

    potIdCounter = parsed.length + 1;
}

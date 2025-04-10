import { Ingredient } from '../models/ingredient.js';

let ingredients = [];

export function renderIngredientForm(containerId = 'ingredient-panel') {
  const panel = document.getElementById(containerId);

  const form = document.createElement('form');
  form.id = 'ingredient-form';
  form.innerHTML = `
    <div class="grid gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Naam</label>
        <input type="text" name="name" required class="w-full border border-gray-300 rounded-lg p-2" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Mengtijd (ms)</label>
        <input type="number" name="mixTime" required class="w-full border border-gray-300 rounded-lg p-2" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Snelheid</label>
        <input type="number" name="speed" required class="w-full border border-gray-300 rounded-lg p-2" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Kleur</label>
        <input type="color" name="color" value="#ff0000" required class="w-12 h-12 p-0 border border-gray-300 rounded-full" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Structuur</label>
        <select name="structure" class="w-full border border-gray-300 rounded-lg p-2">
          <option>Korrel</option>
          <option>Grove korrel</option>
          <option>Glad</option>
          <option>Slijmerig</option>
        </select>
      </div>

      <div>
        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
          Voeg ingrediënt toe
        </button>
      </div>
    </div>
  `;

  panel.prepend(form);

  loadIngredients();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const ingredient = new Ingredient(
      data.get('name'),
      data.get('mixTime'),
      data.get('speed'),
      data.get('color'),
      data.get('structure')
    );
    ingredients.push(ingredient);
    saveIngredients();
    renderIngredientVisual(ingredient);
    form.reset();
  });
}

function renderIngredientVisual(ingredient) {
  const container = document.getElementById('ingredients-container');
  const div = document.createElement('div');
  div.className = `ingredient-item ${structureClass(ingredient.structure)}`;
  div.style.backgroundColor = ingredient.color;
  div.textContent = ingredient.name;
  div.setAttribute('data-speed', ingredient.speed);
  div.setAttribute('data-name', ingredient.name);
  div.setAttribute('data-color', ingredient.color);
  div.setAttribute('data-mixTime', ingredient.mixTime);
  div.setAttribute('draggable', true);
  div.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('application/json', JSON.stringify(ingredient));
    e.dataTransfer.effectAllowed = 'move';
  });

  container.appendChild(div);
}

function structureClass(structure) {
  switch (structure.toLowerCase()) {
    case 'korrel': return 'structure-korrel';
    case 'grove korrel': return 'structure-grove';
    case 'glad': return 'structure-glad';
    case 'slijmerig': return 'structure-slijm';
    default: return '';
  }
}

function saveIngredients() {
  localStorage.setItem('futureColor.ingredients', JSON.stringify(ingredients));
}
function loadIngredients() {
  const saved = localStorage.getItem('futureColor.ingredients');
  if (!saved) return;

  const parsed = JSON.parse(saved);
  if (!Array.isArray(parsed)) return;

  parsed.forEach((item) => {
    const ingredient = new Ingredient(item.name, item.mixTime, item.speed,item.color,item.structure);
    ingredients.push(ingredient);
    renderIngredientVisual(ingredient);
  });
}


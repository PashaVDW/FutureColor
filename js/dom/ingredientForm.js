import { Ingredient } from '../components/Ingredient.js';

const ingrediënten = [];

export function renderIngredientForm(containerId = 'ingredient-panel') {
  const panel = document.getElementById(containerId);

  const form = document.createElement('form');
  form.id = 'ingredient-form';
  form.innerHTML = `
  <div class="grid gap-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Naam</label>
      <input type="text" name="naam" required class="w-full border border-gray-300 rounded-lg p-2" />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Mengtijd (ms)</label>
      <input type="number" name="mengtijd" required class="w-full border border-gray-300 rounded-lg p-2" />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Snelheid</label>
      <input type="number" name="snelheid" required class="w-full border border-gray-300 rounded-lg p-2" />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Kleur</label>
      <input type="color" name="kleur" value="#ff0000" required class="w-12 h-12 p-0 border border-gray-300 rounded-full" />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Structuur</label>
      <select name="structuur" class="w-full border border-gray-300 rounded-lg p-2">
        <option>Korrel</option>
        <option>Grove korrel</option>
        <option>Glad</option>
        <option>Slijmerig</option>
      </select>
    </div>

    <div>
      <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition">
        Voeg ingrediënt toe
      </button>
    </div>
  </div>
`;


  panel.prepend(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const ingredient = new Ingredient(
      data.get('naam'),
      data.get('mengtijd'),
      data.get('snelheid'),
      data.get('kleur'),
      data.get('structuur')
    );
    ingrediënten.push(ingredient);
    renderIngredientVisual(ingredient);
    form.reset();
  });
}

function renderIngredientVisual(ingredient) {
  const container = document.getElementById('ingredients-container');

  const div = document.createElement('div');
  div.className = `ingredient-item ${structureClass(ingredient.structuur)}`;
  div.style.backgroundColor = ingredient.kleur;
  div.textContent = `${ingredient.naam}`;

  container.appendChild(div);
}

function structureClass(structuur) {
  switch (structuur.toLowerCase()) {
    case 'korrel':
      return 'structure-korrel';
    case 'grove korrel':
      return 'structure-grove';
    case 'glad':
      return 'structure-glad';
    case 'slijmerig':
      return 'structure-slijm';
    default:
      return '';
  }
}

import { Ingredient } from '../models/ingredient.js';
import { Pot } from '../models/Pot.js';
import { Machine } from '../models/Machine.js';
import { renderApp } from './appRenderer.js';

export function renderExampleDataButton() {
    const btn = document.createElement('button');
    btn.textContent = 'Laad voorbeelddata';
    btn.className = 'mt-4 ml-6 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition';

    btn.addEventListener('click', () => {
        const ing1 = new Ingredient('Rood', 1000, 2, '#ff0000', 'Korrel');
        const ing2 = new Ingredient('Blauw', 1000, 2, '#0000ff', 'Glad');
        const currentIngredients = JSON.parse(localStorage.getItem('futureColor.ingredients')) || [];
        currentIngredients.push(ing1, ing2);
        localStorage.setItem('futureColor.ingredients', JSON.stringify(currentIngredients));

        const pot = new Pot('pot-999', 'Voorbeeldpot');
        pot.addIngredient(ing1);
        pot.addIngredient(ing2);
        const currentPots = JSON.parse(localStorage.getItem('futureColor.pots')) || [];
        currentPots.push(pot);
        localStorage.setItem('futureColor.pots', JSON.stringify(currentPots));

        const machine = new Machine('machine-999', 2, 1500, 1);
        const currentMachines = JSON.parse(localStorage.getItem('futureColor.machines')) || [];
        currentMachines.push(machine);
        localStorage.setItem('futureColor.machines', JSON.stringify(currentMachines));

        alert('Voorbeelddata geladen!');
        renderApp();
    });

    document.getElementById('app').appendChild(btn);
}

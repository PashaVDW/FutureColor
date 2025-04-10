import { initApp } from './dom/init.js';
import { renderIngredientForm } from './dom/ingredientForm.js';
import { renderPotsPanel } from './dom/potsPanel.js';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  renderIngredientForm();
  renderPotsPanel();
});

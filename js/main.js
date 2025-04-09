import { initApp } from './dom/init.js';
import { renderIngredientForm } from './dom/ingredientForm.js';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  renderIngredientForm();
});

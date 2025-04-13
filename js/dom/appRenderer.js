import { initApp } from './init.js';
import { renderIngredientForm } from './ingredientForm.js';
import { renderPotsPanel } from './potsPanel.js';
import { renderMachinesPanel } from './machinePanel.js';
import { renderWeatherPanel } from './weatherPanel.js';
import { renderTestModeButton } from './colorTestMode.js';

export function renderApp() {
    initApp();
    renderIngredientForm();
    renderPotsPanel();
    renderMachinesPanel();
    renderWeatherPanel();
    renderTestModeButton();
}

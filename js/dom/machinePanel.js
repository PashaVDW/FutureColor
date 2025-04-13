import { Machine } from '../models/Machine.js';
import { Pot } from '../models/Pot.js';
import { averageColor } from '../utils/colorUtils.js';
import { renderPotVisual, pots, savePots } from './potsPanel.js';
import { getCurrentWeather } from './weatherPanel.js';

const activeMixingMachines = new Set();
let machineIdCounter = 1;
let machines = [];
let activeHallId = 1;

export function renderMachinesPanel() {
    machines = [];
    const hall1Btn = document.getElementById('hall-1');
    const hall2Btn = document.getElementById('hall-2');

    hall1Btn.addEventListener('click', () => {
        activeHallId = 1;
        renderMachinesForHall();
    });

    hall2Btn.addEventListener('click', () => {
        activeHallId = 2;
        renderMachinesForHall();
    });

    const panel = document.getElementById('machines-panel');

    const form = document.createElement('form');
    form.className = 'gap-4 justify-items-center items-end flex mb-6';
    form.innerHTML = `
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Mengsnelheid</label>
      <input type="number" name="speed" required class="w-full border border-gray-300 rounded-lg p-2" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Mengtijd (ms)</label>
      <input type="number" name="mixTime" required class="w-full border border-gray-300 rounded-lg p-2" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Hal</label>
      <select name="hall" class="w-full border border-gray-300 rounded-lg p-2">
        <option value="1">Hal 1</option>
        <option value="2">Hal 2</option>
      </select>
    </div>
    <div>
      <button type="submit" class="w-full px-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
        Voeg mengmachine toe
      </button>
    </div>
  `;

    panel.prepend(form);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(form);

        const machine = new Machine(
            `machine-${machineIdCounter++}`,
            parseInt(data.get('speed'), 10),
            parseInt(data.get('mixTime'), 10),
            parseInt(data.get('hall'), 10)
        );

        machines.push(machine);
        saveMachines();

        if (machine.hall === activeHallId) {
            renderMachineCard(machine);
        }

        form.reset();
    });

    loadMachines();
}

function renderMachinesForHall() {
    const hallContent = document.getElementById('hall-content');
    hallContent.innerHTML = '';

    const filtered = machines.filter(m => m.hall === activeHallId);
    if (filtered.length === 0) {
        hallContent.innerHTML = `<p class="text-gray-500 italic">Geen machines in Hal ${activeHallId}</p>`;
        return;
    }

    filtered.forEach(renderMachineCard);
}

function renderMachineCard(machine) {
    const container = document.getElementById('hall-content');

    const div = document.createElement('div');
    div.className = 'bg-gray-100 rounded-lg p-4 shadow flex flex-col gap-2 relative';
    div.setAttribute('data-machine-id', machine.id);

    div.innerHTML = `
    <div class="text-sm text-gray-500 font-medium">Machine: ${machine.id}</div>
    <div><strong>Snelheid:</strong> ${machine.speed}</div>
    <div><strong>Mengtijd:</strong> ${machine.mixTime} ms</div>
    <div><strong>Toegewezen aan:</strong> Hal ${machine.hall}</div>
  `;

    const outputZone = document.createElement('div');
    outputZone.className = 'mt-3';
    outputZone.innerHTML = `
    <div class="text-sm text-gray-600 font-semibold mb-1">Klaar met mengen:</div>
    <div class="flex flex-wrap gap-2" id="output-${machine.id}"></div>
  `;
    div.appendChild(outputZone);

    div.addEventListener('dragover', (e) => {
        e.preventDefault();
        div.classList.add('ring-2', 'ring-green-400');
    });

    div.addEventListener('dragleave', () => {
        div.classList.remove('ring-2', 'ring-green-400');
    });

    div.addEventListener('drop', (e) => {
        e.preventDefault();
        div.classList.remove('ring-2', 'ring-green-400');

        const potData = JSON.parse(e.dataTransfer.getData('application/json'));
        const potDiv = document.querySelector(`[data-pot-id="${potData.id}"]`);
        if (potDiv) potDiv.remove();

        const oldBadge = div.querySelector('.weather-badge');
        if (oldBadge) oldBadge.remove();

        const weather = getCurrentWeather();
        let extraText = '';
        let icon = '';

        if (weather) {
            const condition = (weather.condition || '').toLowerCase();
            const temp = weather.temperature;

            if (condition.includes('rain') || condition.includes('snow') || condition.includes('sneeuw')) {
                extraText += '10% extra door regen of sneeuw\n';
                icon += '<i class="fas fa-cloud-showers-heavy mr-1"></i>';
            }
            if (temp < 10) {
                extraText += '15% extra door kou\n';
                icon += '<i class="fas fa-snowflake mr-1"></i>';
            }
            if (temp > 35) {
                extraText += 'Maximaal 1 machine mag mengen\n';
                icon += '<i class="fas fa-temperature-high mr-1"></i>';
            }

            if (extraText) {
                const badge = document.createElement('div');
                badge.className = 'weather-badge text-xs text-yellow-800 bg-yellow-100 border border-yellow-300 px-3 py-1 rounded mb-2 whitespace-pre-wrap flex items-start gap-1';
                badge.innerHTML = `${icon}<div>${extraText.trim()}</div>`;
                div.insertBefore(badge, div.querySelector('.mt-2'));
            }
        }

        const mixTimes = Array.isArray(potData.contents)
            ? potData.contents.map(i => parseInt(i.mixTime) || 0)
            : [];

        let longestTime = Math.max(machine.mixTime, ...mixTimes);
        if (weather) {
            const condition = (weather.condition || '').toLowerCase();
            const temp = weather.temperature;

            if (condition.includes('rain') || condition.includes('snow') || condition.includes('sneeuw')) {
                longestTime *= 1.1;
            }
            if (temp < 10) {
                longestTime *= 1.15;
            }
            if (temp > 35 && activeMixingMachines.size >= 1) {
                alert(`Het is boven de 35°C. Er mag slechts één machine tegelijk mengen.`);
                const index = pots.findIndex(p => p.id === potData.id);
                if (index !== -1) renderPotVisual(pots[index]);
                return;
            }
        }

        const animationWrapper = document.createElement('div');
        animationWrapper.className = 'mixer-animation';

        const swirl = document.createElement('div');
        swirl.className = 'mixer-dot';
        swirl.style.background = `conic-gradient(${(potData.contents || []).map(i => i.color).join(',')})`;
        animationWrapper.appendChild(swirl);

        const arm = document.createElement('div');
        arm.className = 'mixer-arm';
        animationWrapper.appendChild(arm);

        div.appendChild(animationWrapper);

        const status = document.createElement('div');
        status.className = 'mt-2 text-sm text-blue-600 animate-pulse';
        status.textContent = `Machine ${machine.id} is bezig met mengen...`;
        div.appendChild(status);

        longestTime = Math.round(longestTime);
        activeMixingMachines.add(machine.id);

        setTimeout(() => {
            status.remove();
            animationWrapper.remove();
            activeMixingMachines.delete(machine.id);

            const outputContainer = div.querySelector(`#output-${machine.id}`);
            if (!outputContainer) return;

            const mixedColor = averageColor(potData.contents || []);
            const badge = document.createElement('div');
            badge.className = 'text-white text-xs px-2 py-1 rounded-full shadow';
            badge.style.backgroundColor = mixedColor;
            badge.textContent = `${potData.name} klaar`;
            outputContainer.appendChild(badge);

            const index = pots.findIndex(p => p.id === potData.id);
            if (index !== -1) {
                pots[index].status = 'klaar';
                pots[index].mixedColor = mixedColor;
                pots[index].contents = potData.contents;
                savePots();
                renderPotVisual(pots[index]);
            }

            const savedMachines = JSON.parse(localStorage.getItem('futureColor.machines')) || [];
            const updatedMachines = savedMachines.map(m => {
                if (m.id === machine.id) {
                    return {
                        ...m,
                        finishedPots: [...(m.finishedPots || []), potData.id]
                    };
                }
                return m;
            });
            localStorage.setItem('futureColor.machines', JSON.stringify(updatedMachines));
        }, longestTime);
    });

    container.appendChild(div);
}

function saveMachines() {
    localStorage.setItem('futureColor.machines', JSON.stringify(machines));
}

function loadMachines() {
    const saved = localStorage.getItem('futureColor.machines');
    if (!saved) return;

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return;

    parsed.forEach((m) => {
        const loadedMachine = new Machine(m.id, m.speed, m.mixTime, m.hall);
        loadedMachine.finishedPots = m.finishedPots || [];
        machines.push(loadedMachine);
    });

    machineIdCounter = parsed.length + 1;
    renderMachinesForHall();
}

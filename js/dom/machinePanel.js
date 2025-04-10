import { Machine } from '../models/Machine.js';
import { Pot } from '../models/Pot.js';

let machineIdCounter = 1;
let machines = [];

export function renderMachinesPanel() {
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
    renderMachineCard(machine);
    form.reset();
  });

  loadMachines();
}

function renderMachineCard(machine) {
  const container = document.getElementById('machines-container');

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
    if (potDiv) {
      potDiv.remove();
    }

    const status = document.createElement('div');
    status.className = 'mt-2 text-sm text-blue-600 animate-pulse';
    status.textContent = `Machine ${machine.id} is bezig met mengen...`;
    div.appendChild(status);

    const mixTimes = Array.isArray(potData.contents)
      ? potData.contents.map(i => parseInt(i.mixTime) || 0)
      : [];

    const longestTime = Math.max(machine.mixTime, ...mixTimes);

    setTimeout(() => {
      status.remove();

      const outputContainer = div.querySelector(`#output-${machine.id}`);
      if (!outputContainer) {
        console.warn(`⚠️ Output container niet gevonden voor ${machine.id}`);
        return;
      }

        const badge = document.createElement('div');
        badge.className = 'text-white text-xs px-2 py-1 rounded-full shadow';
        badge.style.backgroundColor = potData.contents?.[0]?.color || '#4ade80';
        badge.textContent = `✅ ${potData.name}`;
        outputContainer.appendChild(badge);

        const storedPots = JSON.parse(localStorage.getItem('futureColor.pots')) || [];

        const updatedPots = storedPots.map((p) => {
        if (p.id === potData.id) {
            return {
            ...p,
            contents: potData.contents || [],
            name: potData.name,
            status: 'klaar'
            };
        }
        return p;
        });

        localStorage.setItem('futureColor.pots', JSON.stringify(updatedPots));

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
    machines.push(loadedMachine);
    renderMachineCard(loadedMachine);
  });

  machineIdCounter = parsed.length + 1;
}

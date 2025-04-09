export function initApp() {
    const app = document.getElementById('app');
  
    app.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-6xl mx-auto">
  
      <section id="ingredient-panel" class="bg-white shadow-lg rounded-xl p-6">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Ingrediënten</h2>
        <div id="ingredients-container" class="flex flex-wrap gap-2"></div>
      </section>
  
      <section id="pots-panel" class="bg-white shadow-lg rounded-xl p-6">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Potten</h2>
        <div id="pots-container" class="grid grid-cols-2 gap-4"></div>
      </section>
  
      <section id="machines-panel" class="bg-white shadow-lg rounded-xl p-6">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Machines</h2>
        <div id="machines-container" class="space-y-2"></div>
      </section>
  
      <section id="halls-panel" class="bg-white shadow-lg rounded-xl p-6 col-span-1 md:col-span-2">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Menghallen</h2>
        <div id="hall-selector" class="flex gap-4 mb-4">
          <button id="hall-1" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">Hal 1</button>
          <button id="hall-2" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">Hal 2</button>
        </div>
        <div id="hall-content" class="border border-dashed border-gray-300 p-4 rounded-lg text-gray-500">Selecteer een hal...</div>
      </section>
  
    </div>
  `;  
  }
  
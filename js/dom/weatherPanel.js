let currentWeather = JSON.parse(localStorage.getItem('futureColor.weather')) || null;

export function getCurrentWeather() {
  return currentWeather;
}

export function setCurrentWeather(data) {
  currentWeather = data;
  localStorage.setItem('futureColor.weather', JSON.stringify(data));
}

const API_KEY = '7454e92d9688065b3cca9a1ee691d67b';

export function renderWeatherPanel() {
  const panel = document.createElement('section');
  panel.className = 'bg-white border border-gray-200 rounded-xl p-6 mt-6';
  panel.innerHTML = `
    <h2 class="text-xl font-bold mb-4 text-gray-800">Weer bij jouw filiaal</h2>
    <form id="weather-form" class="flex gap-4 mb-4">
      <input type="text" id="city-input" placeholder="Bijv. Breda" class="border p-2 rounded-lg w-64" required />
      <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
        Haal weer op
      </button>
    </form>
    <div id="weather-result" class="text-sm text-gray-700 italic">Geen weerdata beschikbaar.</div>
  `;

  document.getElementById('app').appendChild(panel);

  const form = panel.querySelector('#weather-form');
  const result = panel.querySelector('#weather-result');
  const cityInput = panel.querySelector('#city-input');

  if (currentWeather) {
    cityInput.value = currentWeather.city;
    result.innerHTML = `
      <strong>${currentWeather.city}</strong><br/>
      Temperatuur: ${currentWeather.temperature}°C<br/>
      Weertype: ${currentWeather.condition}
    `;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (!city) return;

    result.textContent = 'Weer wordt opgehaald...';

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) throw new Error('Ophalen mislukt');

      const data = await response.json();
      currentWeather = {
        city: data.name,
        temperature: data.main.temp,
        condition: data.weather[0].main.toLowerCase(),
      };

      setCurrentWeather(currentWeather);

      result.innerHTML = `
        <strong>${currentWeather.city}</strong><br/>
        Temperatuur: ${currentWeather.temperature}°C<br/>
        Weertype: ${currentWeather.condition}
      `;
    } catch (err) {
      result.textContent = 'Fout bij ophalen van weerdata. Controleer je API key of stad.';
    }
  });
} 

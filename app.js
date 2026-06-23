const contentDisplay = document.getElementById('content-display');
const searchForm = document.getElementById('search-form');
const compareForm = document.getElementById('compare-form');
const countrySelect = document.getElementById('country-select');
const compareSelect1 = document.getElementById('compare-select-1');
const compareSelect2 = document.getElementById('compare-select-2');
const tabExplore = document.getElementById('tab-explore');
const tabCompare = document.getElementById('tab-compare');

let choicesExplore = null;
let choicesCompare1 = null;
let choicesCompare2 = null;
let currentMode = 'explore';

let globalCountryDataset = [];
const STATIC_DATA_CDN = 'https://cdn.jsdelivr.net/gh/mledoze/countries@master/dist/countries.json';

window.addEventListener('DOMContentLoaded', initializeApp);

searchForm.addEventListener('submit', handleSearchSubmit);
compareForm.addEventListener('submit', handleCompareSubmit);

countrySelect.addEventListener('change', handleExploreChange);
compareSelect1.addEventListener('change', handleCompareChange);
compareSelect2.addEventListener('change', handleCompareChange);

tabExplore.addEventListener('click', () => switchMode('explore'));
tabCompare.addEventListener('click', () => switchMode('compare'));

function initializeApp() {
    populateAllDropdowns();
}

function switchMode(mode) {
    currentMode = mode;
    
    const emptyMessage = mode === 'explore' 
        ? 'Search for a country to begin.' 
        : 'Select two countries to compare side-by-side.';
    
    contentDisplay.innerHTML = `
        <div class="state-message empty-state">
            <p>${emptyMessage}</p>
        </div>
    `;
    
    const isExplore = mode === 'explore';
    tabExplore.classList.toggle('active', isExplore);
    tabCompare.classList.toggle('active', !isExplore);
    searchForm.classList.toggle('hidden', !isExplore);
    compareForm.classList.toggle('hidden', isExplore);
}

function handleSearchSubmit(event) {
    event.preventDefault();
    const selectedCountry = choicesExplore ? choicesExplore.getValue(true) : countrySelect.value;
    if (selectedCountry) {
        renderSingleCountryView(selectedCountry);
    }
}

function handleExploreChange(event) {
    const selectedCountry = event.detail?.value || event.target.value;
    if (selectedCountry && selectedCountry !== '') {
        renderSingleCountryView(selectedCountry);
    }
}

function handleCompareSubmit(event) {
    event.preventDefault();
    triggerCompareIfReady(true);
}

function handleCompareChange() {
    triggerCompareIfReady(false);
}

function triggerCompareIfReady(showValidationError) {
    const countryA = choicesCompare1 ? choicesCompare1.getValue(true) : compareSelect1.value;
    const countryB = choicesCompare2 ? choicesCompare2.getValue(true) : compareSelect2.value;

    if (!countryA || !countryB) {
        if (showValidationError) {
            renderError("Please select both countries to start the comparison.");
        }
        return; 
    }
    renderComparisonView(countryA, countryB);
}

// Memory-localized lookup eliminates slow network lookups entirely
async function fetchCountryFromAPI(countryName) {
    const matchedCountry = globalCountryDataset.find(
        c => c.name?.common?.toLowerCase() === countryName.toLowerCase()
    );
    
    if (!matchedCountry) {
        throw new Error("Country profile not found in current index.");
    }
    return matchedCountry;
}

async function populateAllDropdowns() {
    try {
        // Fetch database from stable open-source CDN backup
        const response = await fetch(STATIC_DATA_CDN);
        if (!response.ok) throw new Error(`CDN Stream Response Error: ${response.status}`);
        
        globalCountryDataset = await response.json();

        // Map data arrays and sort alphabetically
        const choicesData = globalCountryDataset
            .map(country => ({
                value: country.name.common,
                label: country.name.common
            }))
            .sort((a, b) => a.label.localeCompare(b.label));

        // Initialize modern Choices.js custom selection fields
        choicesExplore = createChoicesInstance(countrySelect, 'Select a country...', choicesData);
        choicesCompare1 = createChoicesInstance(compareSelect1, 'Select first country...', choicesData);
        choicesCompare2 = createChoicesInstance(compareSelect2, 'Select second country...', choicesData);

    } catch (error) {
        console.error("Initialization Error:", error);
        renderError(`Could not configure country list. <br><small>Fallback Detail: ${error.message}</small>`);
    }
}

function createChoicesInstance(element, placeholderText, choicesData) {
    element.innerHTML = ''; 

    const instance = new Choices(element, {
        searchEnabled: true,
        itemSelectText: '',
        shouldSort: false,
        placeholder: true,
        placeholderValue: placeholderText,
        allowHTML: true
    });

    instance.setChoices(
        [
            { value: '', label: placeholderText, placeholder: true, selected: true },
            ...choicesData
        ],
        'value',
        'label',
        true
    );

    return instance;
}

async function renderSingleCountryView(countryName) {
    renderLoading();
    try {
        const countryData = await fetchCountryFromAPI(countryName);
        contentDisplay.innerHTML = `
            <div class="single-display-layout">
                ${getCountryCardMarkup(countryData)}
            </div>
        `;
    } catch (error) {
        renderError(error.message);
    }
}

async function renderComparisonView(nameA, nameB) {
    renderLoading();
    try {
        const [dataA, dataB] = await Promise.all([
            fetchCountryFromAPI(nameA),
            fetchCountryFromAPI(nameB)
        ]);

        contentDisplay.innerHTML = `
            <div class="compare-grid">
                ${getCountryCardMarkup(dataA)}
                ${getCountryCardMarkup(dataB)}
            </div>
        `;
    } catch (error) {
        renderError("Could not compile comparative statistics.");
    }
}

function getCountryCardMarkup(country) {
    // FIX 1: Generate high-res flag image from safe global FlagCDN using 2-letter ISO code (cca2)
    const countryCode = country.cca2 ? country.cca2.toLowerCase() : '';
    const flagUrl = countryCode ? `https://flagcdn.com/w320/${countryCode}.png` : '';
    const flagAlt = `Official flag representation for ${country.name?.common || 'Selected Country'}`;
    
    const name = country.name?.common || 'N/A';
    const capital = country.capital ? (Array.isArray(country.capital) ? country.capital.join(', ') : country.capital) : 'N/A';
    const population = country.population ? country.population.toLocaleString() : '0';
    const region = country.region || 'N/A';
    
    let currencies = 'N/A';
    if (country.currencies) {
        currencies = Object.values(country.currencies)
            .map(c => `${c.name || 'Currency'} (${c.symbol || ''})`)
            .join(', ');
    }

    const mapQuery = encodeURIComponent(name);
    // FIX 2: Correct standard Google Maps embed URL using syntax-valid string interpolation ($ sign)
    const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=5&ie=UTF8&iwloc=&output=embed`;

    return `
        <article class="country-card">
            <div class="flag-container">
                <img src="${flagUrl}" alt="${flagAlt}">
            </div>
            <div class="country-details">
                <h2>${name}</h2>
                <p class="info-item"><strong>Capital:</strong> ${capital}</p>
                <p class="info-item"><strong>Population:</strong> ${population}</p>
                <p class="info-item"><strong>Region:</strong> ${region}</p>
                <p class="info-item"><strong>Currency:</strong> ${currencies}</p>
            </div>
            <div class="map-container">
                <iframe 
                    width="100%" 
                    height="250" 
                    frameborder="0" 
                    style="border:0;" 
                    src="${mapEmbedUrl}" 
                    allowfullscreen="" 
                    loading="lazy">
                </iframe>
            </div>
        </article>
    `;
}

function renderLoading() {
    contentDisplay.innerHTML = `
        <div class="state-message">
            <div class="spinner"></div>
            <p>Fetching and mapping regional profiles...</p>
        </div>
    `;
}

function renderError(errorMessage) {
    contentDisplay.innerHTML = `
        <div class="state-message error-state">
            <p><strong>Operational Error:</strong> ${errorMessage}</p>
        </div>
    `;
}
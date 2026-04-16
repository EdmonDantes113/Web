// City Data Dashboard - Main JavaScript Functionality.

// API Configuration
const API_CONFIG = {
    weather: {
        geocodeUrl: 'https://geocoding-api.open-meteo.com/v1/search',
        url: 'https://api.open-meteo.com/v1/forecast'
    },
    philData: {
        packageSearchUrl: 'https://data.gov.ph/api/3/action/package_search'
    },
    economic: {
        gdpPerCapitaUrl: 'https://api.worldbank.org/v2/country/PHL/indicator/NY.GDP.PCAP.CD?format=json',
        unemploymentUrl: 'https://api.worldbank.org/v2/country/PHL/indicator/SL.UEM.TOTL.ZS?format=json',
        povertyUrl: 'https://api.worldbank.org/v2/country/PHL/indicator/SI.POV.NAHC?format=json',
        usdToPhpUrl: 'https://open.er-api.com/v6/latest/USD'
    },
    environment: {
        url: 'https://data.gov.ph/dataset/environmental-data'
    }
};

const SJDM_FACEBOOK_PAGE_URL = 'https://www.facebook.com/sdjmpio';
const MARILAO_FACEBOOK_PAGE_URL = 'https://www.facebook.com/MarileNews';

const CITY_CONFIG = {
    'San Jose Del Monte': {
        localityType: 'City',
        region: 'Central Luzon (Region III)',
        province: 'Bulacan',
        latitude: 14.8147,
        longitude: 121.0490,
        facebookPageUrl: SJDM_FACEBOOK_PAGE_URL,
        sources: {
            census: [
                'https://www.psa.gov.ph/statistics/census/population-and-housing',
                'https://openstat.psa.gov.ph/'
            ],
            traffic: [
                'https://mmda.gov.ph/traffic-updates.html',
                'https://lto.gov.ph/road-safety/'
            ],
            health: [
                'https://doh.gov.ph/statistics',
                'https://nhfr.doh.gov.ph/'
            ],
            education: [
                'https://www.deped.gov.ph/facts-and-figures/',
                'https://ched.gov.ph/statistics/'
            ],
            safety: [
                'https://didm.pnp.gov.ph/images/Crime_Information.html',
                'https://napolcom.gov.ph/'
            ]
        }
    },
    Marilao: {
        localityType: 'Municipality',
        region: 'Central Luzon (Region III)',
        province: 'Bulacan',
        latitude: 14.7570,
        longitude: 120.9455,
        facebookPageUrl: MARILAO_FACEBOOK_PAGE_URL,
        sources: {
            census: [
                'https://www.psa.gov.ph/statistics/census/population-and-housing',
                'https://openstat.psa.gov.ph/'
            ],
            traffic: [
                'https://mmda.gov.ph/traffic-updates.html',
                'https://lto.gov.ph/road-safety/'
            ],
            health: [
                'https://doh.gov.ph/statistics',
                'https://nhfr.doh.gov.ph/'
            ],
            education: [
                'https://www.deped.gov.ph/facts-and-figures/',
                'https://ched.gov.ph/statistics/'
            ],
            safety: [
                'https://didm.pnp.gov.ph/images/Crime_Information.html',
                'https://napolcom.gov.ph/'
            ]
        }
    }
};

// Heuristic: approximates monthly median income as 45% of monthly per-capita GDP output.
// This preserves the dashboard's prior behavior where income is displayed as a conservative subset
// of per-capita output (not a statistically exact median-income measure).
const ECONOMIC_MEDIAN_INCOME_ESTIMATE_FACTOR = 0.45;
const MONTHS_PER_YEAR = 12;
const ECONOMIC_POVERTY_FALLBACK = 8.5; // Legacy dashboard baseline (prior static poverty incidence value).
const DEFAULT_COUNTRY_CODE = 'PH';

function getCityConfig(city) {
    return CITY_CONFIG[city] || CITY_CONFIG['San Jose Del Monte'];
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function safeLogValue(value) {
    return String(value ?? '').replace(/[\r\n\t]/g, ' ').slice(0, 180);
}

function toSafeUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.href;
    } catch (error) {
        console.warn('Invalid URL encountered:', safeLogValue(url), error);
        return 'about:blank';
    }
}

function toSafeFacebookPageUrl(url) {
    const safeUrl = toSafeUrl(url);
    if (safeUrl === 'about:blank') return 'https://www.facebook.com/';
    const parsed = new URL(safeUrl);
    if (parsed.protocol !== 'https:' || parsed.hostname !== 'www.facebook.com') {
        return 'https://www.facebook.com/';
    }
    return safeUrl;
}

function toSafeFacebookPluginUrl(url) {
    const safeUrl = toSafeUrl(url);
    if (safeUrl === 'about:blank') {
        return 'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2F';
    }
    const parsed = new URL(safeUrl);
    if (parsed.protocol !== 'https:' || parsed.hostname !== 'www.facebook.com' || parsed.pathname !== '/plugins/page.php') {
        return 'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2F';
    }
    return safeUrl;
}

function buildFacebookPluginUrl(pageUrl) {
    const pluginParams = new URLSearchParams({
        href: toSafeFacebookPageUrl(pageUrl),
        tabs: 'timeline',
        width: '500',
        height: '700',
        small_header: 'false',
        adapt_container_width: 'true',
        hide_cover: 'false',
        show_facepile: 'true'
    });
    return toSafeFacebookPluginUrl(`https://www.facebook.com/plugins/page.php?${pluginParams.toString()}`);
}

function setUnavailableState(elementId, label, reason) {
    const safeReason = escapeHtml(reason || 'Data source is currently unavailable.');
    showSuccess(elementId, `
        <div class="card">
            <h2>${escapeHtml(label)}</h2>
            <div class="data-content">
                <p class="error"><strong>Unavailable:</strong> ${safeReason}</p>
            </div>
        </div>
    `);
}

function updateDashboardTitle(city) {
    const cityConfig = getCityConfig(city);
    const dashboardTitle = document.getElementById('dashboardTitle');
    const dashboardSubtitle = document.getElementById('dashboardSubtitle');
    const nextTitle = `${city} ${cityConfig.localityType} Dashboard`;
    if (dashboardTitle) dashboardTitle.textContent = nextTitle;
    if (dashboardSubtitle) dashboardSubtitle.textContent = 'Philippines - Real-time City Data';
    document.title = nextTitle;
}

// Utility function to create DOM elements
function createElement(tag, className, textContent) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
}

// Utility function to show loading state
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    element.innerHTML = '<p class="loading">Loading data...</p>';
}

// Utility function to show error state
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<p class="error">Error: ${message}</p>`;
}

// Utility function to show success state
function showSuccess(elementId, content) {
    const element = document.getElementById(elementId);
    element.innerHTML = content;
}

function getWeatherDescriptor(code) {
    const codeMap = {
        0: { main: 'Clear', description: 'clear sky', icon: '01' },
        1: { main: 'Cloudy', description: 'mainly clear', icon: '02' },
        2: { main: 'Cloudy', description: 'partly cloudy', icon: '03' },
        3: { main: 'Cloudy', description: 'overcast', icon: '04' },
        45: { main: 'Fog', description: 'fog', icon: '50' },
        48: { main: 'Fog', description: 'depositing rime fog', icon: '50' },
        51: { main: 'Drizzle', description: 'light drizzle', icon: '09' },
        53: { main: 'Drizzle', description: 'moderate drizzle', icon: '09' },
        55: { main: 'Drizzle', description: 'dense drizzle', icon: '09' },
        61: { main: 'Rain', description: 'slight rain', icon: '10' },
        63: { main: 'Rain', description: 'moderate rain', icon: '10' },
        65: { main: 'Rain', description: 'heavy rain', icon: '10' },
        71: { main: 'Snow', description: 'slight snow fall', icon: '13' },
        73: { main: 'Snow', description: 'moderate snow fall', icon: '13' },
        75: { main: 'Snow', description: 'heavy snow fall', icon: '13' },
        80: { main: 'Rain', description: 'rain showers', icon: '09' },
        81: { main: 'Rain', description: 'moderate rain showers', icon: '09' },
        82: { main: 'Rain', description: 'violent rain showers', icon: '09' },
        95: { main: 'Thunderstorm', description: 'thunderstorm', icon: '11' },
        96: { main: 'Thunderstorm', description: 'thunderstorm with hail', icon: '11' },
        99: { main: 'Thunderstorm', description: 'thunderstorm with heavy hail', icon: '11' }
    };

    return codeMap[code] || { main: 'Unknown', description: 'weather data unavailable', icon: '02' };
}

// Fetch weather data
async function fetchWeatherData(city) {
    try {
        showLoading('weatherData');
        const cityConfig = getCityConfig(city);
        const weatherParams = new URLSearchParams({
            latitude: String(cityConfig.latitude),
            longitude: String(cityConfig.longitude),
            current_weather: 'true',
            windspeed_unit: 'kmh'
        });
        const weatherResponse = await fetch(`${API_CONFIG.weather.url}?${weatherParams.toString()}`);
        if (!weatherResponse.ok) throw new Error(`Weather API error: ${weatherResponse.status}`);
        const weatherData = await weatherResponse.json();
        const current = weatherData?.current_weather;

        if (!current) throw new Error('Weather API response missing current_weather data');

        const descriptor = getWeatherDescriptor(current.weathercode);
        const iconSuffix = current.is_day ? 'd' : 'n';

        return {
            name: city,
            city,
            sys: { country: DEFAULT_COUNTRY_CODE },
            main: {
                temp: current.temperature,
                feels_like: null,
                humidity: null,
                pressure: null
            },
            weather: [{
                main: descriptor.main,
                description: descriptor.description,
                icon: `${descriptor.icon}${iconSuffix}`
            }],
            wind: { speed: current.windspeed },
            dt: new Date(current.time).getTime()
        };
    } catch (error) {
        showError('weatherData', 'Failed to load weather data');
        console.error('Weather fetch error:', error);
        return null;
    }
}

async function fetchPhilDatasetIndex(city, searchTerm, sourceUrls = []) {
    const cityConfig = getCityConfig(city);
    const params = new URLSearchParams({
        q: `${searchTerm} "${city}" "${cityConfig.province}"`,
        rows: '5'
    });
    const searchUrl = `${API_CONFIG.philData.packageSearchUrl}?${params.toString()}`;
    try {
        const response = await fetch(searchUrl);
        if (!response.ok) throw new Error(`data.gov.ph package_search error: ${response.status}`);
        const payload = await response.json();
        const datasets = Array.isArray(payload?.result?.results) ? payload.result.results : [];
        return {
            datasets: datasets.map((item) => {
                const firstResourceUrl = Array.isArray(item.resources) && item.resources[0] ? item.resources[0].url : '';
                return {
                    title: item.title || 'Untitled dataset',
                    organization: item?.organization?.title || 'Unknown organization',
                    updated: item.metadata_modified || item.metadata_created || 'Unknown date',
                    url: item.url || firstResourceUrl || ''
                };
            }),
            searchUrl,
            sourceUrls
        };
    } catch (error) {
        console.error(`Local PH data fetch error (${safeLogValue(searchTerm)}, ${safeLogValue(city)}):`, error);
        return {
            datasets: [],
            searchUrl,
            sourceUrls,
            error: error.message
        };
    }
}

// Fetch census/population data
async function fetchCensusData(city) {
    try {
        showLoading('censusData');
        const cityConfig = getCityConfig(city);
        const sources = cityConfig.sources.census;
        const dataIndex = await fetchPhilDatasetIndex(city, 'census population', sources);
        return {
            city,
            province: cityConfig.province,
            region: cityConfig.region,
            datasets: dataIndex.datasets,
            source_urls: dataIndex.sourceUrls,
            source_query_url: dataIndex.searchUrl,
            unavailable: dataIndex.datasets.length === 0,
            unavailable_reason: dataIndex.error || 'No matching census datasets found for the selected city.'
        };
    } catch (error) {
        showError('censusData', 'Failed to load census data');
        console.error('Census fetch error:', error);
        return null;
    }
}

// Fetch economic data
async function fetchEconomicData(city) {
    try {
        showLoading('economicData');
        const [gdpResponse, unemploymentResponse, povertyResponse, exchangeResponse] = await Promise.all([
            fetch(API_CONFIG.economic.gdpPerCapitaUrl),
            fetch(API_CONFIG.economic.unemploymentUrl),
            fetch(API_CONFIG.economic.povertyUrl),
            fetch(API_CONFIG.economic.usdToPhpUrl)
        ]);

        if (!gdpResponse.ok) throw new Error(`Economic GDP API error: ${gdpResponse.status}`);
        if (!unemploymentResponse.ok) throw new Error(`Economic unemployment API error: ${unemploymentResponse.status}`);
        if (!povertyResponse.ok) throw new Error(`Economic poverty API error: ${povertyResponse.status}`);
        if (!exchangeResponse.ok) throw new Error(`Exchange API error: ${exchangeResponse.status}`);

        const [gdpPayload, unemploymentPayload, povertyPayload, exchangePayload] = await Promise.all([
            gdpResponse.json(),
            unemploymentResponse.json(),
            povertyResponse.json(),
            exchangeResponse.json()
        ]);

        const getLatestValue = (payload) => {
            // World Bank API returns [metadata, dataSeries], where index 1 contains year/value entries.
            const series = Array.isArray(payload?.[1]) ? payload[1] : [];
            const latest = series.reduce((latestItem, item) => {
                if (!item || item.value === null || item.value === undefined) return latestItem;
                if (!latestItem) return item;
                return Number(item.date || 0) > Number(latestItem.date || 0) ? item : latestItem;
            }, null);
            return latest ? latest.value : null;
        };

        const gdpPerCapitaUsd = getLatestValue(gdpPayload);
        const unemploymentRate = getLatestValue(unemploymentPayload);
        const povertyIncidence = getLatestValue(povertyPayload);
        const usdToPhp = exchangePayload?.rates?.PHP || null;

        if (gdpPerCapitaUsd === null || unemploymentRate === null || usdToPhp === null) {
            throw new Error('Economic API response missing required values');
        }

        const gdpPerCapitaPhpRaw = gdpPerCapitaUsd * usdToPhp;
        const gdpPerCapitaPhp = Math.round(gdpPerCapitaPhpRaw);
        const estimatedMedianIncome = Math.round((gdpPerCapitaPhpRaw / MONTHS_PER_YEAR) * ECONOMIC_MEDIAN_INCOME_ESTIMATE_FACTOR);
        const employmentRateRaw = 100 - unemploymentRate;
        const employmentRateRounded = +employmentRateRaw.toFixed(1);
        const employmentRate = Math.max(0, Math.min(100, employmentRateRounded));
        if (employmentRateRounded < 0 || employmentRateRounded > 100) {
            console.warn('Economic data warning: unemployment-derived employment rate was out of expected bounds.', {
                unemploymentRate,
                derivedEmploymentRate: employmentRateRounded
            });
        }

        return {
            city,
            gdp_per_capita: gdpPerCapitaPhp, // PHP (derived from World Bank + FX rate)
            employment_rate: employmentRate, // %
            major_industries: [
                "Manufacturing",
                "Retail Trade",
                "Real Estate",
                "Tourism",
                "Agriculture"
            ],
            poverty_incidence: povertyIncidence !== null ? +povertyIncidence.toFixed(1) : ECONOMIC_POVERTY_FALLBACK, // %
            median_income: estimatedMedianIncome // PHP monthly (estimated from per-capita GDP)
        };
    } catch (error) {
        showError('economicData', 'Failed to load economic data');
        console.error('Economic fetch error:', error);
        return null;
    }
}

// Fetch traffic data
async function fetchTrafficData(city) {
    try {
        showLoading('trafficData');
        const cityConfig = getCityConfig(city);
        const sources = cityConfig.sources.traffic;
        const dataIndex = await fetchPhilDatasetIndex(city, 'traffic road transport', sources);
        return {
            city,
            last_updated: new Date().toLocaleString(),
            datasets: dataIndex.datasets,
            source_urls: dataIndex.sourceUrls,
            source_query_url: dataIndex.searchUrl,
            unavailable: dataIndex.datasets.length === 0,
            unavailable_reason: dataIndex.error || 'No matching traffic datasets found for the selected city.'
        };
    } catch (error) {
        showError('trafficData', 'Failed to load traffic data');
        console.error('Traffic fetch error:', error);
        return null;
    }
}

// Fetch social data through Facebook Page Plugin (no Graph API token exposure)
async function fetchSocialData(city) {
    try {
        showLoading('socialData');
        const cityConfig = getCityConfig(city);
        const pageUrl = toSafeFacebookPageUrl(cityConfig.facebookPageUrl);
        return {
            city,
            page_url: pageUrl,
            page_plugin_url: buildFacebookPluginUrl(pageUrl)
        };
    } catch (error) {
        showError('socialData', 'Failed to load social media data');
        console.error('Social fetch error:', error);
        return null;
    }
}

// Fetch health services data
async function fetchHealthData(city) {
    try {
        showLoading('healthData');
        const cityConfig = getCityConfig(city);
        const sources = cityConfig.sources.health;
        const dataIndex = await fetchPhilDatasetIndex(city, 'health hospital clinic', sources);
        return {
            city,
            datasets: dataIndex.datasets,
            source_urls: dataIndex.sourceUrls,
            source_query_url: dataIndex.searchUrl,
            unavailable: dataIndex.datasets.length === 0,
            unavailable_reason: dataIndex.error || 'No matching health datasets found for the selected city.'
        };
    } catch (error) {
        showError('healthData', 'Failed to load health data');
        console.error('Health fetch error:', error);
        return null;
    }
}

// Fetch education data
async function fetchEducationData(city) {
    try {
        showLoading('educationData');
        const cityConfig = getCityConfig(city);
        const sources = cityConfig.sources.education;
        const dataIndex = await fetchPhilDatasetIndex(city, 'education school enrollment literacy', sources);
        return {
            city,
            datasets: dataIndex.datasets,
            source_urls: dataIndex.sourceUrls,
            source_query_url: dataIndex.searchUrl,
            unavailable: dataIndex.datasets.length === 0,
            unavailable_reason: dataIndex.error || 'No matching education datasets found for the selected city.'
        };
    } catch (error) {
        showError('educationData', 'Failed to load education data');
        console.error('Education fetch error:', error);
        return null;
    }
}

// Fetch public safety data
async function fetchSafetyData(city) {
    try {
        showLoading('safetyData');
        const cityConfig = getCityConfig(city);
        const sources = cityConfig.sources.safety;
        const dataIndex = await fetchPhilDatasetIndex(city, 'crime public safety police fire', sources);
        return {
            city,
            datasets: dataIndex.datasets,
            source_urls: dataIndex.sourceUrls,
            source_query_url: dataIndex.searchUrl,
            unavailable: dataIndex.datasets.length === 0,
            unavailable_reason: dataIndex.error || 'No matching public safety datasets found for the selected city.'
        };
    } catch (error) {
        showError('safetyData', 'Failed to load safety data');
        console.error('Safety fetch error:', error);
        return null;
    }
}

// Fetch environment data
async function fetchEnvironmentData(city) {
    try {
        showLoading('environmentData');
        const cityConfig = getCityConfig(city);
        const cityEnvironmentMetrics = {
            'San Jose Del Monte': {
                parks_and_recreation: 24,
                tree_cover_percentage: 18.7
            },
            Marilao: {
                parks_and_recreation: 19,
                tree_cover_percentage: 16.1
            }
        };
        const metrics = cityEnvironmentMetrics[city] || cityEnvironmentMetrics['San Jose Del Monte'];
        return {
            city,
            air_quality_index: 45, // Good
            water_quality_rating: "Good",
            green_space_per_capita: 12.5, // sq m per person
            parks_and_recreation: metrics.parks_and_recreation,
            waste_diversion_rate: 68.3, // %
            recycling_rate: 42.1, // %
            tree_cover_percentage: metrics.tree_cover_percentage, // %
            renewable_energy_usage: 15.8, // %
            flood_prone_areas: 12.4, // % of city area
            environmental_programs: [
                `${cityConfig.localityType} Urban Greening Program`,
                "Waste Segregation Initiative",
                "Clean Air Monitoring",
                "River Rehabilitation Project",
                "Solar Power Incentive Program"
            ]
        };
    } catch (error) {
        showError('environmentData', 'Failed to load environment data');
        console.error('Environment fetch error:', error);
        return null;
    }
}

// Tab navigation: load content only when tab is activated
const tabConfig = [
    { btn: 'weather', tab: 'weatherTab', loader: fetchWeatherData, renderer: renderWeatherData },
    { btn: 'census', tab: 'censusTab', loader: fetchCensusData, renderer: renderCensusData },
    { btn: 'economic', tab: 'economicTab', loader: fetchEconomicData, renderer: renderEconomicData },
    { btn: 'traffic', tab: 'trafficTab', loader: fetchTrafficData, renderer: renderTrafficData },
    { btn: 'social', tab: 'socialTab', loader: fetchSocialData, renderer: renderSocialData },
    { btn: 'health', tab: 'healthTab', loader: fetchHealthData, renderer: renderHealthData },
    { btn: 'education', tab: 'educationTab', loader: fetchEducationData, renderer: renderEducationData },
    { btn: 'safety', tab: 'safetyTab', loader: fetchSafetyData, renderer: renderSafetyData },
    { btn: 'environment', tab: 'environmentTab', loader: fetchEnvironmentData, renderer: renderEnvironmentData }
];

let currentCity = 'San Jose Del Monte';
let tabDataCache = {};

function setActiveTab(tabKey) {
    // Remove active from all tab buttons and panes
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    // Add active to selected
    const btn = document.querySelector(`.tab-btn[data-tab="${tabKey}"]`);
    const pane = document.getElementById(tabKey + 'Tab');
    if (btn) btn.classList.add('active');
    if (pane) pane.classList.add('active');
}

async function loadTab(tabKey) {
    setActiveTab(tabKey);
    updateLastUpdated();
    const tab = tabConfig.find(t => t.btn === tabKey);
    if (!tab) return;
    // Only fetch if not cached for this city
    if (!tabDataCache[tabKey] || tabDataCache[tabKey].city !== currentCity) {
        const data = await tab.loader(currentCity);
        tabDataCache[tabKey] = data;
    }
    tab.renderer(tabDataCache[tabKey]);
}

document.addEventListener('DOMContentLoaded', function() {
    // Tab button event listeners
    function setupTabEvents() {
        document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
            btn.addEventListener('click', function(e) {
                // Prevent click if remove button was clicked
                if (e.target.classList.contains('remove-tab')) return;
                const tabKey = btn.getAttribute('data-tab');
                loadTab(tabKey);
            });
        });
        document.querySelectorAll('.remove-tab').forEach(span => {
            span.onclick = function(e) {
                e.stopPropagation();
                const tabKey = span.getAttribute('data-tab');
                removeTab(tabKey);
            };
        });
    }
    // Store removed tabs
    let removedTabs = [];
    function removeTab(tabKey) {
        const btn = document.querySelector(`.tab-btn[data-tab="${tabKey}"]`);
        if (!btn) return;
        // Only remove if more than one tab is visible
        const visibleTabs = Array.from(document.querySelectorAll('.tab-btn[data-tab]')).filter(b => b.style.display !== 'none');
        if (visibleTabs.length <= 1) return;
        btn.style.display = 'none';
        removedTabs.push(tabKey);
        // Hide tab content if it was active
        if (btn.classList.contains('active')) {
            // Activate the first visible tab
            const firstVisible = visibleTabs.find(b => b.style.display !== 'none' && b !== btn);
            if (firstVisible) {
                const newTabKey = firstVisible.getAttribute('data-tab');
                loadTab(newTabKey);
            }
        }
        updateAddTabDropdown();
    }
    function addTab(tabKey) {
        const btn = document.querySelector(`.tab-btn[data-tab="${tabKey}"]`);
        if (btn) {
            btn.style.display = '';
            // If no tab is active, activate this one
            if (!document.querySelector('.tab-btn.active')) {
                loadTab(tabKey);
            }
            removedTabs = removedTabs.filter(t => t !== tabKey);
            updateAddTabDropdown();
        }
    }
    function updateAddTabDropdown() {
        const container = document.getElementById('addTabDropdownContainer');
        container.innerHTML = '';
        if (removedTabs.length === 0) return;
        const select = document.createElement('select');
        select.style.marginRight = '0.5rem';
        select.innerHTML = '<option value="">Add Tab...</option>' +
            removedTabs.map(tabKey => {
                const btn = document.querySelector(`.tab-btn[data-tab="${tabKey}"]`);
                return `<option value="${tabKey}">${btn ? btn.textContent.replace('✖','').trim() : tabKey}</option>`;
            }).join('');
        select.onchange = function() {
            if (select.value) addTab(select.value);
            select.value = '';
        };
        container.appendChild(select);
    }
    setupTabEvents();
    const citySelect = document.getElementById('citySelect');
    if (citySelect) {
        citySelect.value = currentCity;
        citySelect.addEventListener('change', async function(e) {
            const activeBtn = document.querySelector('.tab-btn.active');
            const activeTab = activeBtn ? activeBtn.getAttribute('data-tab') : 'weather';
            currentCity = e.target.value;
            tabDataCache = {};
            updateDashboardTitle(currentCity);
            await loadAllData(currentCity);
            updateFacebookPageForCity(currentCity);
            setActiveTab(activeTab);
        });
    }
    updateDashboardTitle(currentCity);
    // Initial load: weather tab
    loadTab('weather');
});

// Update last updated timestamp
function updateLastUpdated() {
    const now = new Date();
    document.getElementById('lastUpdated').textContent = now.toLocaleString();
}

// Main function to load all data
async function loadAllData(city = 'San Jose Del Monte') {
    try {
        updateDashboardTitle(city);
        // Update last updated timestamp
        updateLastUpdated();

        // Fetch all data concurrently
        const [weatherData, censusData, economicData, trafficData, socialData, healthData, educationData, safetyData, environmentData] = await Promise.all([
            fetchWeatherData(city),
            fetchCensusData(city),
            fetchEconomicData(city),
            fetchTrafficData(city),
            fetchSocialData(city),
            fetchHealthData(city),
            fetchEducationData(city),
            fetchSafetyData(city),
            fetchEnvironmentData(city)
        ]);

        // Render all data
        renderWeatherData(weatherData);
        renderCensusData(censusData);
        renderEconomicData(economicData);
        renderTrafficData(trafficData);
        renderSocialData(socialData);
        renderHealthData(healthData);
        renderEducationData(educationData);
        renderSafetyData(safetyData);
        renderEnvironmentData(environmentData);

        tabDataCache = {
            weather: weatherData,
            census: censusData,
            economic: economicData,
            traffic: trafficData,
            social: socialData,
            health: healthData,
            education: educationData,
            safety: safetyData,
            environment: environmentData
        };

    } catch (error) {
        console.error('Error loading data:', error);
        // Individual error handling is done in each fetch function
    }
}


// Optional: Auto-refresh current tab every 5 minutes
setInterval(() => {
    const activeBtn = document.querySelector('.tab-btn.active');
    const tabKey = activeBtn ? activeBtn.getAttribute('data-tab') : 'weather';
    tabDataCache[tabKey] = null; // Invalidate cache for current tab
    loadTab(tabKey);
}, 5 * 60 * 1000); // 5 minutes

// Render weather data
function renderWeatherData(data) {
    if (!data) return;
    // Weather icon (OpenWeather icon or SVG)
    const iconUrl = data.weather && data.weather[0] && data.weather[0].icon
        ? `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        : 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/cloud-sun.svg';

    // Chart.js: temperature (current, feels_like)
    setTimeout(() => {
        if (document.getElementById('weatherChart')) {
            const ctx = document.getElementById('weatherChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Current', 'Feels Like'],
                    datasets: [{
                        label: 'Temperature (°C)',
                        data: [data.main.temp, data.main.feels_like],
                        backgroundColor: ['#FF6B9D', '#FF9F1C']
                    }]
                },
                options: {
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } }
                }
            });
        }
    }, 100);

    document.getElementById('weatherData').innerHTML = `
        <div class="card">
            <h2>Weather in ${data.name}, ${data.sys.country}</h2>
            <div class="data-content" style="display:flex;align-items:center;gap:2rem;flex-wrap:wrap;">
                <div style="flex:0 0 100px;text-align:center;">
                    <img src="${iconUrl}" alt="Weather Icon" style="width:80px;height:80px;">
                    <div style="font-size:1.1rem;font-weight:600;">${data.weather[0].main}</div>
                </div>
                <div style="flex:1;min-width:180px;">
                    <p><strong>Temperature:</strong> ${data.main.temp}°C (feels like ${data.main.feels_like !== null && data.main.feels_like !== undefined ? `${data.main.feels_like}°C` : 'Unavailable'})</p>
                    <p><strong>Condition:</strong> ${data.weather[0].description}</p>
                    <p><strong>Humidity:</strong> ${data.main.humidity !== null && data.main.humidity !== undefined ? `${data.main.humidity}%` : 'Unavailable'}</p>
                    <p><strong>Pressure:</strong> ${data.main.pressure !== null && data.main.pressure !== undefined ? `${data.main.pressure} hPa` : 'Unavailable'}</p>
                    <p><strong>Wind Speed:</strong> ${data.wind.speed !== null && data.wind.speed !== undefined ? `${data.wind.speed} km/h` : 'Unavailable'}</p>
                </div>
                <div style="flex:1;min-width:180px;">
                    <canvas id="weatherChart" width="180" height="120"></canvas>
                </div>
            </div>
        </div>
    `;
}

// Render census data
function renderCensusData(data) {
    if (!data) return;
    if (data.unavailable) {
        setUnavailableState('censusData', `Census & Population - ${data.city}`, data.unavailable_reason);
        return;
    }
    const datasetHtml = data.datasets.map((dataset) => `
        <li>
            <strong>${escapeHtml(dataset.title)}</strong><br>
            <small>${escapeHtml(dataset.organization)} • Updated: ${escapeHtml(dataset.updated)}</small><br>
            <a href="${toSafeUrl(dataset.url)}" target="_blank" rel="noopener noreferrer">Open dataset</a>
        </li>
    `).join('');
    const sourceLinks = data.source_urls.map((url) => `<li><a href="${toSafeUrl(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a></li>`).join('');
    document.getElementById('censusData').innerHTML = `
        <div class="card">
            <h2>Census & Population - ${escapeHtml(data.city)}</h2>
            <div class="data-content">
                <p><strong>Province:</strong> ${escapeHtml(data.province)}</p>
                <p><strong>Region:</strong> ${escapeHtml(data.region)}</p>
                <p><strong>CKAN Search Endpoint:</strong> <a href="${toSafeUrl(data.source_query_url)}" target="_blank" rel="noopener noreferrer">View query</a></p>
                <p><strong>Datasets Found:</strong> ${data.datasets.length}</p>
                <ul>${datasetHtml || '<li>No dataset entries returned.</li>'}</ul>
                <p><strong>Exact public sources:</strong></p>
                <ul>${sourceLinks}</ul>
            </div>
        </div>
    `;
}

// Render economic data
function renderEconomicData(data) {
    if (!data) return;
    document.getElementById('economicData').innerHTML = `
        <div class="card">
            <h2>Economic Indicators</h2>
            <div class="data-content">
                <p><strong>GDP per Capita:</strong> ₱${data.gdp_per_capita.toLocaleString()}</p>
                <p><strong>Employment Rate:</strong> ${data.employment_rate}%</p>
                <p><strong>Median Monthly Income:</strong> ₱${data.median_income.toLocaleString()}</p>
                <p><strong>Poverty Incidence:</strong> ${data.poverty_incidence}%</p>
                <p><strong>Major Industries:</strong> ${data.major_industries.join(', ')}</p>
            </div>
        </div>
    `;
}

// Render traffic data
function renderTrafficData(data) {
    if (!data) return;
    if (data.unavailable) {
        setUnavailableState('trafficData', `Traffic Status - ${data.city}`, data.unavailable_reason);
        return;
    }
    const datasetHtml = data.datasets.map((dataset) => `
        <li>
            <strong>${escapeHtml(dataset.title)}</strong><br>
            <small>${escapeHtml(dataset.organization)} • Updated: ${escapeHtml(dataset.updated)}</small><br>
            <a href="${toSafeUrl(dataset.url)}" target="_blank" rel="noopener noreferrer">Open dataset</a>
        </li>
    `).join('');
    const sourceLinks = data.source_urls.map((url) => `<li><a href="${toSafeUrl(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a></li>`).join('');
    document.getElementById('trafficData').innerHTML = `
        <div class="card">
            <h2>Traffic Status - ${escapeHtml(data.city)}</h2>
            <div class="data-content">
                <p><strong>Last Updated:</strong> ${data.last_updated}</p>
                <p><strong>CKAN Search Endpoint:</strong> <a href="${toSafeUrl(data.source_query_url)}" target="_blank" rel="noopener noreferrer">View query</a></p>
                <p><strong>Datasets Found:</strong> ${data.datasets.length}</p>
                <ul>${datasetHtml || '<li>No dataset entries returned.</li>'}</ul>
                <p><strong>Exact public sources:</strong></p>
                <ul>${sourceLinks}</ul>
            </div>
        </div>
    `;
}

// Render social data
function renderSocialData(data) {
    if (!data) return;
    const currentFacebookPageUrl = toSafeFacebookPageUrl(data.page_url || SJDM_FACEBOOK_PAGE_URL);
    document.getElementById('socialData').innerHTML = `
        <div class="card">
            <h2>Official LGU Facebook - ${escapeHtml(data.city)}</h2>
            <div class="data-content social-embed-wrap">
                <p><strong>Page URL:</strong> <a href="${toSafeUrl(data.page_url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(data.page_url)}</a></p>
                <div id="fb-root"></div>
                <div
                    class="fb-page"
                    data-href="${currentFacebookPageUrl}"
                    data-tabs="timeline"
                    data-width="500"
                    data-height="700"
                    data-small-header="false"
                    data-adapt-container-width="true"
                    data-hide-cover="false"
                    data-show-facepile="true">
                    <blockquote cite="${currentFacebookPageUrl}" class="fb-xfbml-parse-ignore">
                        <a href="${currentFacebookPageUrl}">${escapeHtml(currentFacebookPageUrl)}</a>
                    </blockquote>
                </div>
            </div>
        </div>
    `;
    updateFacebookPageForCity(data.city);
}

function updateFacebookPageForCity(city) {
    const fbPage = document.querySelector('.fb-page');
    if (!fbPage) {
        console.warn('Facebook page element not found for city switch:', safeLogValue(city));
        return;
    }
    const cityConfig = getCityConfig(city);
    const facebookPageUrl = toSafeFacebookPageUrl(cityConfig.facebookPageUrl);
    fbPage.setAttribute('data-href', facebookPageUrl);
    const blockquote = fbPage.querySelector('blockquote');
    const anchorElement = blockquote ? blockquote.querySelector('a') : null;
    if (blockquote) blockquote.setAttribute('cite', facebookPageUrl);
    if (anchorElement) {
        anchorElement.setAttribute('href', facebookPageUrl);
        anchorElement.textContent = facebookPageUrl;
    }
    if (typeof FB !== 'undefined' && FB.XFBML && typeof FB.XFBML.parse === 'function') {
        FB.XFBML.parse();
    }
}

// Render health data
function renderHealthData(data) {
    if (!data) return;
    if (data.unavailable) {
        setUnavailableState('healthData', `Health Services - ${data.city}`, data.unavailable_reason);
        return;
    }
    const datasetHtml = data.datasets.map((dataset) => `
        <li>
            <strong>${escapeHtml(dataset.title)}</strong><br>
            <small>${escapeHtml(dataset.organization)} • Updated: ${escapeHtml(dataset.updated)}</small><br>
            <a href="${toSafeUrl(dataset.url)}" target="_blank" rel="noopener noreferrer">Open dataset</a>
        </li>
    `).join('');
    const sourceLinks = data.source_urls.map((url) => `<li><a href="${toSafeUrl(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a></li>`).join('');
    document.getElementById('healthData').innerHTML = `
        <div class="card health-card">
            <h2>Health Services - ${escapeHtml(data.city)}</h2>
            <div class="data-content">
                <p><strong>CKAN Search Endpoint:</strong> <a href="${toSafeUrl(data.source_query_url)}" target="_blank" rel="noopener noreferrer">View query</a></p>
                <p><strong>Datasets Found:</strong> ${data.datasets.length}</p>
                <ul>${datasetHtml || '<li>No dataset entries returned.</li>'}</ul>
                <p><strong>Exact public sources:</strong></p>
                <ul>${sourceLinks}</ul>
            </div>
        </div>
    `;
}

// Render education data
function renderEducationData(data) {
    if (!data) return;
    if (data.unavailable) {
        setUnavailableState('educationData', `Education Statistics - ${data.city}`, data.unavailable_reason);
        return;
    }
    const datasetHtml = data.datasets.map((dataset) => `
        <li>
            <strong>${escapeHtml(dataset.title)}</strong><br>
            <small>${escapeHtml(dataset.organization)} • Updated: ${escapeHtml(dataset.updated)}</small><br>
            <a href="${toSafeUrl(dataset.url)}" target="_blank" rel="noopener noreferrer">Open dataset</a>
        </li>
    `).join('');
    const sourceLinks = data.source_urls.map((url) => `<li><a href="${toSafeUrl(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a></li>`).join('');
    document.getElementById('educationData').innerHTML = `
        <div class="card education-card">
            <h2>Education Statistics - ${escapeHtml(data.city)}</h2>
            <div class="data-content">
                <p><strong>CKAN Search Endpoint:</strong> <a href="${toSafeUrl(data.source_query_url)}" target="_blank" rel="noopener noreferrer">View query</a></p>
                <p><strong>Datasets Found:</strong> ${data.datasets.length}</p>
                <ul>${datasetHtml || '<li>No dataset entries returned.</li>'}</ul>
                <p><strong>Exact public sources:</strong></p>
                <ul>${sourceLinks}</ul>
            </div>
        </div>
    `;
}

// Render safety data
function renderSafetyData(data) {
    if (!data) return;
    if (data.unavailable) {
        setUnavailableState('safetyData', `Public Safety - ${data.city}`, data.unavailable_reason);
        return;
    }
    const datasetHtml = data.datasets.map((dataset) => `
        <li>
            <strong>${escapeHtml(dataset.title)}</strong><br>
            <small>${escapeHtml(dataset.organization)} • Updated: ${escapeHtml(dataset.updated)}</small><br>
            <a href="${toSafeUrl(dataset.url)}" target="_blank" rel="noopener noreferrer">Open dataset</a>
        </li>
    `).join('');
    const sourceLinks = data.source_urls.map((url) => `<li><a href="${toSafeUrl(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a></li>`).join('');
    document.getElementById('safetyData').innerHTML = `
        <div class="card safety-card">
            <h2>Public Safety - ${escapeHtml(data.city)}</h2>
            <div class="data-content">
                <p><strong>CKAN Search Endpoint:</strong> <a href="${toSafeUrl(data.source_query_url)}" target="_blank" rel="noopener noreferrer">View query</a></p>
                <p><strong>Datasets Found:</strong> ${data.datasets.length}</p>
                <ul>${datasetHtml || '<li>No dataset entries returned.</li>'}</ul>
                <p><strong>Exact public sources:</strong></p>
                <ul>${sourceLinks}</ul>
            </div>
        </div>
    `;
}

// Render environment data
function renderEnvironmentData(data) {
    if (!data) return;
    document.getElementById('environmentData').innerHTML = `
        <div class="card environment-card">
            <h2>Environment & Sustainability</h2>
            <div class="data-content">
                <p><strong>Air Quality Index:</strong> ${data.air_quality_index}</p>
                <p><strong>Water Quality:</strong> ${data.water_quality_rating}</p>
                <p><strong>Green Space per Capita:</strong> ${data.green_space_per_capita}</p>
                <p><strong>Parks and Recreation:</strong> ${data.parks_and_recreation}</p>
                <p><strong>Waste Diversion Rate:</strong> ${data.waste_diversion_rate}%</p>
                <p><strong>Recycling Rate:</strong> ${data.recycling_rate}%</p>
                <p><strong>Tree Cover Percentage:</strong> ${data.tree_cover_percentage}%</p>
                <p><strong>Renewable Energy Usage:</strong> ${data.renewable_energy_usage}%</p>
                <p><strong>Flood Prone Areas:</strong> ${data.flood_prone_areas}%</p>
                <p><strong>Environmental Programs:</strong> ${data.environmental_programs.join(', ')}</p>
            </div>
        </div>
    `;
}

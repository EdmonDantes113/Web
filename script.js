// City Data Dashboard - Main JavaScript Functionality.

// API Configuration (using mock data and public APIs where possible)
const API_CONFIG = {
    // OpenWeatherMap v3 (latest, requires API key)
    weather: {
        url: 'https://api.openweathermap.org/data/3.0/onecall', // v3 endpoint
        // Note: You need a real API key for production
        params: (lat, lon, key) => new URLSearchParams({
            lat: lat,
            lon: lon,
            units: 'metric',
            appid: key
        })
    },
    // Philippine Statistics Authority (PSA) - no public API, fallback to mock
    census: {
        url: 'https://psa.gov.ph/population-census', // No API, fallback to mock
    },
    // World Bank v2 (latest stable)
    economic: {
        url: 'https://api.worldbank.org/v2/country/PHL/indicator/NY.GDP.MKTP.CD?format=json'
    },
    // MMDA Traffic API (no public API, fallback to mock)
    traffic: {
        url: 'https://mmda.gov.ph/traffic-api' // No public API, fallback to mock
    },
    // Facebook Graph API v19+ (requires access token, fallback to mock)
    social: {
        url: 'https://graph.facebook.com/v19.0/{page-id}/posts' // Needs token, fallback to mock
    },
    // DOH DataDrop/WHO (no public API, fallback to mock)
    health: {
        url: 'https://data.gov.ph/dataset/health-facilities' // No API, fallback to mock
    },
    // DepEd/CHED (no public API, fallback to mock)
    education: {
        url: 'https://data.gov.ph/dataset/education-statistics' // No API, fallback to mock
    },
    // PNP (no public API, fallback to mock)
    safety: {
        url: 'https://data.gov.ph/dataset/crime-statistics' // No API, fallback to mock
    },
    // DENR (no public API, fallback to mock)
    environment: {
        url: 'https://data.gov.ph/dataset/environmental-data' // No API, fallback to mock
    }
};

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

// Fetch weather data
async function fetchWeatherData(city) {
    try {
        showLoading('weatherData');

        // For demo purposes, using mock data since we don't have API key
        // In real implementation, uncomment the fetch below and use real API
        /*
        const response = await fetch(`${API_CONFIG.weather.url}?${API_CONFIG.weather.params}&q=${city}`);
        if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
        const data = await response.json();
        return data;
        */

        // Mock weather data for San Jose Del Monte
        return {
            name: "San Jose Del Monte",
            sys: { country: "PH" },
            main: {
                temp: 28.5,
                feels_like: 31.2,
                humidity: 78,
                pressure: 1013
            },
            weather: [{ main: "Cloudy", description: "partly cloudy", icon: "02d" }],
            wind: { speed: 3.5 },
            dt: Date.now()
        };
    } catch (error) {
        showError('weatherData', 'Failed to load weather data');
        console.error('Weather fetch error:', error);
        return null;
    }
}

// Fetch census/population data
async function fetchCensusData() {
    try {
        showLoading('censusData');

        // Mock census data for San Jose Del Monte
        // In real implementation, you'd use Philippine Statistics Authority API or similar
        return {
            city: "San Jose Del Monte",
            province: "Bulacan",
            region: "Central Luzon (Region III)",
            population: 651889, // Approximate 2020 census
            density: 2900, // per sq km
            growth_rate: 2.8, // annual %
            households: 145000,
            average_family_size: 4.5
        };
    } catch (error) {
        showError('censusData', 'Failed to load census data');
        console.error('Census fetch error:', error);
        return null;
    }
}

// Fetch economic data
async function fetchEconomicData() {
    try {
        showLoading('economicData');

        // Mock economic data
        // In real implementation, you might use World Bank API, PSA API, etc.
        return {
            city: "San Jose Del Monte",
            gdp_per_capita: 185000, // PHP
            employment_rate: 94.2, // %
            major_industries: [
                "Manufacturing",
                "Retail Trade",
                "Real Estate",
                "Tourism",
                "Agriculture"
            ],
            poverty_incidence: 8.5, // %
            median_income: 25000 // PHP monthly
        };
    } catch (error) {
        showError('economicData', 'Failed to load economic data');
        console.error('Economic fetch error:', error);
        return null;
    }
}

// Fetch traffic data
async function fetchTrafficData() {
    try {
        showLoading('trafficData');

        // Mock traffic data
        // In real implementation, you'd use MMDA API or similar
        return {
            city: "San Jose Del Monte",
            last_updated: new Date().toLocaleString(),
            traffic_conditions: {
                overall: "Moderate",
                congestion_level: "Medium",
                average_speed: "25 km/h"
            },
            major_routes: [
                { route: "Quirino Highway", status: "Flowing", delay: "5-10 min" },
                { route: "San Jose Del Monte Road", status: "Moderate", delay: "10-15 min" },
                { route: "Regalado Avenue", status: "Heavy", delay: "15-20 min" }
            ],
            incidents: [
                { location: "Near SM City SJDM", description: "Minor accident", time: "10:30 AM" },
                { location: "Tungkong Mangga", description: "Road work", time: "Ongoing" }
            ]
        };
    } catch (error) {
        showError('trafficData', 'Failed to load traffic data');
        console.error('Traffic fetch error:', error);
        return null;
    }
}

// Fetch social media data (mock Facebook posts)
async function fetchSocialData() {
    try {
        showLoading('socialData');

        // Mock social media data
        // In real implementation, you'd use Facebook Graph API (requires authentication)
        // or scrape public pages (with permission and respecting terms)
        return {
            page: "San Jose Del Monte City Government",
            posts: [
                {
                    id: 1,
                    message: "Reminder: Barangay Assembly today at 7 PM in all barangays. Your participation is important for community development.",
                    time: "2 hours ago",
                    reactions: 124,
                    comments: 18
                },
                {
                    id: 2,
                    message: "Free medical mission this weekend at SJDM Sports Complex. Services include consultation, dental check-up, and basic lab tests.",
                    time: "5 hours ago",
                    reactions: 89,
                    comments: 32
                },
                {
                    id: 3,
                    message: "Congratulations to our local athletes who won medals in the recent Regional Sports Festival!",
                    time: "1 day ago",
                    reactions: 156,
                    comments: 24
                }
            ]
        };
    } catch (error) {
        showError('socialData', 'Failed to load social media data');
        console.error('Social fetch error:', error);
        return null;
    }
}

// Fetch health services data
async function fetchHealthData() {
    try {
        showLoading('healthData');

        // Mock health data for San Jose Del Monte
        // In real implementation, you'd use DOH API or local health office data
        return {
            city: "San Jose Del Monte",
            hospitals: 8,
            health_centers: 24,
            barangay_health_stations: 45,
            doctors_per_1000: 1.8,
            nurses_per_1000: 4.2,
            hospital_beds_per_1000: 1.2,
            vaccination_rate: 87.5, // %
            maternal_mortality_rate: 45, // per 100,000 live births
            infant_mortality_rate: 12, // per 1,000 live births
            philhealth_coverage: 78.3 // %
        };
    } catch (error) {
        showError('healthData', 'Failed to load health data');
        console.error('Health fetch error:', error);
        return null;
    }
}

// Fetch education data
async function fetchEducationData() {
    try {
        showLoading('educationData');

        // Mock education data for San Jose Del Monte
        // In real implementation, you'd use DepEd or CHED API
        return {
            city: "San Jose Del Monte",
            public_schools: {
                elementary: 32,
                high_school: 18,
                senior_high: 12
            },
            private_schools: {
                elementary: 45,
                high_school: 28,
                senior_high: 15,
                colleges: 8
            },
            total_enrollment: 185000,
            literacy_rate: 96.8, // %
            teacher_student_ratio: "1:35",
            graduation_rate: 89.2, // %
            schools_with_internet: 78.5 // %
        };
    } catch (error) {
        showError('educationData', 'Failed to load education data');
        console.error('Education fetch error:', error);
        return null;
    }
}

// Fetch public safety data
async function fetchSafetyData() {
    try {
        showLoading('safetyData');

        // Mock safety data for San Jose Del Monte
        // In real implementation, you'd use PNP or local police data
        return {
            city: "San Jose Del Monte",
            crime_rate: 125.4, // per 100,000 population
            crime_solve_rate: 78.6, // %
            police_stations: 6,
            fire_stations: 4,
            police_personnel: 185,
            fire_personnel: 42,
            average_response_time: "8.5 minutes",
            major_crimes: [
                { type: "Theft", count: 420, trend: "-5.2%" },
                { type: "Robbery", count: 89, trend: "-12.3%" },
                { type: "Physical Injury", count: 156, trend: "+2.1%" },
                { type: "Drug-related", count: 67, trend: "-18.7%" }
            ],
            traffic_accidents: {
                total: 1240,
                fatalities: 18,
                injuries: 342
            }
        };
    } catch (error) {
        showError('safetyData', 'Failed to load safety data');
        console.error('Safety fetch error:', error);
        return null;
    }
}

// Fetch environment data
async function fetchEnvironmentData() {
    try {
        showLoading('environmentData');

        // Mock environment data for San Jose Del Monte
        // In real implementation, you'd use DENR or local environment office data
        return {
            city: "San Jose Del Monte",
            air_quality_index: 45, // Good
            water_quality_rating: "Good",
            green_space_per_capita: 12.5, // sq m per person
            parks_and_recreation: 24,
            waste_diversion_rate: 68.3, // %
            recycling_rate: 42.1, // %
            tree_cover_percentage: 18.7, // %
            renewable_energy_usage: 15.8, // %
            flood_prone_areas: 12.4, // % of city area
            environmental_programs: [
                "Urban Greening Program",
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
        const data = tab.btn === 'weather' ? await tab.loader(currentCity) : await tab.loader();
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
        // Update last updated timestamp
        updateLastUpdated();

        // Fetch all data concurrently
        const [weatherData, censusData, economicData, trafficData, socialData, healthData, educationData, safetyData, environmentData] = await Promise.all([
            fetchWeatherData(city),
            fetchCensusData(),
            fetchEconomicData(),
            fetchTrafficData(),
            fetchSocialData(),
            fetchHealthData(),
            fetchEducationData(),
            fetchSafetyData(),
            fetchEnvironmentData()
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
                    <p><strong>Temperature:</strong> ${data.main.temp}°C (feels like ${data.main.feels_like}°C)</p>
                    <p><strong>Condition:</strong> ${data.weather[0].description}</p>
                    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                    <p><strong>Pressure:</strong> ${data.main.pressure} hPa</p>
                    <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
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
    // Visual: population icon (SVG) and pie chart for household/family size
    setTimeout(() => {
        if (document.getElementById('censusChart')) {
            const ctx = document.getElementById('censusChart').getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Households', 'Avg Family Size'],
                    datasets: [{
                        data: [data.households, data.average_family_size * data.households],
                        backgroundColor: ['#FF6B9D', '#FF9F1C']
                    }]
                },
                options: { plugins: { legend: { position: 'bottom' } } }
            });
        }
    }, 100);
    document.getElementById('censusData').innerHTML = `
        <div class="card">
            <h2>Census for ${data.city}, ${data.province} <span style='font-size:1.2em;'>👨‍👩‍👧‍👦</span></h2>
            <div class="data-content" style="display:flex;align-items:center;gap:2rem;flex-wrap:wrap;">
                <div style="flex:1;min-width:180px;">
                    <p><strong>Region:</strong> ${data.region}</p>
                    <p><strong>Population:</strong> ${data.population.toLocaleString()} people</p>
                    <p><strong>Population Density:</strong> ${data.density.toLocaleString()} per km²</p>
                    <p><strong>Annual Growth Rate:</strong> ${data.growth_rate}%</p>
                </div>
                <div style="flex:1;min-width:180px;">
                    <canvas id="censusChart" width="180" height="120"></canvas>
                </div>
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
    document.getElementById('trafficData').innerHTML = `
        <div class="card">
            <h2>Traffic Status</h2>
            <div class="data-content">
                <p><strong>Last Updated:</strong> ${data.last_updated}</p>
                <p><strong>Overall:</strong> ${data.traffic_conditions.overall}</p>
                <p><strong>Congestion Level:</strong> ${data.traffic_conditions.congestion_level}</p>
                <p><strong>Average Speed:</strong> ${data.traffic_conditions.average_speed}</p>
            </div>
        </div>
    `;
}

// Render social data
// Social Media: Add/Remove Post Logic
let socialPosts = null;

function renderSocialData(data) {
    if (!data) return;
    // Use a local copy for add/remove
    if (!socialPosts) socialPosts = [...data.posts];
    const socialDataDiv = document.getElementById('socialData');
    let html = `<button id="addPostBtn" style="margin-bottom:1rem;" class="tab-btn">Add Post</button>`;
    html += `<div class="dashboard-grid">`;
    if (socialPosts.length === 0) {
        html += `<div class="card"><div class="data-content"><em>No posts available.</em></div></div>`;
    } else {
        socialPosts.forEach((post, idx) => {
            html += `
                <div class="card">
                    <h2>Post #${post.id}</h2>
                    <div class="data-content">
                        <p>${post.message}</p>
                        <small>${post.time} | 👍 ${post.reactions} | 💬 ${post.comments}</small><br>
                        <button class="tab-btn" style="margin-top:0.75rem;background:#e74c3c;color:#fff;" data-remove-idx="${idx}">Remove</button>
                    </div>
                </div>
            `;
        });
    }
    html += `</div>`;
    socialDataDiv.innerHTML = html;

    // Add Post event
    document.getElementById('addPostBtn').onclick = function() {
        const newId = socialPosts.length > 0 ? Math.max(...socialPosts.map(p => p.id)) + 1 : 1;
        socialPosts.unshift({
            id: newId,
            message: "[New Post] Enter your message here.",
            time: "just now",
            reactions: 0,
            comments: 0
        });
        renderSocialData({posts: socialPosts});
    };
    // Remove Post events
    document.querySelectorAll('[data-remove-idx]').forEach(btn => {
        btn.onclick = function() {
            const idx = parseInt(btn.getAttribute('data-remove-idx'));
            socialPosts.splice(idx, 1);
            renderSocialData({posts: socialPosts});
        };
    });
}

// Render health data
function renderHealthData(data) {
    if (!data) return;
    document.getElementById('healthData').innerHTML = `
        <div class="card health-card">
            <h2>Health Services</h2>
            <div class="data-content">
                <p><strong>Hospitals:</strong> ${data.hospitals}</p>
                <p><strong>Health Centers:</strong> ${data.health_centers}</p>
                <p><strong>Barangay Health Stations:</strong> ${data.barangay_health_stations}</p>
                <p><strong>Doctors per 1000:</strong> ${data.doctors_per_1000}</p>
                <p><strong>Nurses per 1000:</strong> ${data.nurses_per_1000}</p>
                <p><strong>Hospital Beds per 1000:</strong> ${data.hospital_beds_per_1000}</p>
                <p><strong>Vaccination Rate:</strong> ${data.vaccination_rate}%</p>
                <p><strong>PhilHealth Coverage:</strong> ${data.philhealth_coverage}%</p>
            </div>
        </div>
    `;
}

// Render education data
function renderEducationData(data) {
    if (!data) return;
    document.getElementById('educationData').innerHTML = `
        <div class="card education-card">
            <h2>Education Statistics</h2>
            <div class="data-content">
                <p><strong>Public Elementary:</strong> ${data.public_schools.elementary}</p>
                <p><strong>Public High School:</strong> ${data.public_schools.high_school}</p>
                <p><strong>Private Elementary:</strong> ${data.private_schools.elementary}</p>
                <p><strong>Private High School:</strong> ${data.private_schools.high_school}</p>
                <p><strong>Colleges:</strong> ${data.private_schools.colleges}</p>
                <p><strong>Total Enrollment:</strong> ${data.total_enrollment}</p>
                <p><strong>Literacy Rate:</strong> ${data.literacy_rate}%</p>
                <p><strong>Graduation Rate:</strong> ${data.graduation_rate}%</p>
            </div>
        </div>
    `;
}

// Render safety data
function renderSafetyData(data) {
    if (!data) return;
    document.getElementById('safetyData').innerHTML = `
        <div class="card safety-card">
            <h2>Public Safety</h2>
            <div class="data-content">
                <p><strong>Crime Rate:</strong> ${data.crime_rate}</p>
                <p><strong>Crime Solve Rate:</strong> ${data.crime_solve_rate}%</p>
                <p><strong>Police Stations:</strong> ${data.police_stations}</p>
                <p><strong>Fire Stations:</strong> ${data.fire_stations}</p>
                <p><strong>Police Personnel:</strong> ${data.police_personnel}</p>
                <p><strong>Fire Personnel:</strong> ${data.fire_personnel}</p>
                <p><strong>Average Response Time:</strong> ${data.average_response_time}</p>
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
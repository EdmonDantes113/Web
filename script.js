// City Data Dashboard - Main JavaScript Functionality

// API Configuration (using mock data and public APIs where possible)
const API_CONFIG = {
    // OpenWeatherMap would require API key - using mock for demo
    weather: {
        url: 'https://api.openweathermap.org/data/2.5/weather',
        params: new URLSearchParams({
            q: 'San Jose Del Monte,PH',
            units: 'metric',
            appid: 'demo_key' // In real app, you'd get a real key
        })
    },
    // Using Philippine Statistics API or similar for census data
    census: {
        url: 'https://psa.gov.ph/api/v1/population', // Example endpoint
    },
    // Economic indicators - using World Bank or similar
    economic: {
        url: 'https://api.worldbank.org/v2/country/PHL/indicator/NY.GDP.MKTP.CD?format=json'
    },
    // Traffic data - using MMDA or similar (mock)
    traffic: {
        url: 'https://mmda.gov.ph/api/traffic' // Example
    },
    // Social media - using public Facebook page RSS or mock
    social: {
        url: 'https://www.facebook.com/pg/sanjosedelmontecity/posts/' // Would need scraping or API
    },
    // Health services - using DOH or local health office data (mock)
    health: {
        url: 'https://doh.gov.ph/api/health-facilities' // Example
    },
    // Education - using DepEd or CHED data (mock)
    education: {
        url: 'https://deped.gov.ph/api/education-statistics' // Example
    },
    // Public safety - using PNP or local police data (mock)
    safety: {
        url: 'https://pnp.gov.ph/api/crime-statistics' // Example
    },
    // Environment - using DENR or local environment office data (mock)
    environment: {
        url: 'https://denr.gov.ph/api/environmental-data' // Example
    }
};

/**
 * Utility function to create and return a new DOM element.
 * 
 * @param {string} tag - The HTML tag name of the element to create.
 * @param {string} [className] - Optional CSS class name(s) to assign to the element.
 * @param {string} [textContent] - Optional text content to set inside the element.
 * @returns {HTMLElement} The created DOM element.
 */
function createElement(tag, className, textContent) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
}

/**
 * Displays a loading state in the specified DOM element.
 * 
 * @param {string} elementId - The ID of the HTML element where the loading message will be shown.
 */
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) element.innerHTML = '<p class="loading">Loading data...</p>';
}

/**
 * Displays an error message in the specified DOM element.
 * 
 * @param {string} elementId - The ID of the HTML element where the error message will be shown.
 * @param {string} message - The error message to display.
 */
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) element.innerHTML = `<p class="error">Error: ${message}</p>`;
}

/**
 * Injects successfully fetched or formatted HTML content into a specified DOM element.
 * 
 * @param {string} elementId - The ID of the HTML element to update.
 * @param {string} content - The HTML content to insert into the element.
 */
function showSuccess(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) element.innerHTML = content;
}

/**
 * Asynchronously fetches and returns weather data for a given city.
 * Currently uses mock data for demonstration purposes.
 * 
 * @param {string} city - The name of the city to fetch weather data for.
 * @returns {Promise<Object|null>} A promise that resolves to the weather data object, or null if it fails.
 */
async function fetchWeatherData(city) {
    try {
        showLoading('weatherData');

        // For demo purposes, using mock data since we don't have API key
        // In real implementation, uncomment the fetch below and use real API

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

/**
 * Asynchronously fetches census and demographic data.
 * Currently uses mock data representative of a city's census statistics.
 * 
 * @returns {Promise<Object|null>} A promise that resolves to the census data object, or null on error.
 */
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

/**
 * Asynchronously fetches economic indicators for the city.
 * Provides mock data for GDP, employment rate, major industries, etc.
 * 
 * @returns {Promise<Object|null>} A promise that resolves to the economic data object, or null on error.
 */
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
            median_income: 25000, // PHP monthly
            growth_rate: 2.8 // Added growth rate to support the graph move
        };
    } catch (error) {
        showError('economicData', 'Failed to load economic data');
        console.error('Economic fetch error:', error);
        return null;
    }
}

/**
 * Asynchronously fetches traffic conditions and incident reports.
 * Returns mock data regarding major routes and their current status.
 * 
 * @returns {Promise<Object|null>} A promise that resolves to the traffic data object, or null on error.
 */
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

/**
 * Asynchronously fetches recent social media updates or local government posts.
 * Provides mock facebook posts data.
 * 
 * @returns {Promise<Object|null>} A promise that resolves to the social media data object, or null on error.
 */
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

/**
 * Asynchronously fetches statistics and metrics related to local health services.
 * Uses mock data for hospitals, vaccination rates, mortality rates, etc.
 * 
 * @returns {Promise<Object|null>} A promise that resolves to the health data object, or null on error.
 */
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

/**
 * Asynchronously fetches educational statistics.
 * Provides mock data for schools count, enrollment numbers, literacy rates, etc.
 * 
 * @returns {Promise<Object|null>} A promise that resolves to the education data object, or null on error.
 */
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

/**
 * Asynchronously fetches public safety and crime statistics.
 * Includes mock data for crime rates, police and fire stations, major crimes, etc.
 * 
 * @returns {Promise<Object|null>} A promise that resolves to the safety data object, or null on error.
 */
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

/**
 * Asynchronously fetches environmental data and metrics.
 * Uses mock data for air and water quality, green spaces, waste management, etc.
 * 
 * @returns {Promise<Object|null>} A promise that resolves to the environment data object, or null on error.
 */
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

/**
 * Helper to generate a data card HTML string.
 */
function createCard(icon, label, value, highlight = false) {
    const valueClass = highlight ? 'card-value stat-highlight' : 'card-value';
    return `
        <div class="info-card">
            <div class="card-icon">${icon}</div>
            <div class="card-label">${label}</div>
            <div class="${valueClass}">${value}</div>
        </div>
    `;
}

function getWeatherIcon(iconCode) {
    const icons = {
        '01d': '☀️', '01n': '🌙',
        '02d': '⛅', '02n': '☁️',
        '03d': '☁️', '03n': '☁️',
        '04d': '☁️', '04n': '☁️',
        '09d': '🌧️', '09n': '🌧️',
        '10d': '🌦️', '10n': '🌧️',
        '11d': '⛈️', '11n': '⛈️',
        '13d': '❄️', '13n': '❄️',
        '50d': '🌫️', '50n': '🌫️',
    };
    return icons[iconCode] || '❔';
}

/**
 * Renders the weather data and visualizes a 5-day temperature forecast.
 * It builds an HTML template including an SVG graph and injects it into the DOM.
 * 
 * @param {Object} data - The weather data object to be rendered.
 */
function renderWeatherData(data) {
    if (!data) return;
    
    // Create mock forecast data for the next 5 days
    const forecastDays = [
        { day: 'Today', temp: data.main.temp, icon: data.weather[0].icon, desc: data.weather[0].description },
        { day: 'Tomorrow', temp: Math.round(data.main.temp + (Math.random() * 4 - 2)), icon: '03d', desc: 'Partly cloudy' },
        { day: 'Day 3', temp: Math.round(data.main.temp + (Math.random() * 6 - 3)), icon: '02d', desc: 'Mostly sunny' },
        { day: 'Day 4', temp: Math.round(data.main.temp + (Math.random() * 5 - 2.5)), icon: '09d', desc: 'Light rain' },
        { day: 'Day 5', temp: Math.round(data.main.temp + (Math.random() * 3 - 1.5)), icon: '01d', desc: 'Clear sky' }
    ];

    const weatherHTML = `
        <div class="weather-info">
            <div class="current-weather">
                <h3>Current Conditions in ${data.name}, ${data.sys.country}</h3>
                <div class="info-grid">
                    ${createCard('🌡️', 'Temperature', `${data.main.temp}°C (Feels like ${data.main.feels_like}°C)`)}
                    ${createCard('☁️', 'Condition', `${data.weather[0].main} - ${data.weather[0].description}`)}
                    ${createCard('💧', 'Humidity', `${data.main.humidity}%`)}
                    ${createCard('⏱️', 'Pressure', `${data.main.pressure} hPa`)}
                    ${createCard('💨', 'Wind Speed', `${data.wind.speed} m/s`)}
                </div>
            </div>
            
            <div class="forecast-title" style="margin-top: 2rem;">
                <h3>5-Day Forecast</h3>
            </div>
            
            <div class="forecast-container">
                ${forecastDays.map(day => `
                    <div class="forecast-day">
                        <div class="forecast-day-name">${day.day}</div>
                        <div class="forecast-icon">${getWeatherIcon(day.icon)}</div>
                        <div class="forecast-temp">${day.temp}°C</div>
                        <div class="forecast-desc">${day.desc}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    showSuccess('weatherData', weatherHTML);
}

/**
 * Renders demographic and census statistics into HTML and updates the DOM.
 * 
 * @param {Object} data - The census data object.
 */
function renderCensusData(data) {
    if (!data) return;

    const censusHTML = `
        <div class="census-info">
            <h3 style="margin-bottom: 1.5rem;">${data.city}, ${data.province} (${data.region})</h3>
            <div class="info-grid">
                ${createCard('👥', 'Population', `${data.population.toLocaleString()} people`)}
                ${createCard('🏙️', 'Population Density', `${data.density.toLocaleString()} per km²`)}
                ${createCard('📈', 'Annual Growth Rate', `${data.growth_rate}%`, true)}
                ${createCard('🏠', 'Number of Households', data.households.toLocaleString())}
                ${createCard('👨‍👩‍👧‍👦', 'Average Family Size', `${data.average_family_size} members`)}
            </div>
        </div>
    `;

    showSuccess('censusData', censusHTML);
}

/**
 * Renders economic indicators into HTML, including a customized graph for
 * employment and poverty metrics, and injects it into the DOM.
 * 
 * @param {Object} data - The economic data object.
 */
function renderEconomicData(data) {
    if (!data) return;

    const economicHTML = `
        <div class="economic-info">
            <h3 style="margin-bottom: 1.5rem;">Economic Overview for ${data.city}</h3>
            <div class="info-grid">
                ${createCard('💰', 'GDP per Capita', `₱${data.gdp_per_capita.toLocaleString()}`)}
                ${createCard('💼', 'Employment Rate', `${data.employment_rate}%`, true)}
                ${createCard('💵', 'Median Monthly Income', `₱${data.median_income.toLocaleString()}`)}
                ${createCard('📉', 'Poverty Incidence', `${data.poverty_incidence}%`, true)}
                ${createCard('🏭', 'Major Industries', data.major_industries.join(', '))}
            </div>

            <div style="margin-top: 3rem;">
                <!-- Economic Graph -->
                <div style="width: 100%; max-width: 600px; margin: 0 auto;">
                    <div class="graph-container" style="height: 100px;">
                        <div style="display: flex; height: 100%; align-items: flex-end; width: 100%; border-radius: 4px; overflow: hidden; gap: 4px;">
                            <div class="graph-bar" style="position: relative; width: ${data.employment_rate}%; height: 100%; background: #FF0000;" title="Employment: ${data.employment_rate}%"></div>
                            <div class="graph-bar" style="position: relative; width: ${100 - data.poverty_incidence}%; height: 100%; background: #FFA500;" title="Non-Poverty: ${100 - data.poverty_incidence}%"></div>
                            <div class="graph-bar" style="position: relative; width: ${data.poverty_incidence}%; height: 100%; background: #E0E0E0;" title="Poverty: ${data.poverty_incidence}%"></div>
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 0.5rem; font-size: 0.8rem; color: #666;">
                        <span style="color: #FF0000;">🟥 Employment</span> | <span style="color: #FFA500;">🟧 Non-Poverty</span> | <span style="color: #E0E0E0;">⬜ Poverty Rate</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    showSuccess('economicData', economicHTML);
}

/**
 * Builds HTML showing current traffic conditions, routes status, and recent incidents,
 * then inserts the result into the corresponding DOM element.
 * 
 * @param {Object} data - The traffic data object.
 */
function renderTrafficData(data) {
    if (!data) return;

    const trafficHTML = `
        <div class="traffic-info">
            <h3 style="margin-bottom: 1.5rem;">Traffic Conditions in ${data.city} (Updated: ${data.last_updated})</h3>
            <div class="info-grid">
                ${createCard('🚗', 'Overall Conditions', data.traffic_conditions.overall)}
                ${createCard('🚦', 'Congestion Level', data.traffic_conditions.congestion_level)}
                ${createCard('⏱️', 'Average Speed', data.traffic_conditions.average_speed)}
            </div>
            
            <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Major Routes:</h3>
            <div class="info-grid">
                ${data.major_routes.map(route => createCard('🛣️', route.route, `${route.status} (${route.delay})`)).join('')}
            </div>
            
            <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Current Incidents:</h3>
            <div class="info-grid">
                ${data.incidents.map(incident => createCard('⚠️', incident.location, `${incident.description} (${incident.time})`)).join('')}
            </div>
        </div>
    `;

    showSuccess('trafficData', trafficHTML);
}

/**
 * Generates an HTML view for the social media data, displaying the most recent
 * posts and their statistics, and places it in the DOM.
 * 
 * @param {Object} data - The social media data object.
 */
function renderSocialData(data) {
    if (!data) return;

    const socialHTML = `
        <div class="social-info">
            <h3 style="margin-bottom: 1.5rem;">Official Updates from ${data.page}</h3>
            <div class="info-grid" style="grid-template-columns: 1fr;">
                ${data.posts.map(post => `
                    <div class="social-post">
                        <h3>Post ${post.id}</h3>
                        <p>${post.message}</p>
                        <div class="post-meta">
                            <span>⏰ ${post.time}</span>
                            <span style="margin-left: 1rem;">👍 ${post.reactions} reactions</span>
                            <span style="margin-left: 1rem;">💬 ${post.comments} comments</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    showSuccess('socialData', socialHTML);
}

/**
 * Formats health and medical statistics as HTML and renders it to the screen.
 * 
 * @param {Object} data - The health data object.
 */
function renderHealthData(data) {
    if (!data) return;

    const healthHTML = `
        <div class="health-info">
            <h3 style="margin-bottom: 1.5rem;">Health Services in ${data.city}</h3>
            <div class="info-grid">
                ${createCard('🏥', 'Hospitals', data.hospitals)}
                ${createCard('⚕️', 'Health Centers', data.health_centers)}
                ${createCard('🩺', 'Barangay Health Stations', data.barangay_health_stations)}
                ${createCard('👩‍⚕️', 'Doctors per 1000 people', data.doctors_per_1000)}
                ${createCard('💉', 'Nurses per 1000 people', data.nurses_per_1000)}
                ${createCard('🛏️', 'Hospital Beds per 1000 people', data.hospital_beds_per_1000)}
                ${createCard('🛡️', 'Vaccination Rate', `${data.vaccination_rate}%`)}
                ${createCard('📉', 'Maternal Mortality Rate', `${data.maternal_mortality_rate} per 100k`, true)}
                ${createCard('📉', 'Infant Mortality Rate', `${data.infant_mortality_rate} per 1k`, true)}
                ${createCard('💳', 'PhilHealth Coverage', `${data.philhealth_coverage}%`)}
            </div>
        </div>
    `;

    showSuccess('healthData', healthHTML);
}

/**
 * Prepares and renders the education statistics including school types and enrollment metrics.
 * 
 * @param {Object} data - The education data object.
 */
function renderEducationData(data) {
    if (!data) return;

    const educationHTML = `
        <div class="education-info">
            <h3 style="margin-bottom: 1.5rem;">Education Statistics for ${data.city}</h3>
            <div class="info-grid">
                ${createCard('🏫', 'Public Elementary Schools', data.public_schools.elementary)}
                ${createCard('🏫', 'Public High Schools', data.public_schools.high_school)}
                ${createCard('🏫', 'Public Senior High Schools', data.public_schools.senior_high)}
                ${createCard('🏢', 'Private Elementary Schools', data.private_schools.elementary)}
                ${createCard('🏢', 'Private High Schools', data.private_schools.high_school)}
                ${createCard('🏢', 'Private Senior High Schools', data.private_schools.senior_high)}
                ${createCard('🎓', 'Colleges', data.private_schools.colleges)}
                ${createCard('🎒', 'Total Enrollment', data.total_enrollment.toLocaleString())}
                ${createCard('📖', 'Literacy Rate', `${data.literacy_rate}%`)}
                ${createCard('👩‍🏫', 'Teacher-Student Ratio', data.teacher_student_ratio)}
                ${createCard('📜', 'Graduation Rate', `${data.graduation_rate}%`)}
                ${createCard('🌐', 'Schools with Internet', `${data.schools_with_internet}%`)}
            </div>
        </div>
    `;

    showSuccess('educationData', educationHTML);
}

/**
 * Shows the safety and security data by assembling its HTML markup and updating the DOM element.
 * 
 * @param {Object} data - The safety data object.
 */
function renderSafetyData(data) {
    if (!data) return;

    const safetyHTML = `
        <div class="safety-info">
            <h3 style="margin-bottom: 1.5rem;">Public Safety in ${data.city}</h3>
            <div class="info-grid">
                ${createCard('🚨', 'Crime Rate', `${data.crime_rate} per 100k`)}
                ${createCard('✅', 'Crime Solve Rate', `${data.crime_solve_rate}%`)}
                ${createCard('🚓', 'Police Stations', data.police_stations)}
                ${createCard('🚒', 'Fire Stations', data.fire_stations)}
                ${createCard('👮', 'Police Personnel', data.police_personnel)}
                ${createCard('👨‍🚒', 'Fire Personnel', data.fire_personnel)}
                ${createCard('⏱️', 'Average Response Time', data.average_response_time)}
            </div>
            
            <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Major Crimes:</h3>
            <div class="info-grid">
                ${data.major_crimes.map(crime => createCard('⚠️', crime.type, `${crime.count} cases (${crime.trend})`)).join('')}
            </div>
            
            <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Traffic Accidents:</h3>
            <div class="info-grid">
                ${createCard('💥', 'Total', data.traffic_accidents.total)}
                ${createCard('💀', 'Fatalities', data.traffic_accidents.fatalities)}
                ${createCard('🤕', 'Injuries', data.traffic_accidents.injuries)}
            </div>
        </div>
    `;

    showSuccess('safetyData', safetyHTML);
}

/**
 * Creates HTML from environmental metrics such as air quality and tree cover percentage,
 * and updates the corresponding panel in the DOM.
 * 
 * @param {Object} data - The environmental data object.
 */
function renderEnvironmentData(data) {
    if (!data) return;

    const environmentHTML = `
        <div class="environment-info">
            <h3 style="margin-bottom: 1.5rem;">Environmental Data for ${data.city}</h3>
            <div class="info-grid">
                ${createCard('🌬️', 'Air Quality Index', `${data.air_quality_index} (Good)`)}
                ${createCard('🚰', 'Water Quality Rating', data.water_quality_rating)}
                ${createCard('🌳', 'Green Space per Capita', `${data.green_space_per_capita} sq m`)}
                ${createCard('🏞️', 'Parks and Recreation Areas', data.parks_and_recreation)}
                ${createCard('♻️', 'Waste Diversion Rate', `${data.waste_diversion_rate}%`)}
                ${createCard('🔄', 'Recycling Rate', `${data.recycling_rate}%`)}
                ${createCard('🌲', 'Tree Cover Percentage', `${data.tree_cover_percentage}%`)}
                ${createCard('☀️', 'Renewable Energy Usage', `${data.renewable_energy_usage}%`)}
                ${createCard('🌊', 'Flood Prone Areas', `${data.flood_prone_areas}%`)}
            </div>
            
            <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Environmental Programs:</h3>
            <div class="info-grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));">
                ${data.environmental_programs.map(program => createCard('🌱', 'Program', program)).join('')}
            </div>
        </div>
    `;

    showSuccess('environmentData', environmentHTML);
}

/**
 * Updates the 'last updated' timestamp shown on the dashboard to the current local time.
 */
function updateLastUpdated() {
    const now = new Date();
    const lastUpdatedElement = document.getElementById('lastUpdated');
    if (lastUpdatedElement) {
        lastUpdatedElement.textContent = now.toLocaleString();
    }
}

/**
 * Coordinates fetching and rendering for all dashboard data components concurrently.
 * Re-displays all data panels showing latest updates for a given city.
 * 
 * @param {string} [city='San Jose Del Monte'] - The city name for which the dashboard is loaded.
 */
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

// Event listener for form submission is removed since the search form is removed

// Tab switching functionality, initial load, and auto-refresh
document.addEventListener('DOMContentLoaded', function() {
    // Set up tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Show corresponding tab pane
            const tabId = this.getAttribute('data-tab') + 'Tab';
            const tabPane = document.getElementById(tabId);
            if (tabPane) {
                tabPane.classList.add('active');
            }
        });
    });

    // Initial load on page load
    loadAllData();

    // Optional: Auto-refresh data every 5 minutes
    setInterval(() => {
        loadAllData();
    }, 5 * 60 * 1000); // 5 minutes
});
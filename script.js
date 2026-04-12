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
            median_income: 25000, // PHP monthly
            growth_rate: 2.8 // Added growth rate to support the graph move
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

// Render weather data
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

    // Find min and max temp to scale the graph properly
    const temps = forecastDays.map(d => d.temp);
    const minTemp = Math.min(...temps) - 2;
    const maxTemp = Math.max(...temps) + 2;
    const range = maxTemp - minTemp;

    // Generate points for the line chart SVG
    const width = 100; // Percentage
    // Increase height of graph to make it larger vertically
    const height = 300; 
    
    // Calculate coordinates for points
    const points = forecastDays.map((day, index) => {
        // Adjust x coordinate to stay well within bounds (10% to 90%)
        const x = 10 + (index / (forecastDays.length - 1)) * 80;
        const y = height - (((day.temp - minTemp) / range) * height);
        return { x, y, temp: day.temp, day: day.day };
    });

    const weatherHTML = `
        <div class="weather-info">
            <div class="current-weather">
                <h3>Current Conditions</h3>
                <p><strong>Location:</strong> ${data.name}, ${data.sys.country}</p>
                <p><strong>Temperature:</strong> ${data.main.temp}°C (feels like ${data.main.feels_like}°C)</p>
                <p><strong>Condition:</strong> ${data.weather[0].main} - ${data.weather[0].description}</p>
                <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                <p><strong>Pressure:</strong> ${data.main.pressure} hPa</p>
                <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
                <p><strong>Last Updated:</strong> ${new Date(data.dt * 1000).toLocaleTimeString()}</p>
            </div>
            
            <div class="forecast-title">
                <h3>5-Day Temperature Forecast</h3>
            </div>
            
            <div class="line-chart-container" style="width: 100%; max-width: 1200px; margin: 0 auto; padding: 20px 0;">
                <svg width="100%" height="400" viewBox="0 -20 100 400" preserveAspectRatio="none" style="overflow: visible;">
                    <!-- Grid lines for better readability -->
                    <line x1="10" y1="0" x2="90" y2="0" stroke="#e0e0e0" stroke-width="0.5" stroke-dasharray="2,2"/>
                    <line x1="10" y1="100" x2="90" y2="100" stroke="#e0e0e0" stroke-width="0.5" stroke-dasharray="2,2"/>
                    <line x1="10" y1="200" x2="90" y2="200" stroke="#e0e0e0" stroke-width="0.5" stroke-dasharray="2,2"/>
                    <line x1="10" y1="300" x2="90" y2="300" stroke="#e0e0e0" stroke-width="0.5" stroke-dasharray="2,2"/>
                    
                    <!-- Line -->
                    <polyline fill="none" stroke="var(--sjdm-pink)" stroke-width="2" points="${points.map(p => `${p.x},${p.y}`).join(' ')}"/>
                    
                    <!-- Points and Labels -->
                    ${points.map(p => `
                        <circle cx="${p.x}" cy="${p.y}" r="2" fill="var(--sjdm-orange)" stroke="white" stroke-width="1" />
                        <text x="${p.x}" y="${p.y - 10}" text-anchor="middle" font-size="10" fill="var(--sjdm-dark)" font-weight="bold">${p.temp}°C</text>
                        <text x="${p.x}" y="330" text-anchor="middle" font-size="10" fill="#666">${p.day}</text>
                    `).join('')}
                </svg>
            </div>
            
            <div style="text-align: center; margin-top: 1rem; color: #666; font-size: 0.9rem;">
                Temperature Trend (°C)
            </div>
        </div>
    `;
    
    showSuccess('weatherData', weatherHTML);
}

// Render census data
// Generates HTML for demographic data and removes the growth graph, then updates the DOM
function renderCensusData(data) {
    if (!data) return;

    const censusHTML = `
        <div class="census-info">
            <p><strong>City:</strong> ${data.city}, ${data.province}</p>
            <p><strong>Region:</strong> ${data.region}</p>
            <p><strong>Population:</strong> ${data.population.toLocaleString()} people</p>
            <p><strong>Population Density:</strong> ${data.density.toLocaleString()} per km²</p>
            <p><strong>Annual Growth Rate:</strong> <span class="stat-highlight">${data.growth_rate}%</span></p>
            <p><strong>Number of Households:</strong> ${data.households.toLocaleString()}</p>
            <p><strong>Average Family Size:</strong> ${data.average_family_size} members</p>
        </div>
    `;

    showSuccess('censusData', censusHTML);
}

// Render economic data
// Generates HTML for economic indicators and moves the graph here, then updates the DOM
function renderEconomicData(data) {
    if (!data) return;

    const economicHTML = `
        <div class="economic-info">
            <p><strong>City:</strong> ${data.city}</p>
            <p><strong>GDP per Capita:</strong> ₱${data.gdp_per_capita.toLocaleString()}</p>
            <p><strong>Employment Rate:</strong> <span class="stat-highlight">${data.employment_rate}%</span></p>
            <p><strong>Median Monthly Income:</strong> ₱${data.median_income.toLocaleString()}</p>
            <p><strong>Poverty Incidence:</strong> <span class="stat-highlight">${data.poverty_incidence}%</span></p>
            <p><strong>Major Industries:</strong></p>
            <ul>
                ${data.major_industries.map(industry => `<li>${industry}</li>`).join('')}
            </ul>

            <div style="margin-top: 2rem;">
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

// Render traffic data
function renderTrafficData(data) {
    if (!data) return;

    const trafficHTML = `
        <div class="traffic-info">
            <p><strong>City:</strong> ${data.city}</p>
            <p><strong>Last Updated:</strong> ${data.last_updated}</p>
            <p><strong>Overall Conditions:</strong> ${data.traffic_conditions.overall}</p>
            <p><strong>Congestion Level:</strong> ${data.traffic_conditions.congestion_level}</p>
            <p><strong>Average Speed:</strong> ${data.traffic_conditions.average_speed}</p>
            
            <h3>Major Routes:</h3>
            <ul>
                ${data.major_routes.map(route => 
                    `<li><strong>${route.route}:</strong> ${route.status} (${route.delay})</li>`
                ).join('')}
            </ul>
            
            <h3>Current Incidents:</h3>
            <ul>
                ${data.incidents.map(incident => 
                    `<li><strong>${incident.location}:</strong> ${incident.description} (${incident.time})</li>`
                ).join('')}
            </ul>
        </div>
    `;

    showSuccess('trafficData', trafficHTML);
}

// Render social media data
function renderSocialData(data) {
    if (!data) return;

    const socialHTML = `
        <div class="social-info">
            <p><strong>Page:</strong> ${data.page}</p>
            ${data.posts.map(post => `
                <div class="social-post">
                    <h3>Post ${post.id}</h3>
                    <p>${post.message}</p>
                    <div class="post-meta">
                        <span>⏰ ${post.time}</span>
                        <span>👍 ${post.reactions} reactions</span>
                        <span>💬 ${post.comments} comments</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    showSuccess('socialData', socialHTML);
}

// Render health data
function renderHealthData(data) {
    if (!data) return;

    const healthHTML = `
        <div class="health-info">
            <p><strong>City:</strong> ${data.city}</p>
            <p><strong>Hospitals:</strong> ${data.hospitals}</p>
            <p><strong>Health Centers:</strong> ${data.health_centers}</p>
            <p><strong>Barangay Health Stations:</strong> ${data.barangay_health_stations}</p>
            <p><strong>Doctors per 1000 people:</strong> ${data.doctors_per_1000}</p>
            <p><strong>Nurses per 1000 people:</strong> ${data.nurses_per_1000}</p>
            <p><strong>Hospital Beds per 1000 people:</strong> ${data.hospital_beds_per_1000}</p>
            <p><strong>Vaccination Rate:</strong> ${data.vaccination_rate}%</p>
            <p><strong>Maternal Mortality Rate:</strong> ${data.maternal_mortality_rate} per 100,000 live births</p>
            <p><strong>Infant Mortality Rate:</strong> ${data.infant_mortality_rate} per 1,000 live births</p>
            <p><strong>PhilHealth Coverage:</strong> ${data.philhealth_coverage}%</p>
        </div>
    `;

    showSuccess('healthData', healthHTML);
}

// Render education data
function renderEducationData(data) {
    if (!data) return;

    const educationHTML = `
        <div class="education-info">
            <p><strong>City:</strong> ${data.city}</p>
            <p><strong>Public Elementary Schools:</strong> ${data.public_schools.elementary}</p>
            <p><strong>Public High Schools:</strong> ${data.public_schools.high_school}</p>
            <p><strong>Public Senior High Schools:</strong> ${data.public_schools.senior_high}</p>
            <p><strong>Private Elementary Schools:</strong> ${data.private_schools.elementary}</p>
            <p><strong>Private High Schools:</strong> ${data.private_schools.high_school}</p>
            <p><strong>Private Senior High Schools:</strong> ${data.private_schools.senior_high}</p>
            <p><strong>Colleges:</strong> ${data.private_schools.colleges}</p>
            <p><strong>Total Enrollment:</strong> ${data.total_enrollment}</p>
            <p><strong>Literacy Rate:</strong> ${data.literacy_rate}%</p>
            <p><strong>Teacher-Student Ratio:</strong> ${data.teacher_student_ratio}</p>
            <p><strong>Graduation Rate:</strong> ${data.graduation_rate}%</p>
            <p><strong>Schools with Internet:</strong> ${data.schools_with_internet}%</p>
        </div>
    `;

    showSuccess('educationData', educationHTML);
}

// Render safety data
function renderSafetyData(data) {
    if (!data) return;

    const safetyHTML = `
        <div class="safety-info">
            <p><strong>City:</strong> ${data.city}</p>
            <p><strong>Crime Rate:</strong> ${data.crime_rate} per 100,000 population</p>
            <p><strong>Crime Solve Rate:</strong> ${data.crime_solve_rate}%</p>
            <p><strong>Police Stations:</strong> ${data.police_stations}</p>
            <p><strong>Fire Stations:</strong> ${data.fire_stations}</p>
            <p><strong>Police Personnel:</strong> ${data.police_personnel}</p>
            <p><strong>Fire Personnel:</strong> ${data.fire_personnel}</p>
            <p><strong>Average Response Time:</strong> ${data.average_response_time}</p>
            
            <h3>Major Crimes:</h3>
            <ul>
                ${data.major_crimes.map(crime => 
                    `<li><strong>${crime.type}:</strong> ${crime.count} cases (${crime.trend} trend)</li>`
                ).join('')}
            </ul>
            
            <h3>Traffic Accidents:</h3>
            <p><strong>Total:</strong> ${data.traffic_accidents.total}</p>
            <p><strong>Fatalities:</strong> ${data.traffic_accidents.fatalities}</p>
            <p><strong>Injuries:</strong> ${data.traffic_accidents.injuries}</p>
        </div>
    `;

    showSuccess('safetyData', safetyHTML);
}

// Render environment data
function renderEnvironmentData(data) {
    if (!data) return;

    const environmentHTML = `
        <div class="environment-info">
            <p><strong>City:</strong> ${data.city}</p>
            <p><strong>Air Quality Index:</strong> ${data.air_quality_index} (Good)</p>
            <p><strong>Water Quality Rating:</strong> ${data.water_quality_rating} (Good)</p>
            <p><strong>Green Space per Capita:</strong> ${data.green_space_per_capita} sq m per person</p>
            <p><strong>Parks and Recreation Areas:</strong> ${data.parks_and_recreation}</p>
            <p><strong>Waste Diversion Rate:</strong> ${data.waste_diversion_rate}%</p>
            <p><strong>Recycling Rate:</strong> ${data.recycling_rate}%</p>
            <p><strong>Tree Cover Percentage:</strong> ${data.tree_cover_percentage}%</p>
            <p><strong>Renewable Energy Usage:</strong> ${data.renewable_energy_usage}%</p>
            <p><strong>Flood Prone Areas:</strong> ${data.flood_prone_areas}% of city area</p>
            
            <h3>Environmental Programs:</h3>
            <ul>
                ${data.environmental_programs.map(program => `<li>${program}</li>`).join('')}
            </ul>
        </div>
    `;

    showSuccess('environmentData', environmentHTML);
}

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

// Event listener for form submission
document.getElementById('cityForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const cityInput = document.getElementById('cityInput').value.trim();
    if (cityInput) {
        loadAllData(cityInput);
    } else {
        alert('Please enter a city name');
    }
});

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
import dotenv from 'dotenv';
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Define a class for the Weather object
class Weather {
  cityName: string;
  date: string;
  weatherIcon: string;
  description: string;
  temperature: number;
  humidity: number;
  windSpeed: number;

  constructor(
    cityName: string,
    date: string,
    weatherIcon: string,
    description: string,
    temperature: number,
    humidity: number,
    windSpeed: number
  ) {
    this.cityName = cityName;
    this.date = date;
    this.weatherIcon = weatherIcon;
    this.description = description;
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
}

// Complete the WeatherService class
class WeatherService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5/forecast';
    this.apiKey = process.env.API_KEY || '';
  }

  // Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const geocodeUrl = this.buildGeocodeQuery(query);
    const response = await fetch(geocodeUrl);
    const data = await response.json();
    return this.destructureLocationData(data);
  }

  // Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData[0]; 
    return { lat, lon: lon };
  }

  // Create buildGeocodeQuery method
  private buildGeocodeQuery(query: string): string {
    return `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
  }

  // Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return `${this.baseURL}?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
  }

  // Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    return this.fetchLocationData(city);
  }

  // Create fetchWeatherData method
private async fetchWeatherData(coordinates: Coordinates) {
  const weatherUrl = this.buildWeatherQuery(coordinates);
  const response = await fetch(weatherUrl);
  if (!response.ok) {
    throw new Error(`Error fetching weather data: ${response.status} ${response.statusText}`);
  }
  
  const weatherData = await response.json();
  console.log('Weather API Response:', weatherData); // Log the response for debugging
  return weatherData;
}

  // Build parseCurrentWeather method
private parseCurrentWeather(response: any): Weather {
  if (!response || !response.list || response.list.length === 0) {
    throw new Error('No weather data available');
  }

  const currentData = response.list[0];
  return new Weather(
    response.city.name || 'Unknown City', 
    currentData.dt_txt || new Date().toISOString(), 
    currentData.weather[0]?.icon || '', 
    currentData.weather[0]?.description || 'No description available', 
    currentData.main.temp || 0, 
    currentData.main.humidity || 0, 
    currentData.wind.speed || 0 
  );
}


  // Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]): Weather[] {
    return weatherData.slice(0, 5).map((data: any) => new Weather(
      data.cityName, 
      data.dt_txt,
      data.weather[0].icon,
      data.weather[0].description,
      data.main.temp,
      data.main.humidity,
      data.wind.speed
    ));
  }

  // Complete getWeatherForCity method
  async getWeatherForCity(cityName: string) {
    const coordinates = await this.fetchAndDestructureLocationData(cityName);
    console.log(coordinates);
    const weatherData = await this.fetchWeatherData(coordinates);
    console.log(weatherData); 
    const currentWeather = this.parseCurrentWeather(weatherData);
    console.log(currentWeather);
    const forecast = this.buildForecastArray(weatherData.list);
    console.log(forecast);
    return { currentWeather, forecast };
  }
}

export default new WeatherService();

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath for ES modules

class City {
  name: string;
  id: string;

  constructor(name: string) {
    this.name = name;
    this.id = Date.now().toString(); // Unique ID for each city (timestamp)
  }
}

class HistoryService {
  // Get the current directory in ES module
  private __dirname = path.dirname(fileURLToPath(import.meta.url));
  private filePath = path.resolve(this.__dirname, '../searchHistory.json');  // Use absolute path

  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // If the file doesn't exist, create it with an empty array
        console.warn(`File not found. Creating a new one at ${this.filePath}.`);
        await fs.writeFile(this.filePath, '[]', 'utf-8'); // Create an empty file
        return [];
      } else {
        console.error('Error reading search history file:', error);
        return [];
      }
    }
  }

  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing to search history file:', error);
    }
  }

  // Get all cities from search history
  async getCities(): Promise<City[]> {
    return await this.read();
  }

  // Add a new city to search history
  async addCity(cityName: string): Promise<void> {
    const cities = await this.getCities();
    if (!cities.find(city => city.name.toLowerCase() === cityName.toLowerCase())) {
      const newCity = new City(cityName);
      cities.push(newCity);
      await this.write(cities);
    }
  }

  // * Delete a city by its ID
  async deleteCityById(id: string): Promise<City | null> {
    const cities = await this.getCities();
    const cityIndex = cities.findIndex(city => city.id === id);

    // If the city is not found, return null
    if (cityIndex === -1) {
      return null;
    }

    // Remove the city from the list
    const [deletedCity] = cities.splice(cityIndex, 1);

    // Write the updated cities array to the file
    await this.write(cities);

    return deletedCity;
  }
}

export default new HistoryService();

import { Router, type Request, type Response } from 'express';
const router = Router();
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    const { cityName } = req.body;
    if (!cityName) {
      return res.status(400).json({ message: 'City name is required.' }); 
    }
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    await HistoryService.addCity(cityName);
    return res.json(weatherData); 
  } catch (error) {
    console.error('Error retrieving weather data:', error);
    return res.status(500).json({ message: 'Error retrieving weather data.' });  
  }
});


// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (error) {
    console.error('Error retrieving search history:', error);
    res.status(500).json({ message: 'Error retrieving search history.' });
  }
});


// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if ID is provided
    if (!id) {
      return res.status(400).json({ message: 'City ID is required.' });
    }

    // Attempt to delete the city from search history
    const deletedCity = await HistoryService.deleteCityById(id);

    // If no city was found and deleted, respond with 404
    if (!deletedCity) {
      return res.status(404).json({ message: `City with ID ${id} not found.` });
    }

    // Respond with success
    return res.status(200).json({ message: `City with ID ${id} deleted successfully.` });
  } catch (error) {
    console.error('Error deleting city from history:', error);
    return res.status(500).json({ message: 'Error deleting city from search history.' });
  }
});


export default router;

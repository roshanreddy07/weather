// Install required packages: next.js, tailwindcss, axios, chart.js, react-chartjs-2
// To initialize tailwindcss: npx tailwindcss init

// pages/_app.js
'use client'
// export default MyApp;

// pages/index.js
import { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import 'tailwindcss/tailwind.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetchWeather = async () => {
    if (!latitude || !longitude || !startDate || !endDate) {
      setError('All fields are required.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.get(
        `https://historical-forecast-api.open-meteo.com/v1/forecast`,
        {
          params: {
            latitude,
            longitude,
            start_date: startDate,
            end_date: endDate,
            daily: [
              'temperature_2m_max',
              'temperature_2m_min',
              'temperature_2m_mean',
              'apparent_temperature_max',
              'apparent_temperature_min',
              'apparent_temperature_mean',
            ].join(','),
            timezone: 'auto',
          },
        }
      );

      setWeatherData(response.data.daily);
    } catch (err) {
      setError('Failed to fetch data. Please check inputs or try again later.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: weatherData?.time || [],
    datasets: [
      {
        label: 'Max Temperature (°C)',
        data: weatherData?.temperature_2m_max || [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Min Temperature (°C)',
        data: weatherData?.temperature_2m_min || [],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Mean Temperature (°C)',
        data: weatherData?.temperature_2m_mean || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  return (
    <div className="min-h-screen p-5 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-5 text-center">Weather Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <input
            type="number"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="p-3 border border-gray-300 rounded"
          />
          <input
            type="number"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="p-3 border border-gray-300 rounded"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-3 border border-gray-300 rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-3 border border-gray-300 rounded"
          />
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          onClick={handleFetchWeather}
          className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
        >
          {loading ? 'Loading...' : 'Fetch Weather Data'}
        </button>

        {weatherData && (
          <div className="mt-8">
            <div className="mb-8">
              <Line data={chartData} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Max Temp (°C)
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Min Temp (°C)
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Mean Temp (°C)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {weatherData.time.map((date, idx) => (
                    <tr key={date} className="bg-white border-b">
                      <td className="px-6 py-4">{date}</td>
                      <td className="px-6 py-4">{weatherData.temperature_2m_max[idx]}</td>
                      <td className="px-6 py-4">{weatherData.temperature_2m_min[idx]}</td>
                      <td className="px-6 py-4">{weatherData.temperature_2m_mean[idx]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

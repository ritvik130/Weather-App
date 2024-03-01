import axios from 'axios';

export async function getWeather(lat, long, timezone) {
    try {
        const res = await axios.get("https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime", 
            {
                params: {
                longitude: long, 
                latitude: lat,
                timezone,
            },
        });
       const data = res.data;
       return {
        current: parseCurrentWeather(data),
        daily: parseDailyWeather(data),
        hourly: parseHourlyWeather(data),
       }
    }
    catch (err) {
        console.error(err);
    }
}

function parseCurrentWeather(data) {
    const currentTemp = data.current_weather.temperature;
    const windSpeed = data.current_weather.windspeed;
    const iconCode = data.current_weather.weathercode;
    const maxTemp = data.daily.temperature_2m_max[0];
    const minTemp = data.daily.temperature_2m_min[0];
    const maxFeelsLike = data.daily.apparent_temperature_max[0];
    const minFeelsLike = data.daily.apparent_temperature_min[0];
    const precip = data.daily.precipitation_sum[0];

    return {
        currentTemp: Math.round(currentTemp),
        highTemp: Math.round(maxTemp),
        lowTemp: Math.round(minTemp),
        lowFeelsLike: Math.round(minFeelsLike),
        highFeelsLike: Math.round(maxFeelsLike),
        windSpeed: Math.round(windSpeed),
        precip: Math.round(precip*100)/100,
        iconCode: Math.round(iconCode),
    };
}

function parseDailyWeather({ daily }) {
    return daily.time.map((time, index) => {
        return {
            timestamp: time * 1000,
            iconCode: daily.weathercode[index],
            maxTemp: Math.round(daily.temperature_2m_max[index]),
        }
    })
}

function parseHourlyWeather({ hourly, current}) {
    return hourly.time.map((time, index) => {
        return {
            timestamp: time * 1000,
            iconCode: hourly.weathercode[index],
            maxTemp: Math.round(daily.temperature_2m[index]),
            feelsLike: Math.round(daily.apparent_temperature_2m[index]),
            windSpeed: Math.round(daily.windspeed_10m[index]),
            precip: Math.round(daily.precipitation[index] * 100) / 100,
        }
    }).filter(({ timestamp }) => timestamp >= current_weather.timestamp * 1000)
}

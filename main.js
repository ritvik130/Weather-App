import { getWeather } from "./weather.js"

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
getWeather(10, 10, timeZone)
    .then(data => {
        console.log(data);
    }
);
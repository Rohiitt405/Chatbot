import "dotenv/config"

async function currentWeather({ city }) {
    console.log("Wheather tool is called");
    const url = new URL("https://api.weatherapi.com/v1/current.json");
    url.searchParams.set("key", process.env.WEATHER_API_KEY);
    url.searchParams.set("q", city);

    const response = await fetch(url);

    if (!response.ok)
        throw new Error(await response.text());
    
    return response.text();
}

export default currentWeather;
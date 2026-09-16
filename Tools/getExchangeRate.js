async function getExchangeRate({ from, to }) {
    console.log("Currency Exchange tool called!");

    const response = await fetch(
        `https://api.frankfurter.dev/v2/rate/${encodeURIComponent(from)}/${encodeURIComponent(to)}`
    );

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.text();
}

export default getExchangeRate;
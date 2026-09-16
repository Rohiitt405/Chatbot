import calculate from "./calculator.js";
import currentWeather from "./weather.js";
import getExchangeRate from "./getExchangeRate.js";

export const toolFunctions = {
    calculate,
    currentWeather,
    getExchangeRate,
};

export const toolDefinations = [
    {
        functionDeclarations: [
            {
                name: "calculate",
                description: "Perform arithmatic calculations.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        operation: {
                            type: "STRING",
                            description: "Operations: add, subtract, multiply, divide, mod, power",
                        },
                        a: {
                            type: "NUMBER",
                            description: "First number",
                        },
                        b: {
                            type: "NUMBER",
                            description: "Second number",
                        },
                    },
                    required: ["operation", "a", "b"],
                },
            },
            {
                name: "currentWeather",
                description: "Get the current weather of a city.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        city: {
                            type: "STRING",
                            description: "Name of the citye",
                        },
                    },
                    required: ["city"],
                }
            },
            {
                name: "getExchangeRate",
                description: "Gets the latest exchange rate between two currencies.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        from: {
                            type: "STRING",
                            description: "Source currency code, for example USD",
                        },
                        to: {
                            type: "STRING",
                            description: "Target currency code, for example INR",
                        },
                    },
                    required: ["from", "to"],
                },
            },
        ],
    },
];
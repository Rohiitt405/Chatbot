import calculate from "./calculator.js";
import currentWeather from "./weather.js";
import getExchangeRate from "./getExchangeRate.js";
import { createDirectory, listFiles, readFile, writeFile, } from "./websiteBuilder/websiteOperations.js";

export const toolFunctions = {
    calculate,
    currentWeather,
    getExchangeRate,
    createDirectory,
    writeFile,
    readFile,
    listFiles,
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
            {
                name: "createDirectory",
                description: "Create a new directory inside the website workspace.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        path: {
                            type: "STRING",
                            description: "Relative directory path, for example brewlab",
                        },
                    },
                    required: ["path"],
                }
            },
            {
                name: "writeFile",
                description: "Creates or overwrites a text file inside the website workspace.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        path: {
                            type: "STRING",
                            description: "Relative file path, for example brewlab/index.html",
                        },
                        content: {
                            type: "STRING",
                            description: "Complete content of the file.",
                        },
                    },
                    required: ["path", "content"],
                }
            },
            {
                name: "readFile",
                description: "Read an existing text file from the website workspace.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        path: {
                            type: "STRING",
                            description: "Relative file path",
                        },
                    },
                    required: ["path"],
                }
            },
            {
                name: "listFiles",
                description: "List all files and directories inside a website project.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        path: {
                            type: "STRING",
                            description: "Relative directory path, for example brewlab.",
                        },
                    },
                    required: ["path"],
                }
            },
        ],
    },
];
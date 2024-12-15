const fs = require('fs');
const dotenv = require('dotenv');

// Cargar las variables del archivo .env
dotenv.config();

// Definir la URL según el entorno
const apiUrl = process.env[`API_URL_${process.env.NODE_ENV.toUpperCase()}`] || process.env.API_URL;

// Crear el archivo de configuración
const envConfig = {
  apiUrl: apiUrl,
};

// Escribir el archivo environment.ts correspondiente
fs.writeFileSync(`./src/environments/environment.ts`, `
export const environment = {
  apiUrl: '${envConfig.apiUrl}',
};
`);

console.log('Archivo de configuración generado.');

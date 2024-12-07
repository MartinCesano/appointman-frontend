const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Cargar las variables desde el archivo .env
dotenv.config();

// Ubicación del archivo environment.ts
const environmentFilePath = path.join(__dirname, 'src/environments/environment.ts');

// Leemos el archivo environment.ts
const environmentFileContent = fs.readFileSync(environmentFilePath, 'utf-8');

// Reemplazamos las variables de entorno
const updatedEnvironmentFileContent = environmentFileContent.replace(
  /apiUrl: '.*'/,
  `apiUrl: '${process.env.API_URL}'`
).replace(
  /authSecretKey: '.*'/,
  `authSecretKey: '${process.env.AUTH_SECRET_KEY}'`
);

// Escribimos el contenido actualizado en el archivo environment.ts
fs.writeFileSync(environmentFilePath, updatedEnvironmentFileContent);

console.log('Las variables de entorno han sido actualizadas.');

# Etapa 1: Construcción
FROM node:18 AS build-stage

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos necesarios para instalar dependencias
COPY package*.json ./

# Copiar el archivo .env al contenedor
COPY .env ./


# Instalar dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Ejecutar el build de Angular
RUN node env-config.js
RUN npm run build


# Etapa 2: Servir el contenido con un servidor web
FROM nginx:alpine AS production-stage

# Copiar el build generado en la etapa anterior al servidor Nginx
COPY --from=build-stage /app/dist/appointman-frontend/browser /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando de inicio del contenedor
CMD ["nginx", "-g", "daemon off;"]

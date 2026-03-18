FROM node:20-alpine

WORKDIR /app

# Kopiujemy tylko pliki z listą bibliotek
COPY package*.json ./

# Instalujemy wszystko od zera wewnątrz kontenera
# To naprawi błąd MODULE_NOT_FOUND, bo Docker sam sobie to pobierze
RUN npm install

# Kopiujemy resztę plików
COPY . .

EXPOSE 3000

# Odpalamy w trybie dev, żebyś widział zmiany na żywo
CMD ["npm", "run", "dev"]
FROM node:18-alpine

WORKDIR /app

# Встановлюємо необхідні системні пакети
RUN apk add --no-cache bash

# Копіюємо спочатку package.json для кращого використання кешу
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Встановлюємо залежності в кореневому каталозі
RUN npm install

# Копіюємо файли проєкту
COPY . .

# Встановлюємо залежності для фронтенду і бекенду та будуємо фронтенд
WORKDIR /app/frontend
RUN npm install && npm run build

WORKDIR /app/backend
RUN npm install

# Повертаємось до кореневої директорії
WORKDIR /app

# Порт, який слухатиме додаток
EXPOSE 3000

# Команда для запуску додатку
CMD ["npm", "start"]
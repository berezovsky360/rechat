FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Встановлюємо залежності в кореневому каталозі
RUN npm install

# Копіюємо файли проєкту
COPY . .

# Встановлюємо залежності для фронтенду і бекенду
RUN cd frontend && npm install && npm run build
RUN cd backend && npm install

# Порт, який слухатиме додаток
EXPOSE 3000

# Команда для запуску додатку
CMD ["npm", "start"] 
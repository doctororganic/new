FROM node:18-alpine AS base

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps || npm install

COPY . .

RUN npm run build

EXPOSE 3000
ENV NODE_ENV=production

CMD ["npm", "run", "start"]


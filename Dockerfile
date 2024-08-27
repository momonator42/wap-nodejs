FROM node:18-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine AS production-stage
WORKDIR /app
COPY --from=build-stage /app ./
RUN npm install --only=production
CMD ["npm", "start"]
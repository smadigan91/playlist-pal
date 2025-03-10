FROM node:22-alpine AS base-image

COPY . /app/
WORKDIR /app
RUN npm install
RUN npm run build
CMD ["npm", "run", "dev"]
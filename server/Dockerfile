FROM node:22-alpine

WORKDIR /app

ARG BACKEND_PORT=5001
ENV PORT=${BACKEND_PORT}

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE ${BACKEND_PORT}

# CMD ["npm", "run", "dev"]
CMD ["node", "index.js"]

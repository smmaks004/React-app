FROM node:22-alpine

WORKDIR /app

ARG FRONTEND_PORT=5174
ENV FRONTEND_PORT=${FRONTEND_PORT}

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE ${FRONTEND_PORT}

CMD ["npm", "run", "dev"]

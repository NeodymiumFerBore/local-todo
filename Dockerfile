FROM node:21-alpine as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM ndfeb/httpd-slim:v1.0.0
COPY --from=builder /app/dist .

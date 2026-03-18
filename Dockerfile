FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

# Eliminar config default
RUN rm /etc/nginx/conf.d/default.conf

# Copiar como TEMPLATE para que envsubst reemplace las variables
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copiar build de Vite (dist, no build)
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# envsubst reemplaza las variables al arrancar
CMD ["/bin/sh", "-c", "envsubst '${CURSOS_URL} ${USUARIOS_URL}' \
    < /etc/nginx/templates/default.conf.template \
    > /etc/nginx/conf.d/default.conf \
    && nginx -g 'daemon off;'"]
FROM node:lts-bookworm

WORKDIR /
COPY . ./
RUN npm install --verbose
RUN npm run strapi build

EXPOSE 1337

CMD ["npm", "run", "strapi", "start"]
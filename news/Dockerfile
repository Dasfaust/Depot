FROM node:lts-bookworm

WORKDIR /
COPY . ./
RUN npm install --verbose

EXPOSE 3000

CMD ["npm", "run", "start"]
FROM node:18-alpine

WORKDIR /wagetracker

COPY public/ /wagetracker/public
COPY src/ /wagetracker/src
COPY package.json /wagetracker/

RUN npm install --legacy-peer-deps

CMD ["npm", "start"]
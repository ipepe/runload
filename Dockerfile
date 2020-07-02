FROM node:8

ADD . .

RUN npm install --save

CMD ["node", "app.js"]
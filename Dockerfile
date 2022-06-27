FROM node:lts as build
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --silent && mv node_modules ../
COPY . .
RUN chown -R node /usr/src/app
USER node
RUN npm run build

FROM node:lts as prod
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm ci --production --silent && mv node_modules ../
COPY --from=build /usr/src/app/dist /usr/src/app/dist
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]

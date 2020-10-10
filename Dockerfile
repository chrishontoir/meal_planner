FROM node:14

ARG GITHUB_TOKEN
ENV GITHUB_TOKEN $GITHUB_TOKEN

WORKDIR /app

COPY package.json yarn.lock .npmrc ./
RUN yarn install
RUN rm -f .npmrc
COPY . .

CMD ["node", "src/app.js"]

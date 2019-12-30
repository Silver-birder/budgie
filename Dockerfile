FROM node:12-slim
WORKDIR /usr/src/app
ENV CLOUDINARY_CLOUD_NAME='YOUR_CLOUDINARY_CLOUD_NAME' \
    CLOUDINARY_API_KEY='YOUR_CLOUDINARY_API_KEY' \
    CLOUDINARY_API_SECRET='YOUR_CLOUDINARY_API_SECRET' \
    ALGOLIA_APP_ID='YOUR_ALGOLIA_APP_ID' \
    ALGOLIA_SEARCH_KEY='YOUR_ALGOLIA_SEARCH_KEY' \
    ALGOLIA_ADMIN_KEY='YOUR_ALGOLIA_ADMIN_KEY' \
    ALGOLIA_INDEX_NAME='YOUR_ALGOLIA_INDEX_NAME'
COPY package*.json ./
COPY . ./
RUN npm install && npm run build

CMD [ 'npm', 'start' ]
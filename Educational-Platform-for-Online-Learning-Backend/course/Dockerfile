FROM node:alpine

# Set the timezone
ENV TZ=Asia/Colombo
RUN apk add --no-cache tzdata && \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8070

CMD ["npm", "start"]

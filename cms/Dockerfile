# Sử dụng Node.js LTS
FROM node:20-alpine

# Cài đặt git trên container để phục vụ tính năng tự động push
RUN apk add --no-cache git openssh

# Thiết lập thư mục làm việc
WORKDIR /app/cms

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Copy toàn bộ code backend
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose cổng chạy server
EXPOSE 5000

# Chạy ứng dụng
CMD ["npm", "run", "start"]

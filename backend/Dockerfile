FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

EXPOSE 4000

# Wait for postgres, then start server (TypeORM will auto-sync in dev mode)
CMD sh -c "sleep 5 && npm run dev"


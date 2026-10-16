FROM node:22-alpine

WORKDIR /app

# Copy lockfiles and install dependencies
COPY package*.json ./
RUN npm install -g npm@12 && npm ci

# Copy the rest of the application files
COPY . .

# Expose Vite's default dev port
EXPOSE 5173

# Run the dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

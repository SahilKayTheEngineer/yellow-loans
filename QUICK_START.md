# Quick Start Guide

## Prerequisites

- **Docker Desktop** installed and running
  - Download from: https://www.docker.com/products/docker-desktop
  - Make sure Docker is running (you should see the Docker icon in your system tray/menu bar)

## Step-by-Step Instructions

### 1. Open Terminal

Open your terminal/command prompt and navigate to the project directory:

```bash
cd "/Users/sahilkay/Desktop/Yellow Loans"
```

### 2. Start All Services

Run this command to build and start all containers:

```bash
docker-compose up --build
```

**What this does:**
- Builds the Docker images for backend and frontend
- Starts PostgreSQL database
- Starts the GraphQL backend server
- Starts the React frontend
- Initializes database schema automatically
- Seeds the database with risk groups and sample phones

### 3. Wait for Services to Start

You'll see logs from all three services. Wait until you see:

**Backend:**
```
🚀 Server ready at http://localhost:4000/graphql
```

**Frontend:**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

**Database:**
```
database system is ready to accept connections
```

⏱️ **First time setup takes 2-3 minutes** (downloading images, installing dependencies)

### 4. Access the Application

Once services are running:

- **Frontend (Main App)**: Open http://localhost:3000 in your browser
- **GraphQL Playground**: Open http://localhost:4000/graphql to test the API

### 5. Test the Application

1. Fill in the form:
   - **First Name**: Any name (e.g., "John")
   - **Last Name**: Any name (e.g., "Doe")
   - **ID Number**: Use a valid 13-digit SA ID (e.g., `9001015800085`)
     - **Note**: Birthday will be automatically extracted and filled from the ID number
   - **Monthly Income**: Enter at least R10,000 (e.g., 15000)
   - **Phone**: Select any phone from the filtered list
2. Click through the steps
3. Review the loan summary
4. Submit the application

## Common Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Just backend
docker-compose logs -f backend

# Just frontend
docker-compose logs -f frontend

# Just database
docker-compose logs -f postgres
```

### Stop Services
```bash
# Stop (keeps containers)
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove everything including volumes (deletes database)
docker-compose down -v
```

### Restart Services
```bash
docker-compose restart
```

### Rebuild After Code Changes
```bash
# Rebuild and restart
docker-compose up --build

# Or just restart (faster)
docker-compose restart
```

## Troubleshooting

### Port Already in Use

If you get an error about ports 3000 or 4000 being in use:

**Option 1: Stop the conflicting service**
```bash
# Find what's using the port (Mac/Linux)
lsof -i :3000
lsof -i :4000

# Kill the process or stop the conflicting service
```

**Option 2: Change ports in docker-compose.yml**
Edit `docker-compose.yml` and change the port mappings:
```yaml
ports:
  - "3001:3000"  # Change 3000 to 3001
  - "4001:4000"  # Change 4000 to 4001
```

### Database Connection Errors

If backend can't connect to database:

```bash
# Check if postgres is running
docker-compose ps

# Restart postgres
docker-compose restart postgres

# Wait 10 seconds, then restart backend
docker-compose restart backend
```

### "Cannot find module" Errors

If you see module errors:

```bash
# Rebuild from scratch
docker-compose down -v
docker-compose up --build
```

### Frontend Not Loading

1. Check if frontend container is running: `docker-compose ps`
2. Check frontend logs: `docker-compose logs frontend`
3. Try accessing http://localhost:3000 directly
4. Clear browser cache and hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

### Reset Everything

If something goes wrong and you want a fresh start:

```bash
# Stop and remove everything
docker-compose down -v

# Remove all images (optional)
docker-compose down --rmi all

# Start fresh
docker-compose up --build
```

## Development Workflow

### Making Code Changes

1. **Edit files** in your IDE
2. **Changes auto-reload** (both frontend and backend have hot reload)
3. **Check logs** if something doesn't work: `docker-compose logs -f`

### Database Changes

If you modify TypeORM entities:

```bash
# Generate a new migration
docker-compose exec backend npm run migration:generate -- -n YourMigrationName

# Run migrations
docker-compose exec backend npm run migration:run
```

### View Database

Access the database using TablePlus or similar tool:
- **Host**: `localhost`
- **Port**: `5433`
- **User**: `yellow_user`
- **Password**: `yellow_password`
- **Database**: `yellow_loans`

See [DATABASE_ACCESS.md](./DATABASE_ACCESS.md) for more details.

### Re-seed Database

To reload sample data:

```bash
# Stop and remove database volume
docker-compose down -v

# Start fresh (will auto-seed)
docker-compose up --build
```

## What's Running?

After starting, you'll have:

1. **PostgreSQL** on port 5433 (external), 5432 (internal)
2. **GraphQL Backend** on http://localhost:4000
3. **React Frontend** on http://localhost:3000

All services are connected and ready to use!

## Next Steps

- ✅ Application is running
- 📝 Review the code in your IDE
- 🎨 Customize styling (theme.ts for styled-components)
- 🧪 Test the application flow
- 🚀 Deploy when ready

## Need Help?

- Check `README.md` for detailed documentation
- Check `DATABASE_ACCESS.md` for database connection details
- Check logs: `docker-compose logs -f`

Happy coding! 🚀

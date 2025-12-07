import 'reflect-metadata';
import { createServer } from './server';
import { AppDataSource } from './data-source';
import { seedIfNeeded } from './startup';

const PORT = process.env.PORT || 4000;

async function connectDatabase(retries = 5, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      await AppDataSource.initialize();
      console.log('✅ Database connected');
      return true;
    } catch (error: any) {
      if (i === retries - 1) throw error;
      console.log(`⏳ Database connection failed, retrying in ${delay}ms... (${i + 1}/${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return false;
}

async function start() {
  try {
    // Initialize TypeORM with retries
    await connectDatabase();
    console.log('✅ Database connected');

    // Seed database if empty
    await seedIfNeeded();

    const server = await createServer();
    
    await server.listen({ port: Number(PORT), host: '0.0.0.0' });
    
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  await AppDataSource.destroy();
  process.exit(0);
});

start();


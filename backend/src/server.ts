import { ApolloServer } from '@apollo/server';
import fastifyApollo, { fastifyApolloDrainPlugin } from '@as-integrations/fastify';
import Fastify from 'fastify';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';

export async function createServer() {
  const fastify = Fastify({
    logger: true,
  });

  // Enable CORS manually (compatible with Fastify 4.x)
  fastify.addHook('onRequest', async (request, reply) => {
    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (request.method === 'OPTIONS') {
      reply.code(200).send();
    }
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [fastifyApolloDrainPlugin(fastify)],
  });

  await server.start();

  await fastify.register(fastifyApollo(server));

  return fastify;
}


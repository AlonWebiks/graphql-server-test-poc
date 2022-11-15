// npm install @apollo/server express graphql cors body-parser
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import typeDefs from './typedefs';
import resolvers from './resolvers';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { duckSub } from './duck.service';

interface MyContext {
    token?: String;
}

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
app.use(
    cors<cors.CorsRequest>(),
    bodyParser.json(),
);
const httpServer = http.createServer(app);

const server = new ApolloServer<MyContext>({
    schema,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        },
    ],
});

const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
});

const serverCleanup = useServer({ schema }, wsServer);


export const start = async () => {
    await server.start();
    app.use(
        '/graphql',
        expressMiddleware(server, {
        context: async ({ req }) => ({ token: req.headers.token }),
        }),
    );
    await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
}
import cors from 'cors';
import express from 'express';
import { ApolloServer, ApolloError } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models from './models';

// Logging and Debugging
import { ApolloErrorConverter, mapItemBases, extendMapItem } from 'apollo-error-converter';
import bunyan from 'bunyan';

const app = express();
const log = bunyan.createLogger({ name: 'robbie' });
log.info('Bunyan logger');

// initialize and use cors here
app.use(cors());

// console.log(resolvers, models, schema);

const server = new ApolloServer({
	formatError: new ApolloErrorConverter(), // default
	typeDefs: schema,
	resolvers,
	context: {
		models,
		me: models.users[1]
	}
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
	console.log('Apollo Server on http://localhost:8000/graphql');
});

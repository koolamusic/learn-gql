import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const app = express();

// initialize and use cors here
app.use(cors());

const schema = gql`
	type Query {
		me: User
		users: [User!]
		user(id: ID!): User
	}

	type User {
		id: ID!
		username: String!
	}
`;

const resolvers = {
	Query: {
		me: () => {
			return me;
		},
		users: () => {
			return Object.values(users);
		},
		user: (parent, { id }) => {
			console.log('HERSD======', id);
			return users[id];
		}
	}
};

const server = new ApolloServer({
	typeDefs: schema,
	resolvers
});

server.applyMiddleware({ app, path: '/electron' });

app.listen({ port: 8000 }, () => {
	console.log('Apollo Server on http://localhost:8000/graphql');
});

let users = {
	1: {
		id: '1',
		username: 'Andrew Wieruch'
	},
	2: {
		id: '2',
		username: 'Dave Davids'
	}
};

const me = users[1];

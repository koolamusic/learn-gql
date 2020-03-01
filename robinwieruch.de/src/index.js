import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const app = express();
let users = {
	1: {
		id: '1',
		username: 'Andrew Weruch',
		messageIds: [ 22 ]
	},
	2: {
		id: '2',
		username: 'Dave Dvids',
		messageIds: [ 2 ]
	}
};
let messages = {
	1: {
		id: '1',
		text: 'Hello World',
		userId: '1'
	},
	2: {
		id: '2',
		text: 'Second Message World',
		userId: '2'
	},
	3: {
		id: '3',
		text: 'Third Message',
		userId: '2'
	}
};

// initialize and use cors here
app.use(cors());

const schema = gql`
	type Query {
		me: User
		users: [User!]
		user(id: ID!): User
		messages: [Message!]!
		message(id: ID!): Message!
	}

	type User {
		id: ID!
		username: String!
		messages: [Message!]
	}

	type Message {
		id: ID!
		text: String!
		userId: String
		user: User!
	}
`;

const resolvers = {
	Query: {
		me: (_, __, { me }, info) => {
			return me;
		},
		users: () => {
			return Object.values(users);
		},
		user: (parent, { id }) => {
			console.log('HERSD======', id);
			return users[id];
		},
		messages: () => {
			return Object.values(messages);
		},
		message: (parent, { id }) => {
			return messages[id];
		}
	},

	User: {
		username: (parent) => {
			return parent.username + 3;
		},
		messages: (user) => {
			console.log('XX----', user, messages);
			return Object.values(messages).filter((message) => message.userId === user.id);
		}
	},

	Message: {
		user: (parent) => {
			console.log('G999----', parent);
			return users[parent.userId];
		}
	}
};

const server = new ApolloServer({
	typeDefs: schema,
	resolvers,
	context: {
		me: users[1]
	}
});

server.applyMiddleware({ app, path: '/electron' });

app.listen({ port: 8000 }, () => {
	console.log('Apollo Server on http://localhost:8000/graphql');
});

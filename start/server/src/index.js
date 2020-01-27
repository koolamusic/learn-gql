const { ApolloServer } = require('apollo-server');
const isEmail = require('isemail');

const typeDefs = require('./schema');
const { createStore } = require('./utils');
const resolvers = require('./resolvers');

const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');

const store = createStore();

const server = new ApolloServer({
	context: async ({ req }) => {
		// check auth on every request
		const auth = (req.headers && req.headers.authorization) || '';
		const email = Buffer.from(auth, 'base64').toString('ascii');
		if (!isEmail.validate(email)) return { user: null };
		// find a user by their email
		const users = await store.users.findOrCreate({ where: { email } });
		const user = (user && users[0]) || null;

		return { user: { ...user.dataValues } };
	},
	typeDefs,
	resolvers,
	engine: {
		apiKey: 'service:codeninja-fsd:eNNCX8UrCSd0pe6KrLcG8A'
	},
	dataSources: () => ({
		launchAPI: new LaunchAPI(),
		userAPI: new UserAPI({ store })
	})
});

server.listen().then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
});

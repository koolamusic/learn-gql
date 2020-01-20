module.exports = {
	Query: {
		launches: (_, __, { dataSources }) => dataSources.launchAPI.getAllLaunches(),
		launch: (_, { id }, { dataSources }) => dataSources.launchAPI.getLaunchById({ launchId: id }),
		me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
	}
};

// From this, resolvers are function declarations that execute a GQL Query using functions that have been defined in a datasource.

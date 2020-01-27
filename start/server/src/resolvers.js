const { paginateResults } = require('./utils');

module.exports = {
	Query: {
		Mutation: {
			bookTrips: async (_, { launchIds }, { dataSources }) => {
				const results = await dataSources.userAPI.bookTrips({ launchIds });
				const launches = await dataSources.launchAPI.getLaunchesByIds({
					launchIds
				});

				return {
					success: results && results.length === launchIds.length,
					message:
						results.length === launchIds.length
							? 'trips booked successfully'
							: `the following launches couldn't be booked: ${launchIds.filter(
									(id) => !results.includes(id)
								)}`,
					launches
				};
			},
			cancelTrip: async (_, { launchId }, { dataSources }) => {
				const result = await dataSources.userAPI.cancelTrip({ launchId });

				if (!result)
					return {
						success: false,
						message: 'failed to cancel trip'
					};

				const launch = await dataSources.launchAPI.getLaunchById({ launchId });
				return {
					success: true,
					message: 'trip cancelled',
					launches: [ launch ]
				};
			},
			login: async (_, { email }, { dataSources }) => {
				const user = await dataSources.userAPI.findOrCreateUser({ email });
				if (user) return Buffer.from(email).toString('base64');
			}
		}
	},
	Mission: {
		// make sure the default size is 'large' in case user doesn't specify
		missionPatch: (mission, { size } = { size: 'LARGE' }) => {
			return size === 'SMALL' ? mission.missionPatchSmall : mission.missionPatchLarge;
		}
	},
	launches: async (_, { pageSize = 20, after }, { dataSources }) => {
		const allLaunches = await dataSources.launchAPI.getAllLaunches();
		// we want the results in reverse chronological order so we call Array.reverse()
		allLaunches.reverse();
		const launches = paginateResults({
			after,
			pageSize,
			results: allLaunches
		});
		return {
			launches,
			cursor: launches.length ? launches[launches.length - 1].cursor : null,
			// if the cursor of the end of the paginated resultst is the same as the
			// last item in _all_results, then there are no more results after this query
			hasMore: launches.length
				? launches[launches.length - 1].cursor !== allLaunches[allLaunches.length - 1].cursor
				: false
		};
	},
	Launch: {
		isBooked: async (launch, _, { dataSources }) => dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id })
	},
	User: {
		trips: async (_, __, { dataSources }) => {
			// get ids of launches by user
			const launchIds = await dataSources.userAPI.getLaunchIdsByUser();
			if (!launchIds.length) return [];
			// look up those launches by their ids
			return (
				dataSources.launchAPI.getLaunchesByIds({
					launchIds
				}) || []
			);
		}
	},
	// launches: (_, __, { dataSources }) => dataSources.launchAPI.getAllLaunches(),
	launch: (_, { id }, { dataSources }) => dataSources.launchAPI.getLaunchById({ launchId: id }),
	me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
};

// From this, resolvers are function declarations that execute a GQL Query using functions that have been defined in a datasource.
// By default it takes in 3 parameters as arguments
/**

`fieldName: (parent, args, context, info) => data;`

    parent: An object that contains the result returned from the resolver on the parent type
    args: An object that contains the arguments passed to the field
    context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
    info: Information about the execution state of the operation which should only be used in advanced cases
*/

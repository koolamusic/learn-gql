const { gql } = require('apollo-server');

const typeDefs = gql`
	type Launch {
		id: ID!
		site: String
		mission: Mission
		rocket: Rocket
		isBooked: Boolean
	}

	type Rocket {
		id: ID!
		name: String
		type: String
	}

	type User {
		id: ID!
		email: String!
		trips: [Launch]!
	}

	type Mission {
		name: String
		missionPatch(size: PatchSize): String
	}

	enum PatchSize {
		SMALL
		LARGE
	}

	type Query {
		launches(pageSize: Int, after: String): LaunchConnection! # replace the current launches query with this one.
		launch(id: ID!): Launch
		me: User
	}

	type LaunchConnection {
		# add this below the Query type as an additional type.
		cursor: String!
		hasMore: Boolean!
		launches: [Launch]!
	}

	type Mutation {
		bookTrips(launchIds: [ID]!): TripUpdateResponse!
		cancelTrip(launchId: ID!): TripUpdateResponse!
		login(email: String): String # login Token
	}

	type TripUpdateResponse {
		success: Boolean!
		message: String
		launches: [Launch]
	}
`; // gql is of type of TemplateStringsArray

module.exports = typeDefs;

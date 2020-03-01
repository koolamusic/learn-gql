import { gql } from 'apollo-server-express';

export default gql`
    extend type Query {
        users: [User!]
        user(id: ID!): Userme: User
    }

    type User {
        id: ID!
        username: String!
        messages: [Message!]
    }

`;

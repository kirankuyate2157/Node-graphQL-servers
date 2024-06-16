import { prisma } from '../lib/db.js';
import { ApolloServer } from '@apollo/server';
import { User } from './user/index.js';
import { typeDefs } from './user/typeDefs.js';

export default async function createGraphqlServer() {
    const gqlServer = new ApolloServer({
        typeDefs: `
        ${typeDefs}
        type Query {
            ${User.queries}
        }
        
        type Mutation {
        ${User.mutations}
        
        }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries,
            },
            Mutation:{
                ...User.resolvers.mutations,
            }
        },
    });

    await gqlServer.start();
    return gqlServer;
}
import { prisma } from "../../lib/db.js";

const queries = {
    hello: () => "hello graphql !",
    say: (_, { name }) => `hi ${name}, great to see you here!`,
    tell: async () => {
        const res = await prisma.user.findMany();
        return res
    }
};

const mutations = {

    createUser: async (_, { firstName, lastName, email, password }) => {
        await prisma.user.create({
            data: { firstName, lastName, password, email, salt: "random_salt" }
        });
        return true;
    }

};

export const resolvers = { queries, mutations };
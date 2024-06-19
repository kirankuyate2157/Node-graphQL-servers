import { prisma } from "../../lib/db.js";
import UserService from "../../services/user.js";

const queries = {
  hello: () => "hello graphql !",
  say: (_, { name }) => `hi ${name}, great to see you here!`,
  tell: async () => {
    const res = await prisma.user.findMany();
    return res.indexOf;
  },

  loginUser: async (_, { email, password }) => {
    const res = await UserService.loginUser({ password, email });
    return res;
  },

  getCurrentLoggedUser: async (_, prams, context) => {
    if (context && context.user) return context.user;
    else throw new Error("unknown user !");
    return null;
  },
};

const mutations = {
  createUser: async (_, { firstName, lastName, email, password }) => {
    const res = await UserService.createUser({
      firstName,
      lastName,
      password,
      email,
    });
    return res?.id ?? res;
  },
};

export const resolvers = { queries, mutations };

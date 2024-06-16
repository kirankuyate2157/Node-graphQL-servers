
import { typeDefs } from './typeDefs.js';

export const queries = `
        
        hello:String
        say(name:String): String
        tell: [User]
        loginUser( email:String!, password:String!):String
`;
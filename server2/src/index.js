import express, { json } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from "cors";

const init = async () => {

    const app = express();
    app.use(
        cors({
            origin: process.env.CORS_ORIGIN,
            credentials: true,
        })
    );

    app.use(express.json({ limit: "16kb" })); //json upload limit to save server from crash..
    app.use(express.urlencoded({ extended: true, limit: "16kb" })); //url data understanding
    app.use(express.static("public")); //store file direct on server for public access

    const gqlServer = new ApolloServer({
        typeDefs: `
        type Query {
            hello:String
            say(name:String): String
        }
        `,

        resolvers: {
            Query: {
                hello: () => "hello graphql !",
                say: (_,{name}) => `hi ${name}, great to see you here!`
            }
        }
    });


    await gqlServer.start();

    app.use("/graphql", expressMiddleware(gqlServer));

    app.get('/', (req, res) => {
        res.json({ success: true, message: "sever is running ✅" });
    })

    app.listen(process.env.PORT || 8080, () => {
        console.log("server is running ... on http://localhost:8080 ✅🔥");
    })
}

init();
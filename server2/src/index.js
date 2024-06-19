import express, { json } from "express";

import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import dotenv from "dotenv";
import createGraphqlServer from "./graphql/index.js";
import UserService from "./services/user.js";

dotenv.config();
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

  app.use(
    "/graphql",
    expressMiddleware(await createGraphqlServer(), {
      context: async ({ req }) => {
        const token = req.headers["token"];
        try {
          const user = UserService.decodeToken(token);
          return  {user};
        } catch (error) {
          return {};
        }
      },
    })
  );

  app.get("/", (req, res) => {
    res.json({ success: true, message: "sever is running ✅" });
  });

  app.listen(process.env.PORT || 8080, () => {
    console.log("server is running ... on http://localhost:8080 ✅🔥");
  });
};

init();

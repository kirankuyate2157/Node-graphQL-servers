// services/UserService.js

import { createHmac, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import { prisma } from "./../lib/db.js";

class UserService {
  static generateHash({ password, salt }) {
    return createHmac("sha256", salt).update(password).digest("hex");
  }

  static findUserByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  static async createUser(payload) {
    const { firstName, lastName, email, password } = payload;

    // Check if all fields are provided
    if (!(firstName && lastName && email && password)) {
      throw new Error("All fields are required!");
    }

    // Generate salt and hash the password
    const salt = randomBytes(32).toString("hex");
    const hashedPassword = generateHash(password, salt);

    // Prepare the data for Prisma
    const data = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      salt,
    };

    // Create a new user using Prisma
    return await prisma.user.create({
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });
  }

  static async loginUser(payload) {
    const { email, password } = payload;
    const user = await UserService.findUserByEmail(email);
    if (!user) throw new Error("User not found");

    const userSalt = user.salt;
    console.log(user);
    const newHashPassword = UserService.generateHash({
      password,
      salt: user.salt,
    });
    if (user.password !== newHashPassword)
      throw new Error("Password mismatch !");

    const token = jwt.sign(
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        id: user.id,
      },
      process.env.SECRETE || "kkk"
    );

    return token;
  }
  
  static decodeToken(token) {
    if (token.length < 2) throw new Error("Invalid token or token required!");
    return jwt.verify(token, process.env.SECRETE || "kkk");
  }

  static getUserById(id) {
    return prisma.user.findUnique({ where: { id } });
  }
}

export default UserService;

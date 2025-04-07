import User from "../models/User.js";
import { signToken } from "../services/auth.js";


const resolvers = {
    Query: {},
    Mutation: {
        addUser: async (_: any, { username, email, password }: any) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user.username, user.password, user._id);
            return { token, user };
        }
    }
}

export default resolvers;
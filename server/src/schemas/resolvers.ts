import User from "../models/User.js";
import { signToken } from "../services/auth.js";


const resolvers = {
    Query: {},
    Mutation: {
        addUser: async (_: any, { username, email, password }: any) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user.username, user.password, user._id);
            return { token, user };
        },
        loginUser: async (_: any, { email, password }: any) => {
            const user = await User.findOne({ $or: [{ username: email }, { email }] });
            if (!user) {
                throw new Error("Can't find this user");
            }
            
            const passwordCorrect = await user.isCorrectPassword(password);
            if (!passwordCorrect) {
                throw new Error("Wrong password!");
            }
            const token = signToken(user.username, user.password, user._id);
            return { token, user };
        },
        saveBook: async (_: any, { authors, description, title, bookId, image, link }: any) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $addToSet: { savedBooks: { authors, description, title, bookId, image, link } } },
                { new: true, runValidators: true }
            )
        },
    }
}

export default resolvers;
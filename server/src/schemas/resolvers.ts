import User from "../models/User.js";
import { signToken } from "../services/auth.js";


const resolvers = {
    Query: {
        me: async (_: any, __: any, context: any) => {
            if (context.user) {
                const user = await User.findOne({ _id: context.user._id });
                return user;
            }
            throw new Error("You need to be logged in!");
        }
    },
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
        saveBook: async (_: any, { authors, description, title, bookId, image, link }: any, context: any) => {
             await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: { authors, description, title, bookId, image, link } } },
                { new: true, runValidators: true }
            )
        },
        removeBook: async (_: any, { bookId }: any, context: any) => {
            const user = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
            );
            return user;
        }
    }
}

export default resolvers;
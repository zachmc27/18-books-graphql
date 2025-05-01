import User from '../models/User.js';
import { signToken, AuthenticationError } from '../services/auth.js';
const resolvers = {
    Query: {
        user: async (_parent, { username }) => {
            return await User.findOne({ username });
        },
        me: async (_parent, _args, context) => {
            if (context.user) {
                // If user is authenticated, return their profile
                return await User.findOne({ _id: context.user._id });
            }
            // If not authenticated, throw an authentication error
            throw new AuthenticationError('Not Authenticated');
        }
    },
    Mutation: {
        createUser: async (_parent, { input }) => {
            const user = await User.create({ ...input });
            const token = signToken(user.username, user.email, user._id);
            return { user, token };
        },
        loginUser: async (_parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw AuthenticationError;
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Not authenticated');
            }
            const token = signToken(user.username, user.email, user.id);
            return { token, user };
        },
        saveBook: async (_parent, { input }, context) => {
            if (context.user) {
                return await User.findOneAndUpdate({ _id: context.user._id }, { $addToSet: { savedBooks: input } }, { new: true, runValidators: true });
            }
            throw new AuthenticationError('Could not find user');
        },
        deleteBook: async (_parent, { bookId }, context) => {
            if (context.user) {
                return await User.findOneAndUpdate({ _id: context.user._id }, { $pull: { savedBooks: { bookId: bookId } } }, { new: true });
            }
            throw new AuthenticationError('Could not find user');
        }
    }
};
export default resolvers;

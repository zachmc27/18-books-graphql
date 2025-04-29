import User from '../models/User.js';
import { signToken, AuthenticationError } from '../services/auth.js';
const resolvers = {
    Query: {
        user: async (_parent, { username, userId }) => {
            return await User.findOne({
                $or: [{ _id: userId }, { username: username }]
            });
        },
        me: async (_parent, _args, context) => {
            if (context.user) {
                // If user is authenticated, return their profile
                return await User.findOne({ _id: context.user.id });
            }
            // If not authenticated, throw an authentication error
            throw new AuthenticationError('Not Authenticated');
        }
    },
    Mutation: {
        createUser: async (_parent, args) => {
            console.log('hello', args);
            const user = await User.create(args);
            const token = signToken(user.username, user.email, user.id);
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
        saveBook: async (_parent, { userId, newBook }, context) => {
            if (context.user) {
                return await User.findOneAndUpdate({ _id: userId }, { $addToSet: { savedBooks: newBook } }, { new: true, runValidators: true });
            }
            throw new AuthenticationError('Could not find user');
        },
        deleteBook: async (_parent, { bookId }, context) => {
            if (context.user) {
                return await User.findOneAndUpdate({ savedBooks: { bookId: bookId } }, { $pull: { savedBooks: { bookId: bookId } } }, { new: true });
            }
            throw new AuthenticationError('Could not find user');
        }
    }
};
export default resolvers;

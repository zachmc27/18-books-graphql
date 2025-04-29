import { BookDocument } from '../models/Book.js';
import User from '../models/User.js';
import { signToken, AuthenticationError } from '../services/auth.js';

interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    savedBooks: BookDocument[];
    bookCount: number
}

interface UserArgs {
    userId?: string,
    username?: string
}

interface CreateUserArgs {
    input: {
        username: string,
        email: string,
        password: string
    }
}

interface LoginArgs {
    email: string,
    password: string
}

interface SaveBookArgs {
    userId: string,
    newBook: string
}

interface DeleteBookArgs {
    bookId: string
}

interface Context {
    user?: User;
}

const resolvers = {
    Query: {
        user: async (_parent: unknown, { username, userId }: UserArgs): Promise<User | null> => {
            return await User.findOne({
                $or: [{ _id: userId }, { username: username }]
            });
        },

        me: async (_parent: unknown, _args: unknown, context: Context): Promise<User | null> => {
            if (context.user) {
              // If user is authenticated, return their profile
              return await User.findOne({ _id: context.user.id });
            }
            // If not authenticated, throw an authentication error
            throw new AuthenticationError('Not Authenticated');
          }
    },

    Mutation: {
        createUser: async (_parent: unknown, args: any): Promise<{ token: string; user: User }> => {
            console.log('hello', args);
            const user = await User.create(args);
            const token = signToken(user.username, user.email, user.id);

            return { user, token };
        },

        loginUser: async (_parent: unknown, { email, password}: LoginArgs): Promise<{ token: string; user: User }> => {
         
            const user = await User.findOne({ email });

            if (!user) {
                throw AuthenticationError;
            }

      
            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Not authenticated')
            }

            const token = signToken(user.username, user.email, user.id);

            return { token, user }
        },

        saveBook: async (_parent: unknown, { userId, newBook}: SaveBookArgs, context: Context): Promise<User | null> => {
            if (context.user) {
                return await User.findOneAndUpdate(
                    { _id: userId },
                    { $addToSet: { savedBooks: newBook } },
                    { new: true, runValidators: true }
                )
            }

            throw new AuthenticationError('Could not find user');
        },
        
        deleteBook: async (_parent: unknown, { bookId }: DeleteBookArgs, context: Context): Promise<User | null> => {
            if (context.user) {
                return await User.findOneAndUpdate(
                    { savedBooks: { bookId: bookId } },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                );
            }

            throw new AuthenticationError('Could not find user')
        }
    }
};

export default resolvers
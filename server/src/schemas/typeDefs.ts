const typeDefs = `
type User {
    _id: String
    name: String
    email: String
    password: String
    bookCount: Int
    savedBooks: [Book]!
}

type Book {
    bookId: String
    title: String
    authors: [String]
    description: String
    image: String
    link: String
}

type Auth {
    token: ID!
    user: User
}

input UserInput {
    username: String!
    email: String!
    password: String!
}

type Query {
    user(userId: ID!): User
    me: User
}

type Mutation {
    createUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
    saveBook(userId: ID!, newBook: String!): User
    deleteBook( userId: ID!, bookId: ID!)
}
`;

export default typeDefs;
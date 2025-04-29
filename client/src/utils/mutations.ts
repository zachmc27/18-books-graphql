import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
mutation login($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
        token
        user {
            _id
            name
        }
    }
}
`;

export const ADD_USER = gql`
mutation createUser($input: UserInput!) {
    createUser(input: $input) {
        token
        user {
            _id
            user
        }
    }
}
`

export const SAVE_BOOK = gql`
    mutation saveBook($input: BookInput!) {
        saveBook(input: $input) {
            _id
            username
            savedBooks
            bookCount
        }
    }
`

export const REMOVE_BOOK = gql`
    mutation deleteBook($bookId: ID!) {
        deleteBook(bookId: $bookId) {
            _id
            username
            savedBooks
            bookCount
        }
    }
`


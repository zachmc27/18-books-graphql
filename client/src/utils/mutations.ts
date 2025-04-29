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
mutation CreateUser($username: String!, $email: String!, $password: String!) {
  createUser(username: $username, email: $email, password: $password) {
    token
    user {
      email
      username
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


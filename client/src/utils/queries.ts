import { gql } from "@apollo/client";

export const QUERY_PROFILE = gql`
query singleUser($userId: ID!) {
    user {
        _id
        username
        email
    }
}`

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;
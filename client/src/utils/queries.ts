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
query Me {
  me {
    _id
    bookCount
    savedBooks {
      image
    }
  }
}
`
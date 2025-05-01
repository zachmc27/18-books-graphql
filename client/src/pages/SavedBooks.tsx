import { useEffect, useState } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

import { GET_ME } from '../utils/queries';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import type { User } from '../models/User';
import { useMutation, useQuery } from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutations';

const SavedBooks = () => {
  const { data, loading, refetch } = useQuery(GET_ME)
  const [removeBook] = useMutation(REMOVE_BOOK) 
  const [userData, setUserData] = useState<User | null>(null);

  // use this to determine if `useEffect()` hook needs to run again
  

  
  
  useEffect(() => {
    if (data?.me) {
      setUserData(data.me);
    }
  }, [data]);

  if (loading || !userData) {
    return <div>Loading...</div>;
  }

  
  
  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId }
      });

      
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
      const { data: updatedData } = await refetch();
      setUserData(updatedData.me);
    } catch (err) {
      console.error(err);
    }
  };

  

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md='4' key={book.bookId}>
                <Card  border='dark'>
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;

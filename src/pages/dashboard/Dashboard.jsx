import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Table, Alert } from 'react-bootstrap';

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(null); // Track errors
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://sticky-uta-atifhasans-29cd6511.koyeb.app/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          // If unauthorized, redirect to login
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();

        if (Array.isArray(result)) {
          setUsers(result);
        } else {
          setUsers([]); // Ensure users is always an array
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError(err.message);
      }
    };

    if (token) {
      fetchUsers();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1 className="text-center">Dashboard</h1>
          {error && (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          )}
          {users.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            !error && (
              <p className="text-center">No users available to display.</p>
            )
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;

import { Link, useNavigate } from "react-router-dom";
import { Table, Button, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";

import Loader from "../components/Loader";
import { getUsers } from "../actions/userActions";
import { useEffect } from "react";

const UserListScreen = () => {
  const dispach = useDispatch();
  const userList = useSelector((state) => state.userList);
  useEffect(() => {
    dispach(getUsers());
  }, []);
  const { loading, error, users } = userList;
  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Container>
          {users?.map((user) => (
            <div key={user._id}>
              <strong> {user.name}</strong>
            </div>
          ))}
        </Container>
      )}
    </div>
  );
};

export default UserListScreen;

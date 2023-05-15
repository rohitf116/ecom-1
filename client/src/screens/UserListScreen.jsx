import { Link, useNavigate } from "react-router-dom";
import { Table, Button, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";

import Loader from "../components/Loader";
import { getUsers, deleteUsers } from "../actions/userActions";
import { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";

const UserListScreen = () => {
  const dispach = useDispatch();
  const userList = useSelector((state) => state.userList);
  const userLogin = useSelector((state) => state.userLogin);
  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = userLogin;
  const deleteUserHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispach(deleteUsers(id));
    }
  };
  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispach(getUsers());
    } else {
      navigate("/");
    }
  }, [navigate, dispach, successDelete]);
  const { loading, error, users } = userList;
  return (
    <Container>
      <h1>Users</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email.value}</td>
                <td>
                  {user.isAdmin ? (
                    <i className="fas fa-check" style={{ color: "green" }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <Button variant="light" className="btn-sm">
                    <i className="fas fa-edit"></i>
                  </Button>

                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteUserHandler(user._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default UserListScreen;

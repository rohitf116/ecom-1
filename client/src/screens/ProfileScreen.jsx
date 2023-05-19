import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  Card,
  Modal,
  ListGroup,
  Table,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import {
  getUserDeails,
  updateUserDeails,
  updateUserPassword,
} from "../actions/userActions";
import { getMyOrder } from "../actions/orderActions";

// Import Font Awesome components and icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";

const ProfileScreen = () => {
  const dispatch = useDispatch();

  const userDetail = useSelector((state) => state.userDetail);
  const navigate = useNavigate();
  const { loading, error, user } = userDetail;
  const userLogin = useSelector((state) => state.userLogin);

  const { userInfo } = userLogin;

  const orderListMy = useSelector((state) => state.orderListMy);

  const { loading: loadingOrder, error: errorOrder, orders } = orderListMy;

  console.log(orders, "orders");

  const [isNameEditable, setIsNameEditable] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);
  const [success, setSucces] = useState(false);
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    dispatch(getUserDeails());
    dispatch(getMyOrder());
  }, [navigate, userInfo, error, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUserDeails(updatedName));
  };

  const handleRegisterLinkClick = () => {
    navigate("/register");
  };

  const handleNameEdit = () => {
    setIsNameEditable(true);
  };

  const updateProfileHandler = () => {
    setIsNameEditable(false);
    dispatch(updateUserDeails(updatedName));
    setSucces(true);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      dispatch(updateUserPassword(currentPassword, newPassword));
      setPasswordError("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsPasswordEditable(false);
    }
  };
  return (
    <Container>
      <Row>
        <Col md={3}>
          <h2>User Profile</h2>
          {error && <Message variant="danger">{error}</Message>}
          {success && <Message variant="success">Profile updated</Message>}
          {loading && <Loader />}
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Name:</Col>
                  <Col>
                    {isNameEditable ? (
                      <Form.Control
                        type="text"
                        value={updatedName}
                        onChange={(e) => setUpdatedName(e.target.value)}
                      />
                    ) : (
                      <strong>{user?.name}</strong>
                    )}

                    <FontAwesomeIcon
                      className="mx-3"
                      onClick={handleNameEdit}
                      disabled={isNameEditable}
                      icon={faEdit}
                    />
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Email:</Col>
                  <Col>
                    <strong>{user?.email?.value}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Password:</Col>
                  <Button
                    className="btn-sm ml-2"
                    onClick={() => setIsPasswordEditable(true)}
                  >
                    Update
                  </Button>
                </Row>
              </ListGroup.Item>
            </ListGroup>
            {isNameEditable && (
              <Button
                className="btn-success btn-sm mt-3"
                onClick={updateProfileHandler}
              >
                Update Profile
              </Button>
            )}
          </Card>
        </Col>
        <Col md={9}>
          <h2>My Orders</h2>
          {loadingOrder ? (
            <Loader />
          ) : errorOrder ? (
            <Message variant="danger">{errorOrder}</Message>
          ) : (
            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>${order.totalPrice.toFixed(2)}</td>
                    <td>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <i
                          className="fas fa-times"
                          style={{ color: "red" }}
                        ></i>
                      )}
                    </td>
                    {console.log(order.isDelevered, "--------------")}
                    <td>
                      {order.isDelevered ? (
                        order?.deleveredAt?.substring(0, 10)
                      ) : (
                        <i
                          className="fas fa-times"
                          style={{ color: "red" }}
                        ></i>
                      )}
                    </td>
                    <td>
                      <Link to={`/order/${order._id}`}>Details</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
      <Modal
        show={isPasswordEditable}
        onHide={() => setIsPasswordEditable(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePasswordSubmit}>
            <Form.Group controlId="currentPassword">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" className="btn-sm">
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};
export default ProfileScreen;

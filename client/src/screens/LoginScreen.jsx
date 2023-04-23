import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import {
  login,
  clearUserRegistration,
  clearLoginError,
} from "../actions/userActions";
import { fetchCart } from "../actions/cartActions";
const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [attemptedLogin, setAttemptedLogin] = useState(false);
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const navigate = useNavigate();
  const { loading, error, userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      const redirect = new URLSearchParams(window.location.search).get(
        "redirect"
      );
      navigate(redirect ? `/${redirect}` : "/");
    } else if (
      error === "Please verify your email" &&
      email &&
      attemptedLogin
    ) {
      navigate(`/verifyEmail?email=${email}`);
    }

    return () => {
      dispatch(clearLoginError());
    };
  }, [navigate, userInfo, error, email, attemptedLogin, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    setAttemptedLogin(true);
    dispatch(login(email, password)).then(() => {
      dispatch(fetchCart());
    });
  };

  const handleRegisterLinkClick = () => {
    dispatch(clearUserRegistration());
    navigate("/register");
  };
  return (
    <FormContainer>
      <h1>sign in</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" className="my-3" variant="primary">
          Login
        </Button>
      </Form>
      <Row>
        <Col>
          New User?
          <Button
            to="#"
            className="btn bg-info rounded btn-primary mx-3"
            onClick={handleRegisterLinkClick}
          >
            Register
          </Button>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;

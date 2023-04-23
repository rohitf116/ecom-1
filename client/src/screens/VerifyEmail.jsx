import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import axios from "axios";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);

  const query = useQuery();
  const email = query.get("email");

  const navigate = useNavigate();

  useEffect(() => {
    if (verificationResult) {
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    }
  }, [verificationResult, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:3001/api/v1/user/verify",
        { email, otp },
        config
      );
      setLoading(false);
      setVerificationResult(data);
    } catch (error) {
      setLoading(false);
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  };

  const handleRegisterLinkClick = () => {
    navigate("/register");
  };

  const handleResendOtpClick = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.patch(
        "http://localhost:3001/api/v1/user/resent",
        { email },
        config
      );
      console.log(data);
      // Handle success message or other UI updates here, if needed.
    } catch (error) {
      // Handle error message or other UI updates here, if needed.
    }
  };

  return (
    <FormContainer>
      <h1>Verify email</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      {verificationResult && (
        <Message variant="success">{verificationResult.message}</Message>
      )}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="otp">
          <Form.Label>Enter Otp</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" className="my-3" variant="success">
          Verify
        </Button>
      </Form>
      <Row>
        <Col>
          New User?
          <Button to="#" onClick={handleRegisterLinkClick}>
            Register
          </Button>
        </Col>
      </Row>
      <Row>
        <Col className="my-3">
          Resend password
          <Button to="#" onClick={handleResendOtpClick}>
            RESEND
          </Button>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default VerifyEmail;

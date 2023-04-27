import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getUserAddress, addUserAddress } from "../actions/userActions";
import {savePaymentMethod} from "../actions/orderActions"
import CheckoutSteps from "../components/CheckoutSteps";
import FormContainer from "../components/FormContainer";

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("Paypal");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userAddress = useSelector((state) => state.userAddress);
  const { loading, error, address: addresses } = userAddress;

  const userAddAddress = useSelector((state) => state.userAddAddress);
  const { success: addAddressSuccess } = userAddAddress;

  const submitHandler = async (e) => {
    e.preventDefault();
    
    dispatch(savePaymentMethod(paymentMethod))
    navigate("/placeorder")
  };


  // const handleContinue = () => {
  //   if (selectedAddress !== null) {
  //     navigate("/some-path"); // Replace '/some-path' with the path you want to navigate to
  //   }
  // };
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
        </Form.Group>
        <Col>
          <Form.Check
            type="radio"
            label="Paypal or Credit card"
            id="paypal"
            name="paymentMethod"
            value="paypal"
            
            onChange={(e) => {
              console.log("Payment method changed:", e.target.value);
              setPaymentMethod(e.target.value);
            }}
          >
           
          </Form.Check>
        </Col>
        <Button type="submit">Continue</Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;

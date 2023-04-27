import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Container,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getUserAddress, addUserAddress } from "../actions/userActions";
import { savePaymentAddress } from "../actions/orderActions";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";

const PlaceOrderScreen = () => {
  const cart = useSelector((state) =>
    state?.cart?.cart ? state?.cart?.cart : state?.cart
  );
  cart.shippingPrice = cart.totalPrice > 500 ? 0 : 100;
  cart.taxPrice = Number((0.18 * cart.totalPrice).toFixed(2));
  console.log(cart, "cart");
  const shippingAddress = useSelector(
    (state) => state?.shippingAddress?.shippingAddress
  );
  const paymentMethod = useSelector(
    (state) => state?.paymentMethod?.paymentMethod
  );
  const placeOrderHandler = () => {};
  console.log(paymentMethod, "paymentMethod");
  return (
    <Container>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup.Item variant="flush">
            <h2>Shipping</h2>
            <p>
              <strong>Address:</strong>
              {shippingAddress.street},{shippingAddress.city},
              {shippingAddress.postalCode},{shippingAddress.country}
            </p>
          </ListGroup.Item>
          <ListGroup.Item>
            <h2>Payment Method</h2>
            <strong>Method:</strong>
            {paymentMethod}
          </ListGroup.Item>
          <ListGroup.Item>
            <h2>Order Items</h2>
            {cart?.items === 0 ? (
              <Message>You have no items to buy </Message>
            ) : (
              <ListGroup variant="flush">
                {cart.items.map((item, index) => (
                  <ListGroup.Item key={item.productId}>
                    <Row>
                      <Col md={1}>
                        <Image src={item.image} fluid rounded />
                      </Col>
                      <Col>
                        <Link to={`/product/${item.productId}`}>
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={4}>
                        {item.quantity} x ${item.price} =
                        {item.quantity * item.price}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </ListGroup.Item>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cart?.shippingPrice || 0}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${cart.taxPrice || 0}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={!cart?.items?.length}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PlaceOrderScreen;

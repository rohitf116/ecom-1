import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Form,
  Button,
  Col,
  ListGroup,
  Image,
  Row,
  Card,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { PayPalButton } from "react-paypal-button-v2";
import { getOrder, payOrder } from "../actions/orderActions";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import { ORDER_PAY_RESET } from "../constants/orderContants";
const PaymentScreen = () => {
  const [sdkReady, setSdkReady] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, error, order } = orderDetails;
  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;
  console.log(orderPay, "orderPay-------------");
  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(id, paymentResult));
  };
  console.log("sdkReady:", sdkReady);
  console.log("loading:", loading);
  console.log("loadingPay:", loadingPay);
  useEffect(() => {
    dispatch(getOrder(id));
  }, [id]);
  useEffect(() => {
    console.log("Order object: ", order);
    console.log("successPay: ", successPay);

    const addPayPalScript = async () => {
      console.log(addPayPalScript, "addPayPalScript is fired");
      const { data: clientId } = await axios.get(
        "http://localhost:3001/api/config/paypal"
      );
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        console.log("script loaded");
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };
    console.log(order, "order");
    console.log(order?.isPaid, "!order?.isPaid");
    console.log(!window.paypal, "!window.paypal");

    if (!order || successPay) {
      console.log("!order || successPay");
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrder(id));
    } else if (!order?.isPaid) {
      if (!window.paypal) {
        console.log("!window.paypal");
        addPayPalScript();
      } else {
        console.log("setSdkReady(true);");
        setSdkReady(true);
        console.log("setSdkReady(result);", sdkReady);
      }
    }
  }, [id, successPay, sdkReady, order]);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h2>Order Details</h2>
      <Row>
        <Col md={8}>
          <ListGroup.Item variant="flush">
            <h2>Shipping</h2>
            <p>
              <strong>Address:</strong>
              {order?.metadata?.street},{order?.metadata?.city},
              {order?.metadata?.postalCode},{order?.metadata?.country}
            </p>
            {order?.isDelivered ? (
              <Message variant="success">
                Dilivered at {order?.isDelivered}
              </Message>
            ) : (
              <Message variant="danger">Not Delivered</Message>
            )}
          </ListGroup.Item>
          <ListGroup.Item>
            <h2>Payment Method</h2>
            <strong>Method:</strong>
            {order?.paymentMethod}
            {order?.isPaid ? (
              <Message variant="success">Paid on {order?.paidAt}</Message>
            ) : (
              <Message variant="danger">Not paid</Message>
            )}
          </ListGroup.Item>
          <ListGroup.Item>
            <h2>Order Items</h2>
            {order?.items === 0 ? (
              <Message>You have no items to buy </Message>
            ) : (
              <ListGroup variant="flush">
                {order?.items.map((item, index) => (
                  <ListGroup.Item key={item.productId}>
                    <Row>
                      <Col md={1}>
                        <Image src={item.image} fluid rounded />
                      </Col>
                      <Col>
                        <Link to={`/product/${item?.productId}`}>
                          {item?.name}
                        </Link>
                      </Col>
                      <Col md={4}>
                        {item?.quantity} x ${item.price} =
                        {item?.quantity * item.price}
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
                  <Col>${order?.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order?.shippingPrice || 0}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order?.taxPrice || 0}</Col>
                </Row>
              </ListGroup.Item>
              {!order?.isPaid && (
                <ListGroup.Item>
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={Number((order?.totalPrice).toFixed(2))}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PaymentScreen;
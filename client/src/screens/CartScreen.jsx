import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  useParams,
  useSearchParams,
  Link,
  useNavigate,
} from "react-router-dom";
import { addToCart, removeFromCart } from "../actions/cartActions";
import {
  Col,
  Row,
  ListGroup,
  Form,
  Image,
  Button,
  Card,
} from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
const CartScreen = () => {
  const cart = useSelector((state) =>
    state?.cart?.cart ? state?.cart?.cart : state?.cart
  );
  const dispatch = useDispatch();
  let items;
  let other = {};
  if (cart) {
    items = cart.items;
    other = cart;
  }
  const navigate = useNavigate();
  items = items === undefined ? [] : items;
  console.log(items, "items");
  console.log(items.totalItems, "Hii");
  const carts = async (id, qty) => {
    await dispatch(removeFromCart(id, qty));
  };
  const checkoutHandler = () => {
    navigate("/login?redirect=shipping");
  };
  return (
    <Row>
      <Col md={8}>
        <h1>Shopping cart</h1>
        {items.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <ListGroup variant="flush">
            {items.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image
                      src={item.image}
                      style={{ width: "150px", height: "150px" }}
                      fluid
                      rounded
                    ></Image>
                  </Col>
                  <Col md={3}>
                    <Link to={`product/${item.productId}`}>
                      {item.name || "Hello"}
                    </Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.quantity}
                      onChange={(e) =>
                        dispatch(
                          addToCart(item.productId, Number(e.target.value))
                        )
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option value={x + 1} key={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => carts(item.productId, item.quantity)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4} className="py-3">
        <ListGroup>
          <ListGroup.Item>
            <h3>Subtotal :{other.totalItems} items</h3>${other.totalPrice}
          </ListGroup.Item>
          <ListGroup.Item>
            <Button
              className="btn-block"
              disabled={!items?.length}
              onClick={checkoutHandler}
            >
              <h3>Checkout</h3>
            </Button>
          </ListGroup.Item>
        </ListGroup>
      </Col>
    </Row>
  );
};

export default CartScreen;

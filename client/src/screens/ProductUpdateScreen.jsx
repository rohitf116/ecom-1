import React, { useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Message from "../components/Message";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Container,
  Form,
} from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { updateProduct } from "../actions/productActions";
import Loader from "../components/Loader";
import { PRODUCT_UPDATE_RESET } from "../constants/productContants";
const ProductUpdateScreen = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const items = state?.data?.product || {};

  const [details, setDetails] = useState({
    name: items.name || "",
    description: items.description || "",
    brand: items.brand || "",
    category: items.category || "",
    price: items.price || "",
    countInStock: items.countInStock || "",
  });
  const [file, setFile] = useState(null);
  const chageFileHandler = (e) => {
    const fileOne = e.target.files[0];
    setFile(fileOne);
    // setMessage(null);
  };
  const productUpdate = useSelector((state) => state.productUpdate);
  console.log(productUpdate, "productUpdate");
  const { loading, error, product } = productUpdate;

  console.log(product, 422000);
  const submitHandler = (e) => {
    e.preventDefault();
    console.log(details);
    console.log(file);
    const { name, description, brand, category, price, countInStock } = details;
    dispatch(
      updateProduct(
        name,
        description,
        brand,
        category,
        price,
        countInStock,
        file,
        id
      )
    );
  };
  const { id } = useParams();
  const changeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setDetails({ ...details, [name]: value });
  };
  useEffect(() => {
    if (product) {
      setTimeout(() => {
        dispatch({ type: PRODUCT_UPDATE_RESET });
      }, 5000);
    }
  }, [product, dispatch]);
  return (
    <FormContainer>
      <h1>Product</h1>
      {product && <Message>Product Successfully added</Message>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name">
          <Form.Label>Name </Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter your name"
            value={details.name}
            onChange={changeHandler}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            name="description"
            placeholder="Enter your description"
            value={details.description}
            onChange={changeHandler}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Brand</Form.Label>
          <Form.Control
            type="text"
            name="brand"
            placeholder="Enter your brand"
            value={details.brand}
            onChange={changeHandler}
          ></Form.Control>
        </Form.Group>
        //
        <Form.Group controlId="Category">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            name="category"
            placeholder="Enter your category"
            value={details.category}
            onChange={changeHandler}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            name="price"
            placeholder="Enter your price"
            value={details.price}
            onChange={changeHandler}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="countInStock">
          <Form.Label>countInStock</Form.Label>
          <Form.Control
            type="number"
            name="countInStock"
            placeholder="Enter your countInStock"
            value={details.countInStock}
            onChange={changeHandler}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            name="image"
            placeholder="EImage"
            onChange={chageFileHandler}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" className="my-3" variant="primary">
          Add
        </Button>
      </Form>
      <Row>
        <Col>
          New User? <Link to="/login">Login</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default ProductUpdateScreen;

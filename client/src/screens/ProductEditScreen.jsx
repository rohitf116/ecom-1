import React, { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
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
import { productCreate } from "../actions/productActions";
import Loader from "../components/Loader";
const ProductEditScreen = () => {
  const dispatch = useDispatch();
  const [details, setDetails] = useState({
    name: "",
    description: "",
    brand: "",
    category: "",
    price: "",
    countInStock: "",
  });
  const [file, setFile] = useState(null);
  const chageFileHandler = (e) => {
    const fileOne = e.target.files[0];
    setFile(fileOne);
    // setMessage(null);
  };
  const createProduct = useSelector((state) => state.createProduct);
  const { loading, error, product } = createProduct;
  const submitHandler = (e) => {
    e.preventDefault();
    console.log(details);
    console.log(file);
    const { name, description, brand, category, price, countInStock } = details;
    dispatch(
      productCreate(
        name,
        description,
        brand,
        category,
        price,
        countInStock,
        file
      )
    );
  };
  const { id } = useParams();
  const changeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setDetails({ ...details, [name]: value });
  };
  useEffect(() => {}, [product]);
  return (
    <FormContainer>
      <h1>Product</h1>
      {/* {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />} */}
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
        <Form.Group controlId="password">
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

export default ProductEditScreen;

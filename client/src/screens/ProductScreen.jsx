import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
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
import Ratig from "../components/Rating";
import { useEffect } from "react";
import {
  listProductDeatils,
  createReview,
  getReviews,
} from "../actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productContants";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { addToCart } from "../actions/cartActions";
const ProductScreen = () => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const productCreateReview = useSelector((state) => state.productCreateReview);
  const {
    loading: reviewLoding,
    error: reviewError,
    success: reviewSuccess,
  } = productCreateReview;

  const dispatch = useDispatch();
  const productListReview = useSelector((state) => state.productListReview);
  const {
    loading: reviewListLoding,
    error: reviewListError,
    reviews,
  } = productListReview;
  useEffect(() => {
    dispatch(listProductDeatils(id));
    dispatch(getReviews(id));
  }, [dispatch, id, reviewSuccess]);
  const submitHandler = () => {
    dispatch(addToCart(id, Number(qty)));
    navigate("/cart");
  };
  console.log(reviews, "reviews");
  return (
    <Container>
      <Link className="btn btn-light my-3" to="/">
        Go back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            <Col md={6}>
              <Image src={product.image} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Ratig
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  <h3>$:{product.price}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p>{product.description}</p>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>{product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? "In stock" : "Out of Stock"}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option value={x + 1} key={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button
                      onClick={submitHandler}
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                    >
                      Add to Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h2>Reviews</h2>
              {reviews?.length === 0 && <Message>No Reviews</Message>}
              {reviews?.map((review) => {
                return (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Ratig value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                );
              })}
              <ListGroup.Item>
                <h1>Hii</h1>
              </ListGroup.Item>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default ProductScreen;

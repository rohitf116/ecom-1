import { useEffect } from "react";
import { Col, Row } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import Product from "../components/Product";
import { listProducts, topProducts } from "../actions/productActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useHistory, useParams } from "react-router-dom";
import Paginate from "../components/Paginate";
import ProductCarousal from "../components/ProductCarousal";
const HomeScreen = () => {
  const { keyword } = useParams();
  const { page = 1 } = useParams();
  console.log(keyword, "--");
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  const pages = products?.pages || 0;
  console.log(productList, "productList");

  useEffect(() => {
    dispatch(listProducts(keyword, page));
  }, [dispatch, keyword, page]);
  // const products = [];
  return (
    <div>
      {!keyword && <ProductCarousal />}
      <h1>Latest products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {products?.data?.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            keyword={keyword ? keyword : ""}
            page={page}
            pages={pages}
          />
        </>
      )}
    </div>
  );
};

export default HomeScreen;

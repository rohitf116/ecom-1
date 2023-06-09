import { Link, useNavigate, useParams } from "react-router-dom";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";

import Loader from "../components/Loader";
import { listProducts, deleteProduct } from "../actions/productActions";
import { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import Paginate from "../components/Paginate";

const ProductListScreen = () => {
  const dispach = useDispatch();
  const { keyword } = useParams();
  const { page = 1 } = useParams();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  const userLogin = useSelector((state) => state.userLogin);
  const productDelete = useSelector((state) => state.deleteProduct);
  const pages = products?.pages || 0;
  const {
    loading: deleteLoading,
    success: deleteSuccess,
    error: deleteError,
  } = productDelete;
  console.log(productDelete, "productDelete");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = userLogin;
  const deleteProductHandler = (id) => {
    if (window.confirm("Are you sure?")) {
    }
    dispach(deleteProduct(id));
  };
  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispach(listProducts("", page));
    } else {
      navigate("/");
    }
  }, [navigate, dispach, userInfo, deleteSuccess, page]);
  const createProduct = () => {
    navigate("/edit");
  };
  const gotoUpdate = (product, id) => {
    console.log(product, id);
    navigate(`/update/${id}`, { state: { data: { product } } });
  };
  return (
    <>
      <Row className="align-item-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProduct}>
            <i className="fas fa-plus"></i> Add Product
          </Button>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {products?.data?.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td> ${product.price}</td>
                  <td> {product.category}</td>
                  <td> {product?.brand || "No Brand"}</td>
                  <td>
                    <Link to={`/${product._id}`}>Link </Link>
                  </td>

                  <td>
                    <Button
                      variant="light"
                      className="btn-sm"
                      onClick={() => gotoUpdate(product, product._id)}
                    >
                      <i className="fas fa-edit"></i>
                    </Button>

                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteProductHandler(product._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate
            keyword={keyword ? keyword : ""}
            page={page}
            pages={pages}
            isAdmin={true}
          />
        </>
      )}
    </>
  );
};

export default ProductListScreen;

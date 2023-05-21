import { Link, useNavigate } from "react-router-dom";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";

import Loader from "../components/Loader";
import { getOrderList, deliverOrder } from "../actions/orderActions";
import { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";

const OrderListScreen = () => {
  const dispach = useDispatch();
  const orderList = useSelector((state) => state.orderList);
  console.log(orderList, "orderList");
  const { loading, error, orders } = orderList;
  console.log(orders, "orders");
  const userLogin = useSelector((state) => state.userLogin);
  const orderDeliver = useSelector((state) => state.orderDeliver);

  const {
    loading: deliveredLoading,
    error: deliveredError,
    success,
  } = orderDeliver;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = userLogin;
  const handleDeliver = (id) => {
    console.log(id, "id");
    dispach(deliverOrder(id));
  };
  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispach(getOrderList());
    } else {
      navigate("/");
    }
  }, [navigate, dispach, userInfo, success]);
  const createProduct = () => {};
  const gotoUpdate = (product, id) => {
    console.log(product, id);
    navigate(`/order/${id}`, { state: { data: { product } } });
  };
  return (
    <>
      {error && <Message variant="danger">{error}</Message>}
      {deliveredError && <Message variant="danger">{deliveredError}</Message>}
      {loading && <Loader />}
      <Row className="align-item-center">
        <Col>
          <h1>Orders</h1>
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
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>TOTAL_PRICE</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>DATE</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td> ${order.user}</td>

                <td> {order.totalPrice}</td>

                <td>
                  {order.isPaid ? (
                    <i className="fas fa-check" style={{ color: "green" }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  {order.deleveredAt ? (
                    <i className="fas fa-check" style={{ color: "green" }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td> {order?.createdAt}</td>
                <td>
                  <Link to={`/order/${order._id}`}>Link </Link>
                </td>

                <td>
                  <Button
                    variant="light"
                    className="btn-sm"
                    onClick={() => gotoUpdate(order, order._id)}
                  >
                    <i className="fas fa-edit"></i>
                  </Button>
                </td>
                <td>
                  <Button
                    variant="light"
                    className="btn-sm"
                    onClick={() => handleDeliver(order._id)}
                  >
                    Mark as delivered
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;

import React from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, Link } from "react-router-dom";
import { logout } from "../actions/userActions";
import { clearCart } from "../actions/cartActions";

const Header = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const dispatch = useDispatch();
  const { userInfo } = userLogin;

  // Get the updated user name from the userDetail state
  const userDetail = useSelector((state) => state.userDetail);
  const { user } = userDetail;

  const logOutHandler = () => {
    dispatch(logout());
    dispatch(clearCart()); // Add this line
  };

  // Use the updated name if available, otherwise fallback to userInfo.name
  const userName = user?.name || userInfo?.name;

  return (
    <div>
      <header>
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
          <Container>
            <Link to="/">
              <Navbar.Brand>Ecom</Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Link to="/cart">
                  <i className="fas fa-shopping-cart"></i> Cart
                </Link>
                {userInfo ? (
                  <NavDropdown title={userName}>
                    <NavDropdown.Item as={Link} to="/profile">
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={logOutHandler}>
                      LogOut
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <Nav.Link as={Link} to="/login">
                    <i className="fas fa-user"></i> Sign In
                  </Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      <Outlet />
    </div>
  );
};

export default Header;

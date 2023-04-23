import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getUserAddress, addUserAddress } from "../actions/userActions";
import FormContainer from "../components/FormContainer";

const ShippingScreen = () => {
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [addAddress, setAddAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const dispatch = useDispatch();
  const userAddress = useSelector((state) => state.userAddress);
  const { loading, error, address: addresses } = userAddress;

  const userAddAddress = useSelector((state) => state.userAddAddress);
  const { success: addAddressSuccess } = userAddAddress;

  useEffect(() => {
    dispatch(getUserAddress());
  }, [dispatch]);
  useEffect(() => {
    console.log(addAddressSuccess,"addAddressSuccess")
    if (addAddressSuccess) {
      dispatch(getUserAddress());
    }
  }, [dispatch, addAddressSuccess]);
  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(street, city, country, postalCode);
    await dispatch(addUserAddress(street, city, postalCode, country));
    dispatch(getUserAddress());
    setAddAddress(false);
  };

  const handleSelectAddress = (index) => {
    setSelectedAddress(index);
  };

  const handleAddAddressClick = () => {
    setAddAddress(true);
  };

  return (
    <FormContainer>
      {addresses && addresses.length > 0 && !addAddress ? (
        <>
          <Form>
            {addresses.map((addr, index) => (
              <Form.Check
                key={index}
                type="radio"
                name="address"
                label={`${addr.street}, ${addr.city}, ${addr.postalCode}, ${addr.country}`}
                onClick={() => handleSelectAddress(index)}
              />
            ))}
          </Form>
          <Button onClick={handleAddAddressClick}>Add Address</Button>
        </>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="postalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter postal"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="country">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type="submit">Continue</Button>
        </Form>
      )}
    </FormContainer>
  );
};

export default ShippingScreen;

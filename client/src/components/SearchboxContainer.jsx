import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SearchboxContainer = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const submitHandler = (e) => {
    e.preventDefault();

    if (keyword?.trim()) {
      navigate(`/search/${keyword.trim()}`);
    } else {
      navigate(`/`);
    }
  };
  return (
    <Form onSubmit={submitHandler} className="d-flex flex-col">
      <Form.Control
        type="text"
        name="keyword"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="searchbox"
        className="mr-sm-2 ml-sm-5"
      ></Form.Control>
      <Button type="submit" value="outline-success" className="p-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchboxContainer;

import React from "react";
import { Pagination, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useParams } from "react-router-dom";
const Paginate = ({ keyword = "", page = "1", pages, isAdmin = false }) => {
  return (
    <>
      {pages > 1 && (
        <Pagination className="d-flex justify-content-center">
          {[...Array(pages).keys()].map((x) => (
            <LinkContainer
              key={x + 1}
              to={
                !isAdmin
                  ? keyword
                    ? `/search/${keyword}/page/${x + 1}`
                    : `/page/${x + 1}`
                  : `/productlist/${x + 1}`
              }
            >
              <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
            </LinkContainer>
          ))}
        </Pagination>
      )}
    </>
  );
};

export default Paginate;

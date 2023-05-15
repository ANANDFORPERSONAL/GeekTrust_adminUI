import React, { useState } from "react";

const Pagination = ({ itemsPerPage, totalItems, paginate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleClick = (number) => {
    setCurrentPage(number);
    paginate(number);
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      paginate(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1);
      paginate(currentPage + 1);
    }
  };

  const handleFirstPageClick = () => {
    setCurrentPage(1);
    paginate(1);
  };

  const handleLastPageClick = () => {
    setCurrentPage(pageNumbers.length);
    paginate(pageNumbers.length);
  };

  return (
    <nav>
      <ul className="pagination">
        <li className="page-item">
          <button className="page-link" onClick={handleFirstPageClick}>
            First
          </button>
        </li>
        <li className="page-item">
          <button className="page-link" onClick={handlePrevClick}>
            Previous
          </button>
        </li>
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${currentPage === number ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => handleClick(number)}>
              {number}
            </button>
          </li>
        ))}
        <li className="page-item">
          <button className="page-link" onClick={handleNextClick}>
            Next
          </button>
        </li>
        <li className="page-item">
          <button className="page-link" onClick={handleLastPageClick}>
            Last
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;

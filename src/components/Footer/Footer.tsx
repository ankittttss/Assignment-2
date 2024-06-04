import React from 'react';
import './Footer.css';

export interface FooterProps {
  totalPages: number;
  page: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  handleLimitChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  limit: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const Footer: React.FC<FooterProps> = ({
  totalPages,
  page,
  handlePreviousPage,
  handleNextPage,
  handleLimitChange,
  limit,
  setPage,
}) => {
  return (
    <div className="footer">
      <div className="pagination-limit-container">
        <div className="pagination-scroll">
          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={page === 1}>
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                disabled={page === i + 1}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={handleNextPage} disabled={page === totalPages}>
              Next
            </button>
          </div>
        </div>
        <div className="limit">
          <label htmlFor="limit-select">Limit:</label>
          <select
            id="limit-select"
            value={limit}
            onChange={handleLimitChange}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Footer;

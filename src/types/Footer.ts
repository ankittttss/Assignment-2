export interface FooterProps {
    totalPages: number;
    page: number;
    handlePreviousPage: () => void;
    handleNextPage: () => void;
    handleLimitChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    limit: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
  }
import Link from "next/link";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationControls({ currentPage, totalPages }: PaginationControlsProps) {
  return (
    <div className="pagination flex justify-between mt-4">
      {currentPage > 1 ? (
        <Link
          href={`/?page=${currentPage - 1}`}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Previous
        </Link>
      ) : (
        <div />
      )}
      <span className="px-4 py-2">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages ? (
        <Link
          href={`/?page=${currentPage + 1}`}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}

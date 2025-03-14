"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationProps } from "@/models/PaginationProps";

export const Pagination = ({
  itemsPerPage = 10,
  children,
}: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalItems = children.length;
  const pageCount = itemsPerPage > 0 ? Math.ceil(totalItems / itemsPerPage) : 0;
  const currentItems = children.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="p-4">
      <div>{currentItems}</div>
      <nav aria-label="Paginering" className="mt-10">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => currentPage > 0 && setCurrentPage(currentPage - 1)}
            disabled={currentPage === 0}
            aria-label="Föregående sida"
            className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none disabled:opacity-50"
          >
            <ChevronLeft size={16} color="currentColor" strokeWidth={1.75} />
          </button>
          {[...Array(pageCount)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page - 1)}
                aria-label={`Gå till sida ${page}`}
                className={`flex items-center justify-center w-8 h-8 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none ${
                  currentPage + 1 === page ? "bg-gray-200" : ""
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() =>
              currentPage < pageCount - 1 && setCurrentPage(currentPage + 1)
            }
            disabled={currentPage >= pageCount - 1}
            aria-label="Nästa sida"
            className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none disabled:opacity-50"
          >
            <ChevronRight size={16} color="currentColor" strokeWidth={1.75} />
          </button>
        </div>
        <div className="mt-2 text-sm text-gray-600 text-center">
          Sida {currentPage + 1} av {pageCount}
        </div>
      </nav>
      <div className="mt-2 text-sm text-gray-400">
        Visar {currentPage * itemsPerPage + 1} -{" "}
        {Math.min((currentPage + 1) * itemsPerPage, totalItems)} av {totalItems}{" "}
        sökresultat.
      </div>
    </div>
  );
};

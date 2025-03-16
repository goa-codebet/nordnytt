"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface PaginatorProps {
  page: number;
  total: number;
  containerClass?: string;
  buttonClass?: string;
  infoClass?: string;
}

// button width is 30px
const styles = {
  container: "mt-4 mb-4 flex items-center justify-between",
  button:
    "px-4 py-2 bg-gray-200 text-sm min-w-32 text-center hover:bg-gray-300 transition-colors",
  buttonDisabled: "opacity-50 cursor-not-allowed bg-gray-100",
  info: "text-slate-500 text-sm",
};

export default function Paginator({
  page,
  total,
  containerClass = styles.container,
  buttonClass = styles.button,
  infoClass = styles.info,
}: PaginatorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const isPrevDisabled = page <= 1 || isPending;
  const isNextDisabled = page >= total || isPending;

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  };

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      router.push(
        `${pathname}?${createQueryString("page", newPage.toString())}`
      );
    });
  };

  return (
    <div className={containerClass}>
      <button
        onClick={() => !isPrevDisabled && handlePageChange(page - 1)}
        className={`${buttonClass} ${
          isPrevDisabled ? styles.buttonDisabled : ""
        }`}
        aria-disabled={isPrevDisabled}
        aria-label="Go to previous page"
      >
        ← Previous
      </button>
      <span className={infoClass}>
        Page {page} of {total}
      </span>
      <button
        onClick={() => !isNextDisabled && handlePageChange(page + 1)}
        className={`${buttonClass} ${
          isNextDisabled ? styles.buttonDisabled : ""
        }`}
        aria-disabled={isNextDisabled}
        aria-label="Go to next page"
      >
        Next →
      </button>
    </div>
  );
}

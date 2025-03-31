import { getTopStories } from "@/services/hn";
import { Story } from "@/types";
import { useEffect, useRef, useState } from "react";

export default function useStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [_page, setPage] = useState<number>(1);
  const getStories = async (page: number) => {
    if (loading) return;
    setLoading(true);
    const limit = 10;
    try {
      const newStories = await getTopStories(limit, (page - 1) * limit);
      setStories((prev) => {
        return [...prev, ...newStories];
      });
      setError(null);
    } catch (error) {
      setError("Kunde inte hämta stories");
    }
    setLoading(false);
  };

  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => {
            getStories(prevPage);
            const nextPage = prevPage + 1;
            return nextPage;
          });
        }
      },
      { threshold: 1 }
    );
    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }
    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [observerTarget]);

  return { stories, loading, error, observerTarget };
}

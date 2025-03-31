import { getTopStories } from "@/services/hn";
import { Story } from "@/types";
import { useEffect, useRef, useState } from "react";

export default function useStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [_page, setPage] = useState<number>(1);
  const [storiesLeft, setStoriesLeft] = useState<number | null>(null);
  const observerTarget = useRef(null);

  const getStories = async (page: number) => {
    if (loading) return;
    setLoading(true);
    const limit = 30;
    try {
      const { data, left } = await getTopStories(limit, (page - 1) * limit);
      setStories((prev) => {
        return [...prev, ...data];
      });
      setStoriesLeft(left);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Kunde inte hämta stories");
    }
    setLoading(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (storiesLeft !== null && storiesLeft <= 0) return;
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

  return { stories, storiesLeft, loading, error, observerTarget };
}

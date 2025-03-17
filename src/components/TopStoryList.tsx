"use client";

import Link from "next/link";
import { Story } from "@/types";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { getTopStories } from "@/services/hn";
import { useInView } from "react-intersection-observer"; // För infinite scroll

type TopStoryListProps = {
  initialStories: Story[];
};

const NUMBERS_OF_STORIES_TO_FETCH = 10;

export default function TopStoryList({ initialStories }: TopStoryListProps) {
  const seenStoryIds = useRef<Set<number>>(
    new Set(initialStories.map((story) => story.id))
  );

  // Kollar så det inte finns dubletter i den första batchen som hämtas
  const uniqueInitialStories = useMemo(() => {
    const uniqueIds = new Set();
    return initialStories.filter((story) => {
      if (uniqueIds.has(story.id)) return false;
      uniqueIds.add(story.id);
      return true;
    });
  }, [initialStories]);

  const [stories, setStories] = useState<Story[]>(uniqueInitialStories);
  const [offset, setOffset] = useState(NUMBERS_OF_STORIES_TO_FETCH);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [clientTime, setClientTime] = useState<number | null>(null);
  const [ref, inView] = useInView();

  const loadMoreStories = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    let newOffset = offset;

    try {
      let uniqueNewStories: Story[] = [];
      let attempts = 0;
      const maxAttempts = 3;

      // Ser till att bara hämta nya storys och provar bara 3 gånger för att se om det finns fler
      while (uniqueNewStories.length === 0 && attempts < maxAttempts) {
        const apiStories = await getTopStories(
          newOffset,
          NUMBERS_OF_STORIES_TO_FETCH
        );

        if (apiStories.length === 0) {
          setHasMore(false);
          break;
        }
        // Filtrerar bort dubletter från nya storys, lägger till de unika
        uniqueNewStories = apiStories.filter(
          (story) => !seenStoryIds.current.has(story.id)
        );

        newOffset += NUMBERS_OF_STORIES_TO_FETCH;
        attempts++;
      }

      if (uniqueNewStories.length > 0) {
        uniqueNewStories.forEach((story) => seenStoryIds.current.add(story.id));

        setStories((prevStories) => [...prevStories, ...uniqueNewStories]);
      } else if (attempts >= maxAttempts) {
        setHasMore(false);
      }
      //Gjorde bara en enkel error-hantering
      setOffset(newOffset);
    } catch (error) {
      console.error("Error fetching stories:", error);
    }

    setLoading(false);
  }, [offset, loading, hasMore]);

  //Ladda mer storys när användaren scrollar ner
  useEffect(() => {
    if (inView && hasMore) {
      loadMoreStories();
    }
  }, [inView, loadMoreStories, hasMore]);

  // Se till att tiden visas efter komponenten mountas, för att undvika hydration error
  useEffect(() => {
    setClientTime(Date.now() / 1000);
  }, []);

  return (
    <main>
      {stories.map((story, index) => {
        const url = story.url ? new URL(story.url) : null;

        return (
          <div className="leading-none mb-4" key={story.id}>
            <a
              title={story.title}
              href={story.url || `/${story.id}`}
              target={url?.host ? "_blank" : ""}
              className="pb-1 whitespace-nowrap text-ellipsis overflow-hidden block font-bold visited:text-slate-500"
            >
              {index + 1}. {story.title}
            </a>
            <div className="text-xs text-slate-700">
              {url?.host ? `${url?.host} - ` : ""}{" "}
              <Link href={`/${story.id}`}>
                {story.score} poäng - {story.descendants || "Inga"} kommentarer
                -{" "}
                {clientTime !== null ? (
                  <span>
                    {Math.floor(clientTime - story.time)} sekunder sedan
                  </span>
                ) : (
                  <span>Uppdaterar sekunder...</span>
                )}
              </Link>
            </div>
          </div>
        );
      })}
      {loading && (
        <div className="flex justify-center mt-4">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      {!loading && !hasMore && (
        <p className="text-center text-sm text-gray-500 mt-4 mb-4">
          Inga fler storys att hämta
        </p>
      )}
      {hasMore && <div ref={ref} />}
    </main>
  );
}

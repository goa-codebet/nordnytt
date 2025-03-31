"use client";

import { getTopStories } from "@/services/hn";
import { Story } from "@/types";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function Stories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [page, setPage] = useState<number>(1);

  const getStories = useCallback(async (page: number) => {
    const limit = 10;
    const newStories = await getTopStories(limit, (page - 1) * limit);
    setStories((prev) => {
      return [...prev, ...newStories];
    });
  }, []);

  useEffect(() => {
    getStories(1);
  }, [getStories]);

  const handleScroll = useCallback(() => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight - 200;
    if (bottom) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        getStories(nextPage);
        return nextPage;
      });
    }
  }, [getStories]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <main>
      {stories
        ? stories.map((story, index) => {
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
                    {story.score} poäng - {story.descendants || "Inga"}{" "}
                    kommentarer - {Math.floor(Date.now() / 1000 - story.time)}{" "}
                    sekunder sedan
                  </Link>
                </div>
              </div>
            );
          })
        : "no stories"}
    </main>
  );
}

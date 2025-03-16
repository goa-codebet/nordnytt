"use client";

import Link from "next/link";
import { Story } from "@/types";
import { STORIES_PER_PAGE } from "@/lib/constants";
import { useState, useEffect } from "react";

export default function StoriesList({
  stories,
  page,
}: {
  stories: Story[];
  page: number;
}) {
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  useEffect(() => {
    setCurrentTime(Date.now() / 1000);
  }, []);

  return (
    <>
      {stories.map((story, index) => {
        const url = story.url ? new URL(story.url) : null;
        const storyIndex: number = index + 1 + (page - 1) * STORIES_PER_PAGE;

        return (
          <div className="leading-none mb-4" key={story.id}>
            <a
              title={story.title}
              href={story.url || `/${story.id}`}
              target={url?.host ? "_blank" : ""}
              className="pb-1 whitespace-nowrap text-ellipsis overflow-hidden block font-bold visited:text-slate-500"
            >
              {storyIndex}. {story.title}
            </a>
            <div className="text-xs text-slate-700">
              {url?.host ? `${url?.host} - ` : ""}{" "}
              <Link href={`/${story.id}`}>
                {story.score} poäng - {story.descendants || "Inga"} kommentarer
                -{" "}
                {currentTime
                  ? `${Math.floor(currentTime - story.time)} sekunder sedan`
                  : "Laddar..."}
              </Link>
            </div>
          </div>
        );
      })}
    </>
  );
}

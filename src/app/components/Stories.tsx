"use client";

import Link from "next/link";
import useStories from "../hooks/useStories";

export default function Stories() {
  const { stories, storiesLeft, loading, error, observerTarget } = useStories();

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
                - {Math.floor(Date.now() / 1000 - story.time)} sekunder sedan
              </Link>
            </div>
          </div>
        );
      })}
      <div ref={observerTarget}></div>
      {storiesLeft !== null && storiesLeft <= 0 && <div>Inga Stories kvar</div>}
      {loading && <div>Laddar Stories...</div>}
      {error && <div>{error}</div>}
    </main>
  );
}

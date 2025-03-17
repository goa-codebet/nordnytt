"use server"; // Gjorde denna till server component så jag kan använda den i min client

import { Comment, Story } from "@/types";

export const getTopStories = async (
  offset = 0,
  limit = 10
): Promise<Story[]> => {
  const topstories: number[] = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json",
    {
      next: {
        revalidate: 120,
      },
    }
  ).then((res) => res.json());

  return Promise.all(
    topstories.slice(offset, offset + limit).map((id) =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
        next: {
          revalidate: 120,
        },
      }).then((res) => res.json())
    )
  );
};

export const getStory = async (id: number): Promise<Story> => {
  return await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
    next: {
      revalidate: 120,
    },
  }).then((res) => res.json());
};

export const getComment = async (id: number): Promise<Comment> => {
  return await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
    next: {
      revalidate: 120,
    },
  }).then((res) => res.json());
};

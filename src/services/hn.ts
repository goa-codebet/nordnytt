import { Comment, Story } from "@/types";

export const getTopStories = async (
  limit: number = 30,
  offset: number = 0
): Promise<{ data: Story[]; left: number }> => {
  const topstories: number[] = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json",
    {
      next: {
        revalidate: 120,
      },
    }
  ).then((res) => res.json());

  const stories = await Promise.all(
    topstories.splice(offset, limit).map((id) =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
        next: {
          revalidate: 120,
        },
      }).then((res) => res.json())
    )
  );

  return { data: stories, left: topstories.length - offset - limit };
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

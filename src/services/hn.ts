import { Comment, Story } from '@/types';

export const getTopStories = async (
  start: number,
  limit: number
): Promise<Story[]> => {
  const topstories: number[] = await fetch(
    'https://hacker-news.firebaseio.com/v0/topstories.json',
    {
      next: {
        revalidate: 120,
      },
    }
  ).then((res) => res.json());

  const storiesBatch = topstories.slice(start, start + limit);

  const stories: Story[] = await Promise.all(
    storiesBatch.map((id) =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
        next: {
          revalidate: 120,
        },
      }).then((res) => res.json())
    )
  );

  return stories;
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

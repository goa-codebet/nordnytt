import { Comment, Story } from "@/types";

export const getTopStories = async (page: number, batchSize: number): Promise<Story[]> => {
    const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
    const topstories: number[] = await response.json();
    
    const start = page * batchSize;
    const end = Math.min(start + batchSize);
    const storyIds = topstories.slice(start, end);

    const stories = await Promise.all(
      storyIds.map(id => getStory(id))
    );

    return stories as Story[];
  }

  export const getStory = async (id: number): Promise<Story> => {
    const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    const story = await response.json();
    return story as Story;
  }

export const getComment = async (id:number):Promise<Comment> => {
  return await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
    next: {
      revalidate: 120
    }
  })
    .then(res => res.json());
}
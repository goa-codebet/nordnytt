import { Comment, Story } from "@/types";
export const getPaginatedStories = async (offset: number, limit: number): Promise<Story[]> => {
    const topStoriesIds: number[] = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json")
      .then(res => res.json());

    const endIndex = offset + limit;
    const storiesPromises = topStoriesIds.slice(offset, endIndex).map(id =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        .then(res => res.json())
    );
    
    return await Promise.all(storiesPromises);
};

export const getStory = async (id:number):Promise<Story> => {
  return await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
    next: {
      revalidate: 120
    }
  })
    .then(res => res.json());
}

export const getComment = async (id:number):Promise<Comment> => {
  return await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
    next: {
      revalidate: 120
    }
  })
    .then(res => res.json());
}

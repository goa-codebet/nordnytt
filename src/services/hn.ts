import { Comment, Story } from "@/types";

export const getTopStories = async (page: number, pageSize: number = 10): Promise<Story[]> => {
  const topstories: number[] = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json", {
    next: {
      revalidate: 120
    }
  }).then(res => res.json());

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return Promise.all(topstories.slice(startIndex, endIndex).map(id => 
    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
      next: {
        revalidate: 120
      }
    }).then(res => res.json())
  ));
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

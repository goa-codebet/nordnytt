import { Comment, Story } from "@/types";

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

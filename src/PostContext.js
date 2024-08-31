import { createContext, useContext, useState } from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

// 1) CREATE A CONTEXT
const PostContext = createContext();
const QueryContext = createContext();

function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");
  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  return (
    // 2) PROVIDE VALUE TO CHILD COMPONENTS
    <PostContext.Provider
      value={{
        posts: searchedPosts,
        onAddPost: handleAddPost,
        onClearPosts: handleClearPosts,
      }}
    >
      <QueryContext.Provider value={{ searchQuery, setSearchQuery }}>
        {children}
      </QueryContext.Provider>
    </PostContext.Provider>
  );
}

function usePosts() {
  const pContext = useContext(PostContext);
  if (pContext === undefined)
    throw new Error("Postcontext was used outside of the PostProvider");
  return pContext;
}

function useQuery() {
  const qContext = useContext(QueryContext);
  if (qContext === undefined)
    throw new Error("Querycontext was used outside of the PostProvider");
  return qContext;
}

export { PostProvider, usePosts, useQuery };

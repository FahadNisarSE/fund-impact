"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

import Loader from "../Loader";
import { Input } from "../ui/input";
import ErrorComponent from "../Error";
import { posts, project } from "../../../db/types";
import Link from "next/link";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function NavSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { data, error, isLoading } = useQuery({
    queryKey: ["searchResults", debouncedSearchTerm],
    queryFn: () => fetchSearchResults(debouncedSearchTerm),
    enabled: !!debouncedSearchTerm,
  });

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative ml-auto mr-4" ref={searchRef}>
      <FiSearch className="w-5 h-5 text-foreground absolute left-2 bottom-2" />

      <Input
        type="search"
        value={searchTerm}
        onChange={handleSearch}
        className="flex h-9 border border-input px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        placeholder="Search..."
      />

      {searchTerm && (
        <div className="absolute top-16 w-full min-w-[250px] min-h-[200px] bg-white shadow border rounded-2xl">
          <h3 className="text-gray-600 p-3 border-b">Search Result ...</h3>
          <div className="flex flex-col justify-center">
            {isLoading ? (
              <Loader className="w-10 h-10 block m-auto text-primary duration-700 mt-10" />
            ) : error ? (
              <ErrorComponent
                message={error.message ?? "Something went wrong."}
              />
            ) : data?.posts.length || data?.projects.length ? (
              <div>
                {data.projects.map((project) => (
                  <Link
                    // @ts-ignore
                    href={`/project/${project.project_id}`}
                    className="px-4 py-2 border-b hover:bg-gray-100 flex items-center gap-4 justify-between"
                    key={project.projectId}
                  >
                    <div>
                      <h3 className="font-semibold text-sm">{project.title}</h3>
                      <p className="text-gray-600 text-xs">
                        {project.description.slice(0, 20)}...
                      </p>
                    </div>
                    <span className="font-semibold text-sm">Project</span>
                  </Link>
                ))}
                {data.posts.map((post) => (
                  <Link
                    // @ts-ignore
                    href={`/post/${post.post_id}`}
                    className="px-4 py-2 border-b hover:bg-gray-100 flex items-center gap-4 justify-between"
                    key={post.projectId}
                  >
                    <div>
                      <h3 className="font-semibold text-sm">{post.title}</h3>
                      <p className="text-gray-600 text-xs">
                        {post.content.slice(0, 20)}...
                      </p>
                    </div>
                    <span className="font-semibold text-sm">Post</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center p-4 gap-2">
                <img src={"/no-result.svg"} alt="" className="w-20 h-20" />
                <h3 className="text-gray-600 text-center">No record found!</h3>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

async function fetchSearchResults(debouncedSearchTerm: string) {
  const response = await fetch(`/api/search?query=${debouncedSearchTerm}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.data as {
    posts: posts[];
    projects: project[];
  };
}

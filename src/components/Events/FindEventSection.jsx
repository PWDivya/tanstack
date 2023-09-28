import { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../../util/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import EventItem from "./EventItem";

export default function FindEventSection() {
  const searchElement = useRef();
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isPending, isError, error, refetch } = useQuery({
    // queryKey: ["events", { search: searchTerm }],
    queryFn: () => {
      fetchEvents(searchTerm);
    },
  });

  useEffect(() => {
    console.log("DATA>>", data);
  }, [data]);

  function handleSubmit(event) {
    event.preventDefault();
    setSearchTerm(searchElement.current.value);
  }

  let content = <p>Please enter a search term and to find events.</p>;
  if (isPending) content = <LoadingIndicator></LoadingIndicator>;
  if (isError)
    content = (
      <ErrorBlock
        title="An error occured"
        message={error.info?.message || "Failed to fetch events"}
      ></ErrorBlock>
    );

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => {
          <li key={event.id}>
            <EventItem event={event}></EventItem>
          </li>;
        })}
      </ul>
    );
  }
  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <button
          onClick={() => {
            refetch();
          }}
        >
          CLICK me
        </button>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}

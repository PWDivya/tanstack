import { useQuery } from "@tanstack/react-query";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import EventItem from "./EventItem.jsx";
import { fetchEvents } from "../../util/http.js";

const test = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events"],
    // queryFn: fetchEvents(),
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/events");

      if (!response.ok) {
        const error = new Error("An error occurred while fetching the events");
        error.code = response.status;
        error.info = await response.json();
        throw error;
      }
      const { events } = await response.json();
      // console.log("API EVENTS>>>>>>>", events);
      return events;
    },
  });

  return { data, isPending, isError, error };
};

export default function NewEventsSection() {
  // const { data, isPending, isError, error } = useQuery({
  //   queryKey: ["events"],
  //   queryfn: fetchEvents,
  // });
  const { data, isPending, isError, error } = test();
  // console.log("here", data);
  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }
  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }
  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info?.message || "Failed to fetch events"}
      />
    );
  }

  // content = test();
  // console.log("here", content);

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}

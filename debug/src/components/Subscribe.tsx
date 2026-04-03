/** @format */

import { memo, useState } from "react";
import { subscribe, unsubscribe, toast } from "@overseer-studio/sdk";

import type { OverseerEventDetail } from "@overseer-studio/sdk";
import type { ExtensionConfig } from "../types";

function Subscribe({
  extensionId,
}: Pick<OverseerEventDetail<ExtensionConfig>, "extensionId">) {
  const [value, setValue] = useState("");
  const [events, setEvents] = useState<string[]>([]);
  const [listening, setListening] = useState<string[]>([]);

  const onClear = () => {
    setEvents([]);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValue("");

    const eventName = (event.target as HTMLFormElement).elements.namedItem(
      "eventName",
    ) as HTMLInputElement;

    const type = eventName.value;
    const isListening = listening.indexOf(type) >= 0;

    if (isListening) {
      setListening((listening) => listening.filter((item) => item !== type));

      toast.info(
        `Stopped listening to ${type}`,
        "You will no longer receive events.",
      );
    } else {
      setListening((listening) => [...listening, type]);

      toast.info(
        `Listening to ${type}`,
        "To stop listening, enter the event name again.",
      );
    }

    const callback = (payload: any) => {
      setEvents((events) => [JSON.stringify({ type, payload }), ...events]);
    };

    if (isListening) {
      unsubscribe(type, callback);
    } else {
      subscribe(type, callback);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 bg-gray-300">
        <form onSubmit={onSubmit} className="flex gap-x-2 justify-center">
          <input
            type="text"
            id="eventName"
            className="text-xs flex-1 border border-gray-200 bg-white rounded-lg px-2 py-1"
            placeholder="Event name"
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <button
            type="submit"
            className="border border-gray-200 bg-gray-100 hover:bg-gray-200 transition-colors transition-200 cursor-pointer rounded-lg text-xs p-2"
          >
            Listen {listening.length > 0 ? `(${listening.length})` : ""}
          </button>
          <button
            type="reset"
            onClick={onClear}
            className="border border-gray-200 bg-gray-100 hover:bg-gray-200 transition-colors transition-200 cursor-pointer rounded-lg text-xs p-2"
          >
            Clear log
          </button>
        </form>
      </header>
      <div className="flex-1 p-4 bg-gray-900 text-xs text-gray-100 overflow-y-auto">
        <ul className="font-mono">
          {events.length === 0 ? (
            <li>Waiting for events ...</li>
          ) : (
            events.map((event, i) => <li key={i}>{event}</li>)
          )}
        </ul>
      </div>
      <footer className="p-4 bg-gray-200 flex justify-between items-center">
        <span className="text-xs font-bold">Subscribe</span>
        <span className="text-xs text-gray-700 font-light">
          ID: {extensionId}
        </span>
      </footer>
    </div>
  );
}

export default memo(Subscribe);

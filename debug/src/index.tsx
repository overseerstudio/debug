/** @format */

import { useEffect, useState } from "react";
import { onConfigChanged, onReady } from "@overseer-studio/sdk";

import { createRoot } from "react-dom/client";

import Send from "./components/Send";
import Subscribe from "./components/Subscribe";

import type { OverseerEventDetail } from "@overseer-studio/sdk";
import type { ExtensionConfig } from "./types";

const App = ({
  config: readyConfig,
  extensionId,
}: OverseerEventDetail<ExtensionConfig>) => {
  const [config, setConfig] = useState(readyConfig);

  useEffect(() => {
    // Listen to config changes
    const destroy = onConfigChanged<ExtensionConfig>(
      ({ detail: { config } }) => {
        setConfig(config);
      },
    );
    return () => {
      destroy();
    };
  }, []);

  if (config.mode === "subscribe") {
    return <Subscribe extensionId={extensionId} />;
  } else {
    return <Send extensionId={extensionId} />;
  }
};

onReady<ExtensionConfig>(({ detail: props }) => {
  const root = createRoot(document.getElementById("app") as HTMLDivElement);
  root.render(<App {...props} />);
});

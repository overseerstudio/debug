/** @format */

import { useEffect, useState } from "react";

import { createRoot } from "react-dom/client";

import Send from "./components/Send";
import Subscribe from "./components/Subscribe";

import type { OverseerEventDetail, ExtensionConfig } from "./types";

const App = ({
  config: readyConfig,
  extensionId,
}: OverseerEventDetail<ExtensionConfig>) => {
  const [config, setConfig] = useState(readyConfig);

  useEffect(() => {
    const configChanged = ({ detail: { config } }) => {
      setConfig(config);
    };

    // Listen to config changes
    window.addEventListener("overseer-config-changed", configChanged);
    return () => {
      window.removeEventListener("overseer-config-changed", configChanged);
    };
  }, []);

  console.log({ config });
  if (config.mode === "subscribe") {
    return <Subscribe extensionId={extensionId} />;
  } else {
    return <Send extensionId={extensionId} />;
  }
};

window.addEventListener(
  "overseer-ready",
  ({ detail: { config, extensionId } }) => {
    const root = createRoot(document.getElementById("app") as HTMLDivElement);
    root.render(
      <App config={config as ExtensionConfig} extensionId={extensionId} />,
    );
  },
);

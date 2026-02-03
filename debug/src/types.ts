/** @format */

declare global {
  interface Window {
    Overseer: OverseerSDK;
  }
  interface WindowEventMap {
    'overseer-config-changed': CustomEvent<OverseerEventDetail>;
    'overseer-ready': CustomEvent<OverseerEventDetail>;
  }
}

export type OverseerEventDetail<T extends object = object> = {
  config: T;
  extensionId: string;
};

export type OverseerSDK = {
  send: (module: string, event?: any) => void;
  subscribe: (module: string, callback: (state: any) => void) => () => void;
  unsubscribe: (module: string, callback: (state: any) => void) => () => void;
};

export type ExtensionConfig = {
  url: string;
  mode: 'subscribe' | 'send';
};

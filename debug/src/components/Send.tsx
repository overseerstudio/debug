/** @format */

import { memo, useState } from 'react';

import { ExtensionConfig, OverseerReadyDetail } from '../types';

function Send({ extensionId }: Omit<OverseerReadyDetail<ExtensionConfig>, 'config'>) {
  const [type, setType] = useState('');
  const [payload, setPayload] = useState('{}');

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setType('');
    setPayload('{}');

    const typeElement = (event.target as HTMLFormElement).elements.namedItem(
      'type',
    ) as HTMLInputElement;
    const payloadElement = (event.target as HTMLFormElement).elements.namedItem(
      'payload',
    ) as HTMLTextAreaElement;

    try {
      const type = typeElement.value;
      const payload = JSON.parse(payloadElement.value);
      window.Overseer.send(type, payload);
    } catch (error) {
      console.error('Invalid payload:', error);
    }
  };

  return (
    <form className="flex flex-col h-full" onSubmit={onSubmit}>
      <header className="p-4 bg-gray-300">
        <div className="flex gap-x-2 justify-center">
          <input
            type="text"
            id="type"
            className="text-xs flex-1 border border-gray-200 bg-white rounded-lg px-2 py-1"
            placeholder="Event name"
            onChange={e => setType(e.target.value)}
            value={type}
          />
          <button className="border border-gray-200 bg-gray-100 hover:bg-gray-200 transition-colors transition-200 cursor-pointer rounded-lg text-xs p-2">
            Send
          </button>
        </div>
      </header>
      <div className="flex-1 bg-gray-900 text-xs text-gray-100 overflow-y-auto">
        <textarea
          id="payload"
          onChange={e => setPayload(e.target.value)}
          className="h-full w-full resize-none p-4"
          value={payload}
        ></textarea>
      </div>
      <footer className="p-4 bg-gray-200 flex justify-between items-center">
        <span className="text-xs font-bold">Send</span>
        <span className="text-xs text-gray-700 font-light">ID: {extensionId}</span>
      </footer>
    </form>
  );
}

export default memo(Send);

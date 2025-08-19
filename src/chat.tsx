import React from "react";
import { ItemContent, Virtuoso } from "react-virtuoso";
import cn from "clsx";

import { MessageSender, type Message } from "../__generated__/resolvers-types";
import { useGetMessages } from "./hooks/use-get-messages";
import { useSendMessage } from "./hooks/use-send-message";

import css from "./chat.module.css";

const Item: React.FC<Message> = ({ text, sender }) => {
  return (
    <div className={css.item}>
      <div
        className={cn(
          css.message,
          sender === MessageSender.Admin ? css.out : css.in
        )}
      >
        {text}
      </div>
    </div>
  );
};

const getItem: ItemContent<Message, unknown> = (_, data) => {
  return <Item {...data} />;
};

export const Chat: React.FC = () => {
  const { messages, loadMoreMessages } = useGetMessages();
  const { messageText, setMessageText, handleSendMessage, sendingMessage } =
    useSendMessage();

  return (
    <div className={css.root}>
      <div className={css.container}>
        <Virtuoso
          className={css.list}
          data={messages}
          itemContent={getItem}
          endReached={loadMoreMessages}
        />
      </div>
      <form className={css.footer} onSubmit={handleSendMessage}>
        <input
          type="text"
          className={css.textInput}
          placeholder="Message text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button type="submit" disabled={sendingMessage || !messageText.trim()}>
          {sendingMessage ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

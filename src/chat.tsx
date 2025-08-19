import React from "react";
import { ItemContent, Virtuoso } from "react-virtuoso";
import cn from "clsx";

import { MessageSender, type Message } from "../__generated__/resolvers-types";
import { useMessages } from "./hooks/use-messages";

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
  const { messages, loadMoreMessages } = useMessages();

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
      <div className={css.footer}>
        <input
          type="text"
          className={css.textInput}
          placeholder="Message text"
        />
        <button>Send</button>
      </div>
    </div>
  );
};

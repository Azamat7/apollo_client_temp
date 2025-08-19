import { useState } from "react";
import { useMutation } from "@apollo/client";

import { addMessageToCache } from "./utils";
import { SEND_MESSAGE } from "../queries/messages";

export const useSendMessage = () => {
  const [messageText, setMessageText] = useState("");

  const [sendMessageMutation, { loading: sendingMessage, error }] = useMutation(
    SEND_MESSAGE,
    {
      update(cache, { data }) {
        if (!data?.sendMessage) return;
        addMessageToCache(cache, data.sendMessage);
      },
      onError: (error) => {
        console.error("Error sending message:", error);
      },
    }
  );

  const sendMessage = async (text: string) => {
    if (!text.trim() || sendingMessage) return;

    try {
      await sendMessageMutation({
        variables: { text: text.trim() },
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(messageText);
    setMessageText("");
  };

  return {
    messageText,
    setMessageText,
    sendMessage,
    handleSendMessage,
    sendingMessage,
    error,
  };
};

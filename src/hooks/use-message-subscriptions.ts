import { useEffect } from "react";
import { useSubscription } from "@apollo/client";
import { useApolloClient } from "@apollo/client";

import { addMessageToCache, updateMessageInCache } from "./utils";
import {
  MESSAGE_ADDED_SUBSCRIPTION,
  MESSAGE_UPDATED_SUBSCRIPTION,
} from "../queries/messages";

export const useMessageSubscriptions = () => {
  const client = useApolloClient();

  const { data: newMessageData } = useSubscription(MESSAGE_ADDED_SUBSCRIPTION);

  const { data: updatedMessageData } = useSubscription(
    MESSAGE_UPDATED_SUBSCRIPTION
  );

  useEffect(() => {
    if (newMessageData?.messageAdded) {
      addMessageToCache(client.cache, newMessageData.messageAdded);
    }
  }, [newMessageData, client.cache]);

  useEffect(() => {
    if (updatedMessageData?.messageUpdated) {
      updateMessageInCache(client.cache, updatedMessageData.messageUpdated);
    }
  }, [updatedMessageData, client.cache]);

  return {
    newMessage: newMessageData?.messageAdded,
    updatedMessage: updatedMessageData?.messageUpdated,
  };
};

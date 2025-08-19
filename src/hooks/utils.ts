import { ApolloCache } from "@apollo/client";

import { DEFAULT_PAGE_SIZE } from "../hooks/constants";
import { GET_MESSAGES } from "../queries/messages";
import { Message } from "../../__generated__/resolvers-types";

export const updateMessagesCache = (
  cache: ApolloCache<any>,
  newMessage: Message
) => {
  const existingData = cache.readQuery<{
    messages: {
      edges: Array<{
        node: Message;
        cursor: string;
        __typename: string;
      }>;
      pageInfo: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor: string;
        endCursor: string;
      };
      __typename: string;
    };
  }>({
    query: GET_MESSAGES,
    variables: { first: DEFAULT_PAGE_SIZE },
  });

  if (existingData?.messages) {
    cache.writeQuery({
      query: GET_MESSAGES,
      variables: { first: DEFAULT_PAGE_SIZE },
      data: {
        messages: {
          ...existingData.messages,
          edges: [
            ...existingData.messages.edges,
            {
              node: newMessage,
              cursor: newMessage.id,
              __typename: "MessageEdge",
            },
          ],
        },
      },
    });
  }
};

import { ApolloCache } from "@apollo/client";

import { DEFAULT_PAGE_SIZE } from "../hooks/constants";
import { GET_MESSAGES } from "../queries/messages";
import { Message } from "../../__generated__/resolvers-types";

export const addMessageToCache = (
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

  if (!existingData?.messages) return;

  const messageExists = existingData.messages.edges.some(
    (edge) => edge.node.id === newMessage.id
  );

  if (messageExists) return;

  const newEdge = {
    node: newMessage,
    cursor: newMessage.id,
    __typename: "MessageEdge",
  };

  cache.writeQuery({
    query: GET_MESSAGES,
    variables: { first: DEFAULT_PAGE_SIZE },
    data: {
      messages: {
        ...existingData.messages,
        edges: [...existingData.messages.edges, newEdge],
        pageInfo: {
          ...existingData.messages.pageInfo,
          endCursor: newMessage.id,
        },
      },
    },
  });
};

export const updateMessageInCache = (
  cache: ApolloCache<any>,
  updatedMessage: Message
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

  if (!existingData?.messages) return;

  const updatedEdges = existingData.messages.edges.map((edge) => {
    if (edge.node.id === updatedMessage.id) {
      return {
        ...edge,
        node: updatedMessage,
      };
    }
    return edge;
  });

  cache.writeQuery({
    query: GET_MESSAGES,
    variables: { first: DEFAULT_PAGE_SIZE },
    data: {
      messages: {
        ...existingData.messages,
        edges: updatedEdges,
      },
    },
  });
};

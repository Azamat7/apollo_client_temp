import { useCallback, useMemo } from "react";
import { useQuery } from "@apollo/client";

import { Message } from "../../__generated__/resolvers-types";
import { GET_MESSAGES } from "../queries/messages";
import { DEFAULT_PAGE_SIZE, MESSAGES_QUERY_OPTIONS } from "./constants";

export const useGetMessages = (pageSize: number = DEFAULT_PAGE_SIZE) => {
  const { data, loading, fetchMore, error } = useQuery(GET_MESSAGES, {
    variables: { first: pageSize },
    ...MESSAGES_QUERY_OPTIONS,
  });

  const messages = useMemo(
    () =>
      data?.messages?.edges?.map((edge: { node: Message }) => edge.node) || [],
    [data]
  );

  const pageInfo = data?.messages?.pageInfo;

  const loadMoreMessages = useCallback(async () => {
    if (!pageInfo?.hasNextPage || loading) return;

    try {
      await fetchMore({
        variables: { first: pageSize, after: pageInfo.endCursor },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            messages: {
              ...fetchMoreResult.messages,
              edges: [
                ...prev.messages.edges,
                ...fetchMoreResult.messages.edges,
              ],
            },
          };
        },
      });
    } catch (err) {
      console.error("Error loading more messages:", err);
    }
  }, [fetchMore, pageInfo, loading, pageSize]);

  return {
    messages,
    loading,
    error,
    loadMoreMessages,
    hasNextPage: pageInfo?.hasNextPage,
  };
};

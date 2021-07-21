import { useEffect } from 'react';
import {
  DocumentNode,
  OperationVariables,
  QueryHookOptions,
  TypedDocumentNode,
  useQuery as useQueryApollo,
} from '@apollo/client';

function useQuery<TData = any, TVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options: QueryHookOptions<TData, TVariables> & { refetchOnWindowFocus?: boolean } = {},
) {
  const { refetchOnWindowFocus, ...originalOptions } = options;
  const queryResult = useQueryApollo(query, originalOptions);

  useEffect(() => {
    if (refetchOnWindowFocus) {
      const refetchQuery = () => queryResult.refetch();
      window.addEventListener('focus', refetchQuery);
      return () => window.removeEventListener('focus', refetchQuery);
    }
  });

  return queryResult;
}

export default useQuery;

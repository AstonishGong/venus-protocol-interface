import { QueryObserverOptions, useQuery } from 'react-query';

import getMarketHistory, {
  GetMarketHistoryInput,
  GetMarketHistoryOutput,
} from 'clients/api/queries/getMarketHistory';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetMarketHistoryOutput,
  Error,
  GetMarketHistoryOutput,
  GetMarketHistoryOutput,
  [FunctionKey.GET_MARKET_HISTORY, { vTokenId: string }]
>;

const useGetMarketHistory = (input: GetMarketHistoryInput, options?: Options) =>
  useQuery(
    [FunctionKey.GET_MARKET_HISTORY, { vTokenId: input.vTokenId }],
    () => getMarketHistory(input),
    options,
  );

export default useGetMarketHistory;

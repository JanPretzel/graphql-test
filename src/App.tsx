import { gql } from '@apollo/client';

import useQuery from './useQuery';
import './App.css';

interface Launch {
  mission_name: string;
}

interface PastLaunchesData {
  launchesPast: Launch[];
}

interface PastLaunchesVars {
  limit: number;
}

const GET_PAST_LAUNCHES = gql`
  query GetPastLaunches($limit: Int!) {
    launchesPast(limit: $limit) {
      mission_name
    }
  }
`;

function App() {
  const { loading, data } = useQuery<PastLaunchesData, PastLaunchesVars>(GET_PAST_LAUNCHES, {
    variables: { limit: 10 },
    refetchOnWindowFocus: true,
  });

  if (loading) return <div>loading...</div>;

  return <div className="App">{data && data.launchesPast.map((launch) => <div>{launch.mission_name}</div>)}</div>;
}

export default App;

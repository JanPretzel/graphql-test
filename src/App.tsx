import { gql } from '@apollo/client';

import useQuery from './useQuery';
import './App.css';
import { useState } from 'react';

interface LaunchData {
  launch: {
    id: string;
    mission_name: string;
    details: string;
  };
}

interface LaunchVars {
  id: string;
}

interface PastLaunch {
  id: string;
  mission_name: string;
}

interface PastLaunchesData {
  launchesPast: PastLaunch[];
}

interface PastLaunchesVars {
  limit: number;
}

const GET_PAST_LAUNCHES = gql`
  query GetPastLaunches($limit: Int!) {
    launchesPast(limit: $limit) {
      id
      mission_name
    }
  }
`;

const GET_LAUNCH = gql`
  query GetLaunch($id: ID!) {
    launch(id: $id) {
      id
      mission_name
      details
    }
  }
`;

function App() {
  const [selectedLaunchId, setSelectedLaunchId] = useState<string | undefined>();
  const { loading, data } = useQuery<PastLaunchesData, PastLaunchesVars>(GET_PAST_LAUNCHES, {
    variables: { limit: 10 },
    refetchOnWindowFocus: true,
  });

  const { data: launchData } = useQuery<LaunchData, LaunchVars>(GET_LAUNCH, {
    variables: { id: selectedLaunchId ?? '' },
    skip: !selectedLaunchId,
    returnPartialData: true,
  });

  if (loading) return <div>loading...</div>;

  return (
    <div className="App">
      {data &&
        data.launchesPast.map((launch) => (
          <div key={launch.mission_name} onClick={() => setSelectedLaunchId(launch.id)}>
            {launch.mission_name}
          </div>
        ))}
      <div style={{ marginTop: '50px' }}>
        <div>{launchData && launchData.launch.mission_name}</div>
        <div>{launchData && launchData.launch.details}</div>
      </div>
    </div>
  );
}

export default App;

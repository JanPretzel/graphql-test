import { useState } from 'react';
import { useQuery, gql, useClient } from 'urql';

import './App.css';

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

const PastLauncesQuery = gql`
  query GetPastLaunces($limit: Int!) {
    launchesPast(limit: $limit) {
      id
      mission_name
    }
  }
`;

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

const LaunchQuery = gql`
  query GetLaunch($id: ID!) {
    launch(id: $id) {
      id
      mission_name
      details
    }
  }
`;

function App() {
  const client = useClient();
  const [selectedLaunchId, setSelectedLaunchId] = useState<string | undefined>();
  const [{ data, fetching }] = useQuery<PastLaunchesData, PastLaunchesVars>({
    query: PastLauncesQuery,
    variables: { limit: 5 },
  });

  const [{ data: launchData }] = useQuery<LaunchData, LaunchVars>({
    query: LaunchQuery,
    variables: { id: selectedLaunchId ?? '' },
    pause: !selectedLaunchId,
  });

  if (fetching) return <div>loading...</div>;

  return (
    <div className="App">
      {data &&
        data.launchesPast.map((launch) => (
          <div
            style={{ cursor: 'pointer', padding: '5px' }}
            key={launch.mission_name}
            onClick={() => setSelectedLaunchId(launch.id)}
            onMouseOver={() => {
              client.query<LaunchData, LaunchVars>(LaunchQuery, { id: launch.id }).toPromise();
            }}
          >
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

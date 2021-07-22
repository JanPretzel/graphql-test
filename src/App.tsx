import { useState } from 'react';
import { useQuery, useClient } from 'urql';
import {
  GetLaunchQuery,
  GetLaunchQueryVariables,
  GetLaunchQueryData,
  GetPastLaunchesQuery,
  GetPastLaunchesQueryData,
  GetPastLaunchesQueryVariables,
} from './generated/graphql';

import './App.css';

function App() {
  const client = useClient();
  const [selectedLaunchId, setSelectedLaunchId] = useState<string | undefined | null>();
  const [{ data, fetching }] = useQuery<GetPastLaunchesQueryData, GetPastLaunchesQueryVariables>({
    query: GetPastLaunchesQuery,
    variables: { limit: 5 },
  });

  const [{ data: launchData }] = useQuery<GetLaunchQueryData, GetLaunchQueryVariables>({
    query: GetLaunchQuery,
    variables: { id: selectedLaunchId ?? '' },
    pause: !selectedLaunchId,
  });

  if (fetching) return <div>loading...</div>;

  return (
    <div className="App">
      {data &&
        data.launchesPast?.map((launch) => (
          <div
            style={{ cursor: 'pointer', padding: '5px' }}
            key={launch?.mission_name}
            onClick={() => setSelectedLaunchId(launch?.id)}
            onMouseOver={() => {
              if (launch?.id) {
                client
                  .query<GetLaunchQueryData, GetLaunchQueryVariables>(GetLaunchQuery, { id: launch.id })
                  .toPromise();
              }
            }}
          >
            {launch?.mission_name}
          </div>
        ))}
      <div style={{ marginTop: '50px' }}>
        <div>{launchData && launchData.launch?.mission_name}</div>
        <div>{launchData && launchData.launch?.details}</div>
      </div>
    </div>
  );
}

export default App;

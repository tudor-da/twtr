import React from 'react';
import LoginScreen from './LoginScreen';
import MainScreen from './MainScreen';
import DamlLedger from '@daml/react';
import Credentials from '../Credentials';
import { httpBaseUrl } from '../config';
const App: React.FC = () => {
    const [credentials, setCredentials] = React.useState<Credentials | undefined>();
  
    return credentials
      ? <DamlLedger
          token={credentials.token}
          party={credentials.party}
          httpBaseUrl={httpBaseUrl}
        >
          <MainScreen onLogout={() => setCredentials(undefined)}/>
        </DamlLedger>
      : <LoginScreen onLogin={setCredentials} />
  }

  export default App
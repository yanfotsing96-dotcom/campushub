import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ResourceProvider } from './context/ResourceContext';
import { CampusHubProvider } from './context/CampusHubContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CampusHubProvider>
          <ResourceProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </ResourceProvider>
        </CampusHubProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
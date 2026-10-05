import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ResourceProvider } from './context/ResourceContext';
import { CampusHubProvider } from './context/CampusHubContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CampusHubProvider>
            <ResourceProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </ResourceProvider>
          </CampusHubProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
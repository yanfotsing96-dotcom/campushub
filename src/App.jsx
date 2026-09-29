import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ResourceProvider } from './context/ResourceContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ResourceProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ResourceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
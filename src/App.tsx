import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './routes';
import { HistoryProvider } from './contexts/HistoryContext';

export default function App() {
  return (
    <AuthProvider>
      <HistoryProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </HistoryProvider>
    </AuthProvider>
  );
}
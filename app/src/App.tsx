import './style.css';

import { BrowserRouter, Route, Routes } from 'react-router';

import { Admin } from './containers/Admin';
import { Home } from './containers/Home';
import { Login } from './containers/Login';
import { AuthProvider } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { AuthenticatedUserRouteWrapper } from './routes/AuthenticatedUserRouteWrapper';

function App() {
  return (
    // Must mach the `base` in `vite.config.ts`
    <WebSocketProvider>
      <AuthProvider>
        <BrowserRouter basename="/CrowdPad">
          <Routes>
            <Route path="/" element={<AuthenticatedUserRouteWrapper />}>
              <Route index={true} path="/" element={<Home />} />
            </Route>

            {/* TODO: wrapper for admin routes */}
            <Route path="/admin" element={<Admin />} />

            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </WebSocketProvider>
  );
}

export default App;

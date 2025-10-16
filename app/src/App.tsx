import './style.css';

import { BrowserRouter, Routes, Route } from 'react-router';

import { AppPageLayout } from './components/AppPageLayout';

import { Home } from './containers/Home';
import { Admin } from './containers/Admin';

function App() {
  return (
    // Must mach the `base` in `vite.config.ts`
    <BrowserRouter basename="/CrowdPad">
      <Routes>
        <Route path="/" element={<AppPageLayout />}>
          <Route index={true} element={<Home />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

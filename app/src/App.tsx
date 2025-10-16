import './style.css';

import { BrowserRouter, Routes, Route } from 'react-router';

import { Home } from './containers/Home';
import { Admin } from './containers/Admin';

function App() {
  return (
    // Must mach the `base` in `vite.config.ts`
    <BrowserRouter basename="/CrowdPad">
      <Routes>
        <Route index={true} path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

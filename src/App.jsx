import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Simulator from './pages/Simulator';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="simulator" element={<Simulator />} />
          {/* Add future routes like AlertRegister here */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
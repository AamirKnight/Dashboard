import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Simulator from './pages/Simulator';
import Alerts from './pages/Alerts';
import GPEquipment from './components/GPEquipments';
import AIQuery from './components/Aiquery';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="equipment" element={<GPEquipment />} />
          <Route path="simulator" element={<Simulator />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="ai-query" element={<AIQuery />} />
        </Route>
      </Routes>
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          duration: 6000,
          style: { fontFamily: "'Outfit', sans-serif", fontSize: '16px' }
        }} 
      />
    </BrowserRouter>
  );
}
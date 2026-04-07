import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';

const HomePage      = lazy(() => import('./pages/HomePage'));
const CreatePage    = lazy(() => import('./pages/CreatePage'));
const PayPage       = lazy(() => import('./pages/PayPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const SuccessPage   = lazy(() => import('./pages/SuccessPage'));

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Suspense fallback={<div style={{color:'white',padding:40,textAlign:'center'}}>Loading...</div>}>
        <Routes>
          <Route path="/"            element={<HomePage />} />
          <Route path="/create"      element={<CreatePage />} />
          <Route path="/pay/:linkId" element={<PayPage />} />
          <Route path="/dashboard"   element={<DashboardPage />} />
          <Route path="/success"     element={<SuccessPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

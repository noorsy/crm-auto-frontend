import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import CustomerDetail from './components/CustomerDetail';
import Loans from './components/Loans';
import LoanDetail from './components/LoanDetail';
import CallOutcome from './components/CallOutcome';
import { ApiProvider } from './context/ApiContext';

function App() {
  return (
    <ApiProvider>
      <Router>
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
              <div className="container mx-auto px-6 py-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/customers/:id" element={<CustomerDetail />} />
                  <Route path="/loans" element={<Loans />} />
                  <Route path="/loans/:id" element={<LoanDetail />} />
                  <Route path="/call-outcomes" element={<CallOutcome />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </Router>
    </ApiProvider>
  );
}

export default App; 
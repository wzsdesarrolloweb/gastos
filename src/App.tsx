import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ExpenseTracker } from './components/ExpenseTracker';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ExpenseTracker />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

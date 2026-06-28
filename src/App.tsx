import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ShowList from '@/pages/ShowList';
import ShowEdit from '@/pages/ShowEdit';
import MessageBoard from '@/pages/MessageBoard';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/shows" replace />} />
            <Route path="/shows" element={<ShowList />} />
            <Route path="/shows/:id" element={<ShowEdit />} />
            <Route path="/messages" element={<MessageBoard />} />
            <Route path="*" element={<Navigate to="/shows" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

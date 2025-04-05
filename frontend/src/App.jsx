import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import StudentBooks from './components/StudentBooks';
import StudentBorrowings from "./components/StudentBorrowings";
import StudentAttendance from "./components/StudentAttendance";
import StudentProfile from './components/StudentProfile';
import BookManagement from './components/BookManagement';
import StudentManagement from './components/StudentManagement';
import BorrowingManagement from './components/BorrowingManagement';
import Reports from './components/Reports';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Student Routes */}
        <Route path="/student/*" element={
          <PrivateRoute role="student">
            <Routes>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="books" element={<StudentBooks />} />
              <Route path="borrowings" element={<StudentBorrowings />} />
              <Route path="attendance" element={<StudentAttendance />} />
              <Route path="profile" element={<StudentProfile />} />
            </Routes>
          </PrivateRoute>
        } />

        {/* Protected Admin Routes */}
        <Route path="/admin/*" element={
          <PrivateRoute role="admin">
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="books" element={<BookManagement />} />
              <Route path="students" element={<StudentManagement />} />
              <Route path="borrowings" element={<BorrowingManagement />} />
              <Route path="reports" element={<Reports />} />
            </Routes>
          </PrivateRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
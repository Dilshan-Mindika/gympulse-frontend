import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Members from './components/Members';
import Trainers from './components/Trainers';
import WorkoutPlans from './components/WorkoutPlans';
import Exercises from './components/Exercises';
import Equipment from './components/Equipment';
import Attendance from './components/Attendance';
import Feedback from './components/Feedback';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/members" element={<Members />} />
            <Route path="/trainers" element={<Trainers />} />
            <Route path="/workout-plans" element={<WorkoutPlans />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/feedback" element={<Feedback />} />
          </Routes>
        </div>
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
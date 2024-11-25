import { Link, useLocation } from 'react-router-dom';
import { FaUsers, FaUserTie, FaDumbbell, FaClipboardList, FaTools, FaCalendarCheck, FaComments } from 'react-icons/fa';

function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <FaDumbbell className="text-2xl" />
            <span className="font-bold text-xl">GymPulse</span>
          </Link>
          
          <div className="hidden md:flex space-x-4">
            <Link to="/members" className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/members')}`}>
              <FaUsers />
              <span>Members</span>
            </Link>
            
            <Link to="/trainers" className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/trainers')}`}>
              <FaUserTie />
              <span>Trainers</span>
            </Link>
            
            <Link to="/workout-plans" className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/workout-plans')}`}>
              <FaClipboardList />
              <span>Workout Plans</span>
            </Link>
            
            <Link to="/exercises" className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/exercises')}`}>
              <FaDumbbell />
              <span>Exercises</span>
            </Link>
            
            <Link to="/equipment" className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/equipment')}`}>
              <FaTools />
              <span>Equipment</span>
            </Link>
            
            <Link to="/attendance" className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/attendance')}`}>
              <FaCalendarCheck />
              <span>Attendance</span>
            </Link>
            
            <Link to="/feedback" className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/feedback')}`}>
              <FaComments />
              <span>Feedback</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
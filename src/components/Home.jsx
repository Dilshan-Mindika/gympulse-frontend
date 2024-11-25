import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FaUsers, FaUserTie, FaDumbbell, FaClipboardList, FaTools, FaCalendarCheck, FaComments } from 'react-icons/fa';

function StatCard({ icon: Icon, title, value, to, color }) {
  return (
    <Link 
      to={to}
      className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center space-x-4 border-l-4 ${color}`}
    >
      <div className={`p-3 rounded-lg ${color.replace('border', 'bg').replace('500', '100')}`}>
        <Icon className={`w-6 h-6 ${color.replace('border', 'text').replace('-500', '-600')}`} />
      </div>
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
    </Link>
  );
}

function Home() {
  const [stats, setStats] = useState({
    members: 0,
    trainers: 0,
    workoutPlans: 0,
    exercises: 0,
    equipment: 0,
    attendance: 0,
    feedback: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const endpoints = [
          '/Members',
          '/Trainers',
          '/WorkoutPlans',
          '/Exercises',
          '/equipment',
          '/attendance',
          '/feedbacks'
        ];

        const results = await Promise.allSettled(
          endpoints.map(endpoint => api.get(endpoint))
        );

        const newStats = {
          members: 0,
          trainers: 0,
          workoutPlans: 0,
          exercises: 0,
          equipment: 0,
          attendance: 0,
          feedback: 0
        };

        results.forEach((result, index) => {
          if (result.status === 'fulfilled' && Array.isArray(result.value?.data)) {
            const key = Object.keys(newStats)[index];
            newStats[key] = result.value.data.length;
          }
        });

        setStats(newStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Error loading dashboard data');
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <FaDumbbell className="text-3xl text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">GymPulse Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard
          icon={FaUsers}
          title="Total Members"
          value={stats.members}
          to="/members"
          color="border-blue-500"
        />
        <StatCard
          icon={FaUserTie}
          title="Total Trainers"
          value={stats.trainers}
          to="/trainers"
          color="border-green-500"
        />
        <StatCard
          icon={FaClipboardList}
          title="Workout Plans"
          value={stats.workoutPlans}
          to="/workout-plans"
          color="border-purple-500"
        />
        <StatCard
          icon={FaDumbbell}
          title="Exercises"
          value={stats.exercises}
          to="/exercises"
          color="border-red-500"
        />
        <StatCard
          icon={FaTools}
          title="Equipment"
          value={stats.equipment}
          to="/equipment"
          color="border-yellow-500"
        />
        <StatCard
          icon={FaCalendarCheck}
          title="Attendance Records"
          value={stats.attendance}
          to="/attendance"
          color="border-indigo-500"
        />
        <StatCard
          icon={FaComments}
          title="Feedback Received"
          value={stats.feedback}
          to="/feedback"
          color="border-pink-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/members" className="btn btn-primary">
              <FaUsers className="mr-2" />
              Add Member
            </Link>
            <Link to="/trainers" className="btn btn-success">
              <FaUserTie className="mr-2" />
              Add Trainer
            </Link>
            <Link to="/workout-plans" className="btn btn-primary">
              <FaClipboardList className="mr-2" />
              Create Plan
            </Link>
            <Link to="/exercises" className="btn btn-success">
              <FaDumbbell className="mr-2" />
              Add Exercise
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">System Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Members to Trainers Ratio</span>
              <span className="font-semibold text-gray-800">
                {stats.trainers ? (stats.members / stats.trainers).toFixed(1) : 0} : 1
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Plans per Member</span>
              <span className="font-semibold text-gray-800">
                {stats.members ? (stats.workoutPlans / stats.members).toFixed(1) : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Equipment per Exercise</span>
              <span className="font-semibold text-gray-800">
                {stats.exercises ? (stats.equipment / stats.exercises).toFixed(1) : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
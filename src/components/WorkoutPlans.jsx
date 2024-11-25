import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FaSearch, FaEdit, FaTrash, FaEye, FaTimes, FaClipboardList } from 'react-icons/fa';
import Card from './shared/Card';
import SearchBar from './shared/SearchBar';
import Modal from './shared/Modal';
import Button from './shared/Button';

function WorkoutPlans() {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    memberId: '',
    trainerId: '',
    startDate: '',
    endDate: '',
    strategyType: 'cardio'
  });

  useEffect(() => {
    fetchWorkoutPlans();
  }, []);

  const fetchWorkoutPlans = async () => {
    try {
      const response = await api.get('/WorkoutPlans');
      setWorkoutPlans(response.data);
    } catch (error) {
      toast.error('Error fetching workout plans');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/WorkoutPlans/${selectedPlan.id}`, formData);
        toast.success('Workout plan updated successfully');
      } else {
        await api.post('/WorkoutPlans/withStrategy', formData);
        toast.success('Workout plan created successfully');
      }
      fetchWorkoutPlans();
      resetForm();
    } catch (error) {
      toast.error(isEditing ? 'Error updating workout plan' : 'Error creating workout plan');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout plan?')) {
      try {
        await api.delete(`/WorkoutPlans/${id}`);
        toast.success('Workout plan deleted successfully');
        fetchWorkoutPlans();
      } catch (error) {
        toast.error('Error deleting workout plan');
      }
    }
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setFormData({
      memberId: plan.memberId,
      trainerId: plan.trainerId,
      startDate: plan.startDate?.split('T')[0] || '',
      endDate: plan.endDate?.split('T')[0] || '',
      strategyType: plan.strategyType || 'cardio'
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleView = (plan) => {
    setSelectedPlan(plan);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      memberId: '',
      trainerId: '',
      startDate: '',
      endDate: '',
      strategyType: 'cardio'
    });
    setIsEditing(false);
    setShowForm(false);
    setSelectedPlan(null);
  };

  const filteredPlans = workoutPlans.filter(plan =>
    plan.memberId.toString().includes(searchTerm) ||
    plan.trainerId.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <FaClipboardList className="text-2xl text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Workout Plans</h2>
        </div>
        <Button onClick={() => setShowForm(true)}>Create New Plan</Button>
      </div>

      <SearchBar
        placeholder="Search by member or trainer ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={isEditing ? 'Edit Workout Plan' : 'Create New Workout Plan'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Member ID"
            value={formData.memberId}
            onChange={(e) => setFormData({...formData, memberId: e.target.value})}
            className="input"
            required
          />
          <input
            type="text"
            placeholder="Trainer ID"
            value={formData.trainerId}
            onChange={(e) => setFormData({...formData, trainerId: e.target.value})}
            className="input"
            required
          />
          <input
            type="date"
            placeholder="Start Date"
            value={formData.startDate}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            className="input"
            required
          />
          <input
            type="date"
            placeholder="End Date"
            value={formData.endDate}
            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            className="input"
            required
          />
          <select
            value={formData.strategyType}
            onChange={(e) => setFormData({...formData, strategyType: e.target.value})}
            className="input"
            required
          >
            <option value="cardio">Cardio</option>
            <option value="strength">Strength</option>
          </select>
          <Button type="submit" className="w-full">
            {isEditing ? 'Update Plan' : 'Create Plan'}
          </Button>
        </form>
      </Modal>

      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Workout Plan Details"
      >
        {selectedPlan && (
          <div className="space-y-4">
            <p><span className="font-semibold">Plan ID:</span> {selectedPlan.id}</p>
            <p><span className="font-semibold">Member ID:</span> {selectedPlan.memberId}</p>
            <p><span className="font-semibold">Trainer ID:</span> {selectedPlan.trainerId}</p>
            <p><span className="font-semibold">Start Date:</span> {new Date(selectedPlan.startDate).toLocaleDateString()}</p>
            <p><span className="font-semibold">End Date:</span> {new Date(selectedPlan.endDate).toLocaleDateString()}</p>
            <p><span className="font-semibold">Strategy Type:</span> {selectedPlan.strategyType}</p>
          </div>
        )}
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <Card key={plan.id}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Plan #{plan.id}</h3>
                <p className="text-gray-600">Member ID: {plan.memberId}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleView(plan)}
                  className="p-2 text-blue-600 hover:text-blue-800"
                  title="View"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => handleEdit(plan)}
                  className="p-2 text-green-600 hover:text-green-800"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="p-2 text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>Trainer ID: {plan.trainerId}</p>
              <p>Start: {new Date(plan.startDate).toLocaleDateString()}</p>
              <p>End: {new Date(plan.endDate).toLocaleDateString()}</p>
              <p>Type: {plan.strategyType}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default WorkoutPlans;
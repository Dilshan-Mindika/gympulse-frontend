import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FaSearch, FaEdit, FaTrash, FaEye, FaTimes, FaDumbbell } from 'react-icons/fa';
import Card from './shared/Card';
import SearchBar from './shared/SearchBar';
import Modal from './shared/Modal';
import Button from './shared/Button';

function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    quantitySets: '',
    quantityReps: '',
    resTimeSeconds: ''
  });

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await api.get('/Exercises');
      setExercises(response.data);
    } catch (error) {
      toast.error('Error fetching exercises');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/Exercises/${selectedExercise.id}`, formData);
        toast.success('Exercise updated successfully');
      } else {
        await api.post('/Exercises', formData);
        toast.success('Exercise added successfully');
      }
      fetchExercises();
      resetForm();
    } catch (error) {
      toast.error(isEditing ? 'Error updating exercise' : 'Error adding exercise');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      try {
        await api.delete(`/Exercises/${id}`);
        toast.success('Exercise deleted successfully');
        fetchExercises();
      } catch (error) {
        toast.error('Error deleting exercise');
      }
    }
  };

  const handleEdit = (exercise) => {
    setSelectedExercise(exercise);
    setFormData({
      name: exercise.name,
      quantitySets: exercise.quantitySets,
      quantityReps: exercise.quantityReps,
      resTimeSeconds: exercise.resTimeSeconds
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleView = (exercise) => {
    setSelectedExercise(exercise);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      quantitySets: '',
      quantityReps: '',
      resTimeSeconds: ''
    });
    setIsEditing(false);
    setShowForm(false);
    setSelectedExercise(null);
  };

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <FaDumbbell className="text-2xl text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Exercises</h2>
        </div>
        <Button onClick={() => setShowForm(true)}>Add New Exercise</Button>
      </div>

      <SearchBar
        placeholder="Search exercises by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={isEditing ? 'Edit Exercise' : 'Add New Exercise'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Exercise Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="input"
            required
          />
          <input
            type="number"
            placeholder="Number of Sets"
            value={formData.quantitySets}
            onChange={(e) => setFormData({...formData, quantitySets: e.target.value})}
            className="input"
            required
          />
          <input
            type="number"
            placeholder="Number of Reps"
            value={formData.quantityReps}
            onChange={(e) => setFormData({...formData, quantityReps: e.target.value})}
            className="input"
            required
          />
          <input
            type="number"
            placeholder="Rest Time (seconds)"
            value={formData.resTimeSeconds}
            onChange={(e) => setFormData({...formData, resTimeSeconds: e.target.value})}
            className="input"
            required
          />
          <Button type="submit" className="w-full">
            {isEditing ? 'Update Exercise' : 'Add Exercise'}
          </Button>
        </form>
      </Modal>

      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Exercise Details"
      >
        {selectedExercise && (
          <div className="space-y-4">
            <p><span className="font-semibold">Name:</span> {selectedExercise.name}</p>
            <p><span className="font-semibold">Sets:</span> {selectedExercise.quantitySets}</p>
            <p><span className="font-semibold">Reps:</span> {selectedExercise.quantityReps}</p>
            <p><span className="font-semibold">Rest Time:</span> {selectedExercise.resTimeSeconds} seconds</p>
          </div>
        )}
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => (
          <Card key={exercise.id}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{exercise.name}</h3>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleView(exercise)}
                  className="p-2 text-blue-600 hover:text-blue-800"
                  title="View"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => handleEdit(exercise)}
                  className="p-2 text-green-600 hover:text-green-800"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(exercise.id)}
                  className="p-2 text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>Sets: {exercise.quantitySets}</p>
              <p>Reps: {exercise.quantityReps}</p>
              <p>Rest Time: {exercise.resTimeSeconds}s</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Exercises;
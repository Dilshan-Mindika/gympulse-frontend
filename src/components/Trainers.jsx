import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FaSearch, FaEdit, FaTrash, FaEye, FaTimes, FaUserTie } from 'react-icons/fa';

function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    phoneNumber: '',
    speciality: '',
    salary: '',
    certificationNumber: ''
  });

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await api.get('/Trainers');
      setTrainers(response.data);
    } catch (error) {
      toast.error('Error fetching trainers');
    }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/Trainers/${selectedTrainer._id}`, formData);
        toast.success('Trainer updated successfully');
    } else {
        await api.post('/Trainers', formData);
        toast.success('Trainer added successfully');
    }
    fetchTrainers();
    resetForm();
  } catch (error) {
    toast.error(isEditing ? 'Error updating trainer' : 'Error adding trainer');
  }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      try {
        await api.delete(`/Trainers/${id}`);
        toast.success('Trainer deleted successfully');
        fetchTrainers();
      } catch (error) {
        toast.error('Error deleting trainer');
      }
    }   
  };

  const handleEdit = (trainer) => {
    setSelectedTrainer(trainer);
    setFormData({
      fullName: trainer.fullName,
      email: trainer.email,
      address: trainer.address,
      phoneNumber: trainer.phoneNumber,
      speciality: trainer.speciality,
      salary: trainer.salary,
      certificationNumber: trainer.certificationNumber
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleView = (trainer) => {
    setSelectedTrainer(trainer);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      address: '',
      phoneNumber: '',
      speciality: '',
      salary: '',
      certificationNumber: ''
    });
    setIsEditing(false);
    setShowForm(false);
    setSelectedTrainer(null);
  }; 

  const filteredTrainers = trainers.filter(trainer =>
    trainer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.speciality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <FaUserTie className="text-2xl text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Trainers</h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          Add New Trainer
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search trainers by name, email, or speciality..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10"
        />
      </div>
      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {isEditing ? 'Edit Trainer' : 'Add New Trainer'}
              </h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="input"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="input"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="input"
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                className="input"
                required
              />
              <input
                type="text"
                placeholder="Speciality"
                value={formData.speciality}
                onChange={(e) => setFormData({...formData, speciality: e.target.value})}
                className="input"
                required
              />
              <input
                type="number"
                placeholder="Salary"
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                className="input"
                required
              />
              <input
                type="text"
                placeholder="Certification Number"
                value={formData.certificationNumber}
                onChange={(e) => setFormData({...formData, certificationNumber: e.target.value})}
                className="input"
                required
              />
              <button type="submit" className="btn btn-primary w-full">
                {isEditing ? 'Update Trainer' : 'Add Trainer'}
              </button>
            </form>
          </div>
        </div>
      )}

}
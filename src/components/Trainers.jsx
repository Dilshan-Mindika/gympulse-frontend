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

}
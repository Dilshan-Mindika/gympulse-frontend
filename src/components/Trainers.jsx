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

  

}
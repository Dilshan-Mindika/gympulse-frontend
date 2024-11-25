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
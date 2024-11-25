import { useState, useEffect } from "react";
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FaSearch, FaEdit, FaTrash, FaEye, FaTimes } from 'react-icons/fa';

function Members () {
    const [members, setMember] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [ showForm, setShowForm ] = useState(false);
    const [showViewModel, setShowViewModel] = useState(false);
    const [ selectMember, setSelectMember ] =useState(null);
    const [isEditing, setEditing ] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        address: '',
        phoneNumber: '',
        memberShipType: '',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        fetchMembers();
      }, []);
    
      const fetchMembers = async () => {
        try {
          const response = await api.get('/Members');
          setMembers(response.data);
        } catch (error) {
          toast.error('Error fetching members');
        }
      };
}
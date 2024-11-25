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

      const handleSubmit = asynw (e) => {
        e.preventDefauit();
        try {
            if (isEditing) {
                await api.put('/Members/${selectedMember.memberId}' ,formData) ;
                toast.success('/Member updated successfully')
            }else{
                await api.post('/MEmbers', formData);
                toast.success('/Member added successfully');
            }
            fetchMembers ();
            restForm();
        } catch (error) {
            toast.error(isEditing ?  'Error updating member' : 'Error adding member');
        }
      };

      const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this member?')) {
          try {
            await api.delete(`/Members/${id}`);
            toast.success('Member deleted successfully');
            fetchMembers();
          } catch (error) {
            toast.error('Error deleting member');
          }
        }
      };

      const handleEdit = (member) => {
        setSelectMember(member);
        setFormData({
            fullName: member.fullName,
            email: member.email,
            address: member.address,
            phoneNumber:member.phoneNumber,
            memberShpipType: member.memberShipType,
            startDate: member.StartData?.split('T')[0] || '',
            endDate:member.endDate?.split('T')[0] || '',
         });
         setIsEditing(true);
         setShowForm(true);
      };


      const handleView = (member) => {
        setSelectedMember(member);
        setShowViewModal(true);
      };

      const resetForm = () => {
        setFormData({
            fullName: '',
            email: '',
            address: '',
            phoneNumber: '',
            memberShipType: '',
            startDate: '',
            endDate: '',
        });

        const filteredMembers = members.filter(member =>
            member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase())
          );

          return (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Members</h2>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary"
                >
                  Add New Member
                </button>
              </div>  


              <div className="relative">
                <FaSearch className = "absolute left-3 top-3 text-gray-400" />
                <input
                type = "text"
                placeholder = "Search members..."
                value = {searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input p1-10"
                />
              </div>
              </div>


              


        
      }
}
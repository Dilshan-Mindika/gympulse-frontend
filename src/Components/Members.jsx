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

              //* search Bar *// 
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

              {/* Form */}
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {isEditing ? 'Edit Member' : 'Add New Member'}
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
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="input"
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="input"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                className="input"
              />
              <input
                type="text"
                placeholder="Membership Type"
                value={formData.memberShipType}
                onChange={(e) => setFormData({...formData, memberShipType: e.target.value})}
                className="input"
              />
              <input
                type="date"
                placeholder="Start Date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="input"
              />
              <input
                type="date"
                placeholder="End Date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="input"
              />
              <button type="submit" className="btn btn-primary w-full">
                {isEditing ? 'Update Member' : 'Add Member'}
              </button>
            </form>
          </div>
        </div>
      )}



              


        
      }
}
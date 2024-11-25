import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FaSearch, FaEdit, FaTrash, FaEye, FaTimes } from 'react-icons/fa';

function Members() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    phoneNumber: '',
    memberShipType: '',
    startDate: '',
    endDate: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/Members/${selectedMember.memberId}`, formData);
        toast.success('Member updated successfully');
      } else {
        await api.post('/Members', formData);
        toast.success('Member added successfully');
      }
      fetchMembers();
      resetForm();
    } catch (error) {
      toast.error(isEditing ? 'Error updating member' : 'Error adding member');
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
    setSelectedMember(member);
    setFormData({
      fullName: member.fullName,
      email: member.email,
      address: member.address,
      phoneNumber: member.phoneNumber,
      memberShipType: member.memberShipType,
      startDate: member.startDate?.split('T')[0] || '',
      endDate: member.endDate?.split('T')[0] || ''
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
      endDate: ''
    });
    setIsEditing(false);
    setShowForm(false);
    setSelectedMember(null);
  };

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

      {/* Search Bar */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10"
        />
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

      {/* View Modal */}
      {showViewModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Member Details</h3>
              <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <div className="space-y-4">
              <p><span className="font-semibold">Name:</span> {selectedMember.fullName}</p>
              <p><span className="font-semibold">Email:</span> {selectedMember.email}</p>
              <p><span className="font-semibold">Address:</span> {selectedMember.address}</p>
              <p><span className="font-semibold">Phone:</span> {selectedMember.phoneNumber}</p>
              <p><span className="font-semibold">Membership:</span> {selectedMember.memberShipType}</p>
              <p><span className="font-semibold">Start Date:</span> {new Date(selectedMember.startDate).toLocaleDateString()}</p>
              <p><span className="font-semibold">End Date:</span> {new Date(selectedMember.endDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.memberId} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{member.fullName}</h3>
                <p className="text-gray-600">{member.email}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleView(member)}
                  className="p-2 text-blue-600 hover:text-blue-800"
                  title="View"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => handleEdit(member)}
                  className="p-2 text-green-600 hover:text-green-800"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(member.memberId)}
                  className="p-2 text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>Membership: {member.memberShipType}</p>
              <p>Phone: {member.phoneNumber}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Members;
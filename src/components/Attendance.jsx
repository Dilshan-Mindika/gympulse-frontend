import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FaSearch, FaEdit, FaTrash, FaEye, FaTimes, FaCalendarCheck } from 'react-icons/fa';
import Card from './shared/Card';
import SearchBar from './shared/SearchBar';
import Modal from './shared/Modal';
import Button from './shared/Button';

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    memberId: '',
    timeSlotId: '',
    date: '',
    attended: true
  });

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await api.get('/attendance');
      setAttendance(response.data);
    } catch (error) {
      toast.error('Error fetching attendance records');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/attendance/${selectedRecord.id}`, formData);
        toast.success('Attendance record updated successfully');
      } else {
        await api.post('/attendance', formData);
        toast.success('Attendance recorded successfully');
      }
      fetchAttendance();
      resetForm();
    } catch (error) {
      toast.error(isEditing ? 'Error updating attendance record' : 'Error recording attendance');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await api.delete(`/attendance/${id}`);
        toast.success('Attendance record deleted successfully');
        fetchAttendance();
      } catch (error) {
        toast.error('Error deleting attendance record');
      }
    }
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setFormData({
      memberId: record.memberId,
      timeSlotId: record.timeSlotId,
      date: record.date?.split('T')[0] || '',
      attended: record.attended
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      memberId: '',
      timeSlotId: '',
      date: '',
      attended: true
    });
    setIsEditing(false);
    setShowForm(false);
    setSelectedRecord(null);
  };

  const filteredRecords = attendance.filter(record =>
    record.memberId.toString().includes(searchTerm) ||
    record.timeSlotId.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FaCalendarCheck className="text-2xl text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Attendance</h2>
        </div>
        <Button onClick={() => setShowForm(true)}>Record Attendance</Button>
      </div>

      <SearchBar
        placeholder="Search by member or time slot ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={isEditing ? 'Edit Attendance Record' : 'Record Attendance'}
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
            placeholder="Time Slot ID"
            value={formData.timeSlotId}
            onChange={(e) => setFormData({...formData, timeSlotId: e.target.value})}
            className="input"
            required
          />
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="input"
            required
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.attended}
              onChange={(e) => setFormData({...formData, attended: e.target.checked})}
              className="form-checkbox"
            />
            <span>Attended</span>
          </label>
          <Button type="submit" className="w-full">
            {isEditing ? 'Update Record' : 'Record Attendance'}
          </Button>
        </form>
      </Modal>

      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Attendance Record Details"
      >
        {selectedRecord && (
          <div className="space-y-4">
            <p><span className="font-semibold">Record ID:</span> {selectedRecord.id}</p>
            <p><span className="font-semibold">Member ID:</span> {selectedRecord.memberId}</p>
            <p><span className="font-semibold">Time Slot ID:</span> {selectedRecord.timeSlotId}</p>
            <p><span className="font-semibold">Date:</span> {new Date(selectedRecord.date).toLocaleDateString()}</p>
            <p><span className="font-semibold">Status:</span> {selectedRecord.attended ? 'Present' : 'Absent'}</p>
          </div>
        )}
      </Modal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRecords.map((record) => (
          <Card key={record.id}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Record #{record.id}</h3>
                <p className="text-gray-600">Member ID: {record.memberId}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleView(record)}
                  className="p-2 text-blue-600 hover:text-blue-800"
                  title="View"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => handleEdit(record)}
                  className="p-2 text-green-600 hover:text-green-800"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(record.id)}
                  className="p-2 text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>Time Slot: {record.timeSlotId}</p>
              <p>Date: {new Date(record.date).toLocaleDateString()}</p>
              <p>Status: {record.attended ? 'Present' : 'Absent'}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Attendance;
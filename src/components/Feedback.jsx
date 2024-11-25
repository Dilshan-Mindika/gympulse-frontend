import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FaSearch, FaEdit, FaTrash, FaEye, FaTimes, FaComments } from 'react-icons/fa';
import Card from './shared/Card';
import SearchBar from './shared/SearchBar';
import Modal from './shared/Modal';
import Button from './shared/Button';

function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    memberId: '',
    trainerId: '',
    comments: '',
    rating: 5
  });

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await api.get('/feedbacks');
      setFeedbacks(response.data);
    } catch (error) {
      toast.error('Error fetching feedback');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/feedbacks/${selectedFeedback.id}`, formData);
        toast.success('Feedback updated successfully');
      } else {
        await api.post('/feedbacks', formData);
        toast.success('Feedback submitted successfully');
      }
      fetchFeedbacks();
      resetForm();
    } catch (error) {
      toast.error(isEditing ? 'Error updating feedback' : 'Error submitting feedback');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await api.delete(`/feedbacks/${id}`);
        toast.success('Feedback deleted successfully');
        fetchFeedbacks();
      } catch (error) {
        toast.error('Error deleting feedback');
      }
    }
  };

  const handleEdit = (feedback) => {
    setSelectedFeedback(feedback);
    setFormData({
      memberId: feedback.memberId,
      trainerId: feedback.trainerId,
      comments: feedback.comments,
      rating: feedback.rating
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleView = (feedback) => {
    setSelectedFeedback(feedback);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      memberId: '',
      trainerId: '',
      comments: '',
      rating: 5
    });
    setIsEditing(false);
    setShowForm(false);
    setSelectedFeedback(null);
  };

  const filteredFeedbacks = feedbacks.filter(feedback =>
    feedback.memberId.toString().includes(searchTerm) ||
    feedback.trainerId.toString().includes(searchTerm) ||
    feedback.comments.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <FaComments className="text-2xl text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Feedback</h2>
        </div>
        <Button onClick={() => setShowForm(true)}>Submit Feedback</Button>
      </div>

      <SearchBar
        placeholder="Search by member ID, trainer ID, or comments..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={isEditing ? 'Edit Feedback' : 'Submit Feedback'}
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
            placeholder="Trainer ID"
            value={formData.trainerId}
            onChange={(e) => setFormData({...formData, trainerId: e.target.value})}
            className="input"
            required
          />
          <textarea
            placeholder="Comments"
            value={formData.comments}
            onChange={(e) => setFormData({...formData, comments: e.target.value})}
            className="input min-h-[100px]"
            required
          />
          <div className="flex items-center space-x-2">
            <label className="font-medium">Rating:</label>
            <select
              value={formData.rating}
              onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
              className="input"
              required
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <Button type="submit" className="w-full">
            {isEditing ? 'Update Feedback' : 'Submit Feedback'}
          </Button>
        </form>
      </Modal>

      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Feedback Details"
      >
        {selectedFeedback && (
          <div className="space-y-4">
            <p><span className="font-semibold">Feedback ID:</span> {selectedFeedback.id}</p>
            <p><span className="font-semibold">Member ID:</span> {selectedFeedback.memberId}</p>
            <p><span className="font-semibold">Trainer ID:</span> {selectedFeedback.trainerId}</p>
            <p><span className="font-semibold">Rating:</span> {'⭐'.repeat(selectedFeedback.rating)}</p>
            <p><span className="font-semibold">Comments:</span></p>
            <p className="bg-gray-50 p-3 rounded-lg">{selectedFeedback.comments}</p>
            <p><span className="font-semibold">Date:</span> {new Date(selectedFeedback.createdAt).toLocaleDateString()}</p>
          </div>
        )}
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeedbacks.map((feedback) => (
          <Card key={feedback.id}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Feedback #{feedback.id}</h3>
                <p className="text-gray-600">Member ID: {feedback.memberId}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleView(feedback)}
                  className="p-2 text-blue-600 hover:text-blue-800"
                  title="View"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => handleEdit(feedback)}
                  className="p-2 text-green-600 hover:text-green-800"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(feedback.id)}
                  className="p-2 text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>Trainer ID: {feedback.trainerId}</p>
              <p>Rating: {'⭐'.repeat(feedback.rating)}</p>
              <p className="truncate">Comments: {feedback.comments}</p>
              <p>Date: {new Date(feedback.createdAt).toLocaleDateString()}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Feedback;
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FaSearch, FaEdit, FaTrash, FaEye, FaTimes, FaTools } from 'react-icons/fa';
import Card from './shared/Card';
import SearchBar from './shared/SearchBar';
import Modal from './shared/Modal';
import Button from './shared/Button';

function Equipment() {
  const [equipment, setEquipment] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    brand: '',
    quantity: '',
    available: true
  });

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await api.get('/equipment');
      setEquipment(response.data);
    } catch (error) {
      toast.error('Error fetching equipment');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/equipment/${selectedEquipment.id}`, formData);
        toast.success('Equipment updated successfully');
      } else {
        await api.post('/equipment', formData);
        toast.success('Equipment added successfully');
      }
      fetchEquipment();
      resetForm();
    } catch (error) {
      toast.error(isEditing ? 'Error updating equipment' : 'Error adding equipment');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await api.delete(`/equipment/${id}`);
        toast.success('Equipment deleted successfully');
        fetchEquipment();
      } catch (error) {
        toast.error('Error deleting equipment');
      }
    }
  };

  const handleEdit = (item) => {
    setSelectedEquipment(item);
    setFormData({
      name: item.name,
      type: item.type,
      brand: item.brand,
      quantity: item.quantity,
      available: item.available
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleView = (item) => {
    setSelectedEquipment(item);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      brand: '',
      quantity: '',
      available: true
    });
    setIsEditing(false);
    setShowForm(false);
    setSelectedEquipment(null);
  };

  const filteredEquipment = equipment.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <FaTools className="text-2xl text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Equipment</h2>
        </div>
        <Button onClick={() => setShowForm(true)}>Add New Equipment</Button>
      </div>

      <SearchBar
        placeholder="Search equipment by name, type, or brand..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={isEditing ? 'Edit Equipment' : 'Add New Equipment'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Equipment Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="input"
            required
          />
          <input
            type="text"
            placeholder="Type"
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="input"
            required
          />
          <input
            type="text"
            placeholder="Brand"
            value={formData.brand}
            onChange={(e) => setFormData({...formData, brand: e.target.value})}
            className="input"
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
            className="input"
            required
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.available}
              onChange={(e) => setFormData({...formData, available: e.target.checked})}
              className="form-checkbox"
            />
            <span>Available</span>
          </label>
          <Button type="submit" className="w-full">
            {isEditing ? 'Update Equipment' : 'Add Equipment'}
          </Button>
        </form>
      </Modal>

      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Equipment Details"
      >
        {selectedEquipment && (
          <div className="space-y-4">
            <p><span className="font-semibold">Name:</span> {selectedEquipment.name}</p>
            <p><span className="font-semibold">Type:</span> {selectedEquipment.type}</p>
            <p><span className="font-semibold">Brand:</span> {selectedEquipment.brand}</p>
            <p><span className="font-semibold">Quantity:</span> {selectedEquipment.quantity}</p>
            <p><span className="font-semibold">Status:</span> {selectedEquipment.available ? 'Available' : 'Not Available'}</p>
          </div>
        )}
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <Card key={item.id}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">{item.type}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleView(item)}
                  className="p-2 text-blue-600 hover:text-blue-800"
                  title="View"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-green-600 hover:text-green-800"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>Brand: {item.brand}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Status: {item.available ? 'Available' : 'Not Available'}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Equipment;
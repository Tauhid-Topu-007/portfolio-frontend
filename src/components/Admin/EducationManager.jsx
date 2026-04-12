import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import moment from 'moment';

const EducationManager = () => {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    grade: '',
    description: '',
    achievements: '',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      const { data } = await api.get('/educations');
      setEducations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching educations:', error);
      toast.error('Failed to fetch educations');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dataToSend = {
      ...formData,
      achievements: formData.achievements.split('\n').filter(a => a.trim()),
    };
    
    try {
      if (editingEdu) {
        await api.put(`/educations/${editingEdu._id}`, dataToSend);
        toast.success('Education updated successfully');
      } else {
        await api.post('/educations', dataToSend);
        toast.success('Education created successfully');
      }
      fetchEducations();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving education:', error);
      toast.error(error.response?.data?.message || 'Failed to save education');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this education?')) {
      try {
        await api.delete(`/educations/${id}`);
        toast.success('Education deleted successfully');
        fetchEducations();
      } catch (error) {
        console.error('Error deleting education:', error);
        toast.error('Failed to delete education');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      grade: '',
      description: '',
      achievements: '',
      order: 0,
      isActive: true,
    });
    setEditingEdu(null);
  };

  const editEducation = (edu) => {
    setEditingEdu(edu);
    setFormData({
      institution: edu.institution || '',
      degree: edu.degree || '',
      field: edu.field || '',
      startDate: edu.startDate ? edu.startDate.split('T')[0] : '',
      endDate: edu.endDate ? edu.endDate.split('T')[0] : '',
      isCurrent: edu.isCurrent || false,
      grade: edu.grade || '',
      description: edu.description || '',
      achievements: edu.achievements?.join('\n') || '',
      order: edu.order || 0,
      isActive: edu.isActive !== undefined ? edu.isActive : true,
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Education</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <FaPlus /> Add Education
        </button>
      </div>

      {educations.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-500">No education entries yet. Click "Add Education" to create one.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Degree</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {educations.map((edu) => (
                <tr key={edu._id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-6 py-4 font-medium">{edu.institution}</td>
                  <td className="px-6 py-4">{edu.degree} in {edu.field}</td>
                  <td className="px-6 py-4">
                    {moment(edu.startDate).format('YYYY')} - {edu.isCurrent ? 'Present' : moment(edu.endDate).format('YYYY')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${edu.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {edu.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => editEducation(edu)} className="text-blue-500 hover:text-blue-700">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(edu._id)} className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">{editingEdu ? 'Edit Education' : 'Add Education'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Institution *</label>
                  <input
                    type="text"
                    required
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Degree *</label>
                  <input
                    type="text"
                    required
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Field of Study *</label>
                <input
                  type="text"
                  required
                  value={formData.field}
                  onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    disabled={formData.isCurrent}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border disabled:opacity-50"
                  />
                </div>
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isCurrent}
                    onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked, endDate: '' })}
                  />
                  <span>I currently study here</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Grade/CGPA</label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Achievements (one per line)</label>
                <textarea
                  rows={3}
                  value={formData.achievements}
                  onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-lg border"
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Active</span>
                </label>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingEdu ? 'Update' : 'Create'} Education
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationManager;
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaExternalLinkAlt } from 'react-icons/fa';
import moment from 'moment';

const CertificateManager = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    description: '',
    skills: '',
    order: 0,
    isActive: true,
  });
  const [certFile, setCertFile] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const { data } = await api.get('/certificates');
      setCertificates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('issuer', formData.issuer);
    formDataToSend.append('issueDate', formData.issueDate);
    formDataToSend.append('expiryDate', formData.expiryDate);
    formDataToSend.append('credentialId', formData.credentialId);
    formDataToSend.append('credentialUrl', formData.credentialUrl);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('skills', JSON.stringify(formData.skills.split(',').map(s => s.trim())));
    formDataToSend.append('order', formData.order);
    formDataToSend.append('isActive', formData.isActive);
    
    if (certFile) {
      formDataToSend.append('certificateFile', certFile);
    }

    try {
      if (editingCert) {
        await api.put(`/certificates/${editingCert._id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Certificate updated successfully');
      } else {
        await api.post('/certificates', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Certificate created successfully');
      }
      fetchCertificates();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving certificate:', error);
      toast.error(error.response?.data?.message || 'Failed to save certificate');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        await api.delete(`/certificates/${id}`);
        toast.success('Certificate deleted successfully');
        fetchCertificates();
      } catch (error) {
        console.error('Error deleting certificate:', error);
        toast.error('Failed to delete certificate');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      description: '',
      skills: '',
      order: 0,
      isActive: true,
    });
    setCertFile(null);
    setEditingCert(null);
  };

  const editCertificate = (cert) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title || '',
      issuer: cert.issuer || '',
      issueDate: cert.issueDate ? cert.issueDate.split('T')[0] : '',
      expiryDate: cert.expiryDate ? cert.expiryDate.split('T')[0] : '',
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || '',
      description: cert.description || '',
      skills: cert.skills?.join(', ') || '',
      order: cert.order || 0,
      isActive: cert.isActive !== undefined ? cert.isActive : true,
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
        <h1 className="text-2xl font-bold">Manage Certificates</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <FaPlus /> Add Certificate
        </button>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-500">No certificates yet. Click "Add Certificate" to create one.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issuer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert) => (
                <tr key={cert._id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-6 py-4 font-medium">{cert.title}</td>
                  <td className="px-6 py-4">{cert.issuer}</td>
                  <td className="px-6 py-4">{moment(cert.issueDate).format('MMM YYYY')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${cert.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {cert.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => editCertificate(cert)} className="text-blue-500 hover:text-blue-700">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(cert._id)} className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button>
                      {cert.credentialUrl && (
                        <a href={cert.credentialUrl} target="_blank" className="text-green-500 hover:text-green-700">
                          <FaExternalLinkAlt />
                        </a>
                      )}
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
              <h2 className="text-2xl font-bold">{editingCert ? 'Edit Certificate' : 'Add Certificate'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Issuer *</label>
                  <input
                    type="text"
                    required
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Issue Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Credential ID</label>
                  <input
                    type="text"
                    value={formData.credentialId}
                    onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Credential URL</label>
                  <input
                    type="url"
                    value={formData.credentialUrl}
                    onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                  />
                </div>
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
                <label className="block text-sm font-medium mb-2">Skills (comma separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="React, Node.js, MongoDB"
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
              
              <div>
                <label className="block text-sm font-medium mb-2">Certificate File (PDF/Image)</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={(e) => setCertFile(e.target.files[0])}
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingCert ? 'Update' : 'Create'} Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateManager;
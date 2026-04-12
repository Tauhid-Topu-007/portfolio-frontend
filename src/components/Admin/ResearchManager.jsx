import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaFilePdf } from 'react-icons/fa';
import moment from 'moment';

const ResearchManager = () => {
  const [research, setResearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPaper, setEditingPaper] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    abstract: '',
    content: '',
    publicationVenue: '',
    publicationDate: '',
    doi: '',
    keywords: '',
    isActive: true,
  });
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    fetchResearch();
  }, []);

  const fetchResearch = async () => {
    try {
      const { data } = await api.get('/research');
      setResearch(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching research:', error);
      toast.error('Failed to fetch research papers');
      setResearch([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('authors', JSON.stringify(formData.authors.split(',').map(a => a.trim())));
    formDataToSend.append('abstract', formData.abstract);
    formDataToSend.append('content', formData.content);
    formDataToSend.append('publicationVenue', formData.publicationVenue);
    formDataToSend.append('publicationDate', formData.publicationDate);
    formDataToSend.append('doi', formData.doi);
    formDataToSend.append('keywords', JSON.stringify(formData.keywords.split(',').map(k => k.trim())));
    formDataToSend.append('isActive', formData.isActive);
    
    if (pdfFile) {
      formDataToSend.append('pdfUrl', pdfFile);
    }

    try {
      if (editingPaper) {
        await api.put(`/research/${editingPaper._id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Research paper updated successfully');
      } else {
        await api.post('/research', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Research paper created successfully');
      }
      fetchResearch();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving research paper:', error);
      toast.error(error.response?.data?.message || 'Failed to save research paper');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this research paper?')) {
      try {
        await api.delete(`/research/${id}`);
        toast.success('Research paper deleted successfully');
        fetchResearch();
      } catch (error) {
        console.error('Error deleting research paper:', error);
        toast.error('Failed to delete research paper');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      authors: '',
      abstract: '',
      content: '',
      publicationVenue: '',
      publicationDate: '',
      doi: '',
      keywords: '',
      isActive: true,
    });
    setPdfFile(null);
    setEditingPaper(null);
  };

  const editPaper = (paper) => {
    setEditingPaper(paper);
    setFormData({
      title: paper.title || '',
      authors: paper.authors?.join(', ') || '',
      abstract: paper.abstract || '',
      content: paper.content || '',
      publicationVenue: paper.publicationVenue || '',
      publicationDate: paper.publicationDate ? paper.publicationDate.split('T')[0] : '',
      doi: paper.doi || '',
      keywords: paper.keywords?.join(', ') || '',
      isActive: paper.isActive !== undefined ? paper.isActive : true,
    });
    setShowModal(true);
  };

  const safeResearch = Array.isArray(research) ? research : [];

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
        <h1 className="text-2xl font-bold">Manage Research Papers</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <FaPlus /> Add Research Paper
        </button>
      </div>

      {safeResearch.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-500">No research papers yet. Click "Add Research Paper" to create one.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Authors</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {safeResearch.map((paper) => (
                <tr key={paper._id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-6 py-4">
                    <div className="font-medium">{paper.title}</div>
                    {paper.doi && <div className="text-xs text-gray-500">DOI: {paper.doi}</div>}
                  </td>
                  <td className="px-6 py-4">{paper.authors?.slice(0, 2).join(', ')}{paper.authors?.length > 2 && '...'}</td>
                  <td className="px-6 py-4">{paper.publicationVenue}</td>
                  <td className="px-6 py-4">{paper.publicationDate ? moment(paper.publicationDate).format('YYYY') : 'N/A'}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => editPaper(paper)} className="text-blue-500 hover:text-blue-700">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(paper._id)} className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button>
                      {paper.pdfUrl && (
                        <a href={paper.pdfUrl} target="_blank" className="text-green-500 hover:text-green-700">
                          <FaFilePdf />
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
              <h2 className="text-2xl font-bold">{editingPaper ? 'Edit Research Paper' : 'Add Research Paper'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                <label className="block text-sm font-medium mb-2">Authors * (comma separated)</label>
                <input
                  type="text"
                  required
                  value={formData.authors}
                  onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                  placeholder="John Doe, Jane Smith"
                  className="w-full px-4 py-2 rounded-lg border"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Abstract *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.abstract}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Publication Venue *</label>
                  <input
                    type="text"
                    required
                    value={formData.publicationVenue}
                    onChange={(e) => setFormData({ ...formData, publicationVenue: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Publication Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.publicationDate}
                    onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">DOI</label>
                  <input
                    type="text"
                    value={formData.doi}
                    onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Keywords (comma separated)</label>
                  <input
                    type="text"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                  />
                </div>
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
                <label className="block text-sm font-medium mb-2">PDF File</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingPaper ? 'Update' : 'Create'} Research Paper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchManager;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaTrash, FaReply, FaEye, FaTimes, FaCheck } from 'react-icons/fa';

const MessageManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get('/api/messages');
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await axios.delete(`/api/messages/${id}`);
        toast.success('Message deleted successfully');
        fetchMessages();
      } catch (error) {
        console.error('Error deleting message:', error);
        toast.error('Failed to delete message');
      }
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply message');
      return;
    }
    
    try {
      await axios.post(`/api/messages/${selectedMessage._id}/reply`, { replyMessage: replyText });
      toast.success('Reply sent successfully');
      setShowReplyModal(false);
      setReplyText('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
    }
  };

  const markAsRead = async (message) => {
    if (!message.isRead) {
      try {
        await axios.get(`/api/messages/${message._id}`);
        fetchMessages();
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Messages</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">From</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {messages.map((message) => (
              <tr key={message._id} className={!message.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''}>
                <td className="px-6 py-4">
                  <div className="font-medium">{message.name}</div>
                  <div className="text-sm text-gray-500">{message.email}</div>
                </td>
                <td className="px-6 py-4">{message.subject}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(message.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {!message.isRead && (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">Unread</span>
                  )}
                  {message.isReplied && (
                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Replied</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedMessage(message);
                        markAsRead(message);
                      }}
                      className="text-green-500 hover:text-green-700"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMessage(message);
                        setShowReplyModal(true);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaReply />
                    </button>
                    <button onClick={() => handleDelete(message._id)} className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Message Modal */}
      {selectedMessage && !showReplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold">Message Details</h2>
              <button onClick={() => setSelectedMessage(null)} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">From</label>
                <p className="text-lg">{selectedMessage.name} ({selectedMessage.email})</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Subject</label>
                <p className="text-lg">{selectedMessage.subject}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Message</label>
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
              
              {selectedMessage.replyMessage && (
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Your Reply</label>
                  <p>{selectedMessage.replyMessage}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Replied on: {new Date(selectedMessage.repliedAt).toLocaleString()}
                  </p>
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowReplyModal(true);
                  }}
                  className="btn-primary"
                >
                  Reply to Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold">Reply to {selectedMessage.name}</h2>
              <button onClick={() => {
                setShowReplyModal(false);
                setReplyText('');
              }} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Reply Message</label>
                <textarea
                  rows={6}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
                  placeholder="Type your reply here..."
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setReplyText('');
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button onClick={handleReply} className="btn-primary">
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {messages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No messages yet.</p>
        </div>
      )}
    </div>
  );
};

export default MessageManager;
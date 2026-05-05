// src/components/Home/Contact.jsx
import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import { DataContext } from '../../context/DataContext';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaPaperPlane, FaSpinner, FaCheckCircle, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Contact = () => {
  const { settings, socialLinks } = useContext(DataContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await axios.post('/api/messages', data);
      toast.success('Message sent successfully!');
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: FaEnvelope, title: 'Email', value: settings?.contactEmail || 't.topu021@gmail.com', link: `mailto:${settings?.contactEmail || 't.topu021@gmail.com'}`, color: 'from-blue-500 to-blue-600', delay: 0 },
    { icon: FaPhone, title: 'Phone', value: settings?.contactPhone || '+8801400522994', link: `tel:${settings?.contactPhone || '+8801400522994'}`, color: 'from-green-500 to-green-600', delay: 0.1 },
    { icon: FaMapMarkerAlt, title: 'Location', value: settings?.address || 'Uttara, Dhaka Bangladesh', link: null, color: 'from-red-500 to-red-600', delay: 0.2 },
    { icon: FaClock, title: 'Working Hours', value: 'Mon-Fri: 9AM - 6PM', link: null, color: 'from-orange-500 to-orange-600', delay: 0.3 },
  ];

  const socials = {
    github: socialLinks?.github || settings?.socialLinks?.github,
    linkedin: socialLinks?.linkedin || settings?.socialLinks?.linkedin,
    twitter: socialLinks?.twitter || settings?.socialLinks?.twitter,
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="inline-block p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-4 shadow-lg"
          >
            <FaEnvelope className="text-2xl text-white" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Have a project in mind? I'd love to hear from you!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: info.delay }}
                viewport={{ once: true }}
                className="group flex items-start gap-4 p-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
              >
                <div className={`p-3 bg-gradient-to-br ${info.color} rounded-xl shadow-md group-hover:scale-110 transition-transform`}>
                  <info.icon className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{info.title}</h3>
                  {info.link ? (
                    <a href={info.link} className="text-gray-600 dark:text-gray-400 hover:text-purple-500 transition-colors">
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">{info.value}</p>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Social Links */}
            <div className="pt-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">Connect with me</h3>
              <div className="flex gap-3">
                {socials.github && (
                  <a href={socials.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-xl transition-all hover:scale-110 hover:text-purple-500">
                    <FaGithub size={22} />
                  </a>
                )}
                {socials.linkedin && (
                  <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-xl transition-all hover:scale-110 hover:text-blue-500">
                    <FaLinkedin size={22} />
                  </a>
                )}
                {socials.twitter && (
                  <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-xl transition-all hover:scale-110 hover:text-sky-500">
                    <FaTwitter size={22} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {submitted ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl text-center border border-gray-200 dark:border-gray-700"
              >
                <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Message Sent!</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Thank you for reaching out. I'll get back to you soon!</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Send Message</h3>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Name *</label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      placeholder="Your name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email *</label>
                    <input
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Subject *</label>
                    <input
                      {...register('subject', { required: 'Subject is required' })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      placeholder="Message subject"
                    />
                    {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Message *</label>
                    <textarea
                      {...register('message', { required: 'Message is required' })}
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      placeholder="Your message..."
                    />
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <><FaSpinner className="animate-spin" /> Sending...</> : <><FaPaperPlane /> Send Message</>}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
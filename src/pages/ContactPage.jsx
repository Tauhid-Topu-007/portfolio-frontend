// src/pages/ContactPage.jsx
import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { DataContext } from '../context/DataContext';
import NeuralBackground from '../components/NeuralBackground';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaPaperPlane, FaSpinner, FaGithub, FaLinkedin, FaTwitter, FaCheckCircle } from 'react-icons/fa';

const BACKEND_URL = 'https://portfolio-backend-2-ly21.onrender.com/api';

const ContactPage = () => {
  const { settings, socialLinks } = useContext(DataContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${BACKEND_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Message sent successfully!');
        setSubmitted(true);
        reset();
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        throw new Error(result.message || 'Failed');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Form failed. Opening email...');
      setTimeout(() => {
        window.location.href = `mailto:${settings?.contactEmail || 't.topu021@gmail.com'}?subject=${encodeURIComponent(data.subject || 'Contact')}&body=${encodeURIComponent('From: ' + data.name + '\nEmail: ' + data.email + '\n\n' + data.message)}`;
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: FaEnvelope, title: 'Email', value: settings?.contactEmail || 't.topu021@gmail.com', link: `mailto:${settings?.contactEmail || 't.topu021@gmail.com'}`, color: 'from-blue-500 to-blue-600' },
    { icon: FaPhone, title: 'Phone', value: settings?.contactPhone || '+880 1400522994', link: settings?.contactPhone ? `tel:${settings.contactPhone}` : null, color: 'from-green-500 to-green-600' },
    { icon: FaMapMarkerAlt, title: 'Location', value: settings?.address || 'Dhaka, Bangladesh', link: null, color: 'from-red-500 to-red-600' },
    { icon: FaClock, title: 'Working Hours', value: 'Mon-Fri: 9AM - 6PM', link: null, color: 'from-orange-500 to-orange-600' },
  ];

  const socials = {
    github: socialLinks?.github || settings?.socialLinks?.github,
    linkedin: socialLinks?.linkedin || settings?.socialLinks?.linkedin,
    twitter: socialLinks?.twitter || settings?.socialLinks?.twitter,
  };

  return (
    <>
      <Helmet><title>Contact Me | Portfolio</title></Helmet>

      <NeuralBackground 
        density="medium"
        primaryColor="#8B5CF6"
        secondaryColor="#3B82F6"
        accentColor="#EC4899"
        connectionOpacity={0.4}
        nodeSize={2.5}
        pulseSpeed={1.2}
      />

      <div className="relative z-10 pt-20 min-h-screen">
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="inline-block p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg"
              >
                <FaEnvelope className="text-4xl text-white" />
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                Get In Touch
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto backdrop-blur-sm bg-white/40 dark:bg-gray-900/40 rounded-2xl p-5">
                Have a project in mind? I'd love to hear from you!
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-8 pb-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">Contact Information</h2>
                {contactInfo.map((info, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group flex items-start gap-4 p-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
                  >
                    <div className={`p-3 bg-gradient-to-br ${info.color} rounded-xl shadow-md group-hover:scale-110 transition-transform`}>
                      <info.icon className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{info.title}</h3>
                      {info.link ? (
                        <a href={info.link} className="text-gray-600 dark:text-gray-400 hover:text-purple-500 transition-colors break-all">
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

                <a href={`mailto:${settings?.contactEmail || 't.topu021@gmail.com'}`}
                  className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  <FaEnvelope /> Email Me Directly
                </a>
              </motion.div>

              {/* Contact Form */}
              <motion.form
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">Send Message</h2>

                {submitted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center py-8"
                  >
                    <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Message Sent!</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Thank you for reaching out. I'll get back to you soon!</p>
                  </motion.div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Name *</label>
                      <input {...register('name', { required: 'Name is required' })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        placeholder="Your name" />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Email *</label>
                      <input type="email" {...register('email', { required: 'Email is required' })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        placeholder="your@email.com" />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Subject *</label>
                      <input {...register('subject', { required: 'Subject is required' })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        placeholder="Message subject" />
                      {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Message *</label>
                      <textarea {...register('message', { required: 'Message is required' })} rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        placeholder="Your message..." />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                    </div>

                    <button type="submit" disabled={isSubmitting}
                      className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2">
                      {isSubmitting ? <><FaSpinner className="animate-spin" /> Sending...</> : <><FaPaperPlane /> Send Message</>}
                    </button>
                  </>
                )}

                <p className="text-center text-sm text-gray-500">
                  Or <a href={`mailto:${settings?.contactEmail || 't.topu021@gmail.com'}`} className="text-purple-500 hover:text-pink-500 font-medium">email directly</a>
                </p>
              </motion.form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;
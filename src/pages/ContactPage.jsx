import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import { DataContext } from '../context/DataContext';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const ContactPage = () => {
  const { settings } = useContext(DataContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await axios.post('/api/messages', data);
      toast.success('Message sent successfully!');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: FaEnvelope, title: 'Email', value: settings?.contactEmail || 'contact@example.com', link: `mailto:${settings?.contactEmail || 'contact@example.com'}` },
    { icon: FaPhone, title: 'Phone', value: settings?.contactPhone || '+1234567890', link: `tel:${settings?.contactPhone || '+1234567890'}` },
    { icon: FaMapMarkerAlt, title: 'Location', value: settings?.address || 'New York, USA', link: null },
    { icon: FaClock, title: 'Working Hours', value: 'Mon-Fri: 9AM - 6PM', link: null },
  ];

  const socialLinks = [
    { icon: FaGithub, url: settings?.socialLinks?.github, label: 'GitHub' },
    { icon: FaLinkedin, url: settings?.socialLinks?.linkedin, label: 'LinkedIn' },
    { icon: FaTwitter, url: settings?.socialLinks?.twitter, label: 'Twitter' },
  ];

  return (
    <>
      <Helmet>
        <title>Contact Me | Portfolio</title>
        <meta name="description" content="Get in touch with me for collaborations or inquiries" />
      </Helmet>

      <div className="pt-20 min-h-screen">
        <section className="py-12 bg-gradient-to-br from-primary-500/10 to-primary-700/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Get In <span className="gradient-text">Touch</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Have a project in mind? I'd love to hear from you!
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                      <info.icon className="text-primary-500 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{info.title}</h3>
                      {info.link ? (
                        <a href={info.link} className="text-gray-600 dark:text-gray-400 hover:text-primary-500">
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Social Links */}
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <h3 className="font-semibold text-lg mb-3">Follow Me</h3>
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      social.url && (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                        >
                          <social.icon className="text-gray-600 dark:text-gray-400 text-xl hover:text-primary-500" />
                        </a>
                      )
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.form
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
              >
                <h2 className="text-2xl font-bold mb-4">Send me a message</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject *</label>
                  <input
                    {...register('subject', { required: 'Subject is required' })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Message subject"
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <textarea
                    {...register('message', { required: 'Message is required' })}
                    rows={5}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your message..."
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </motion.form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;
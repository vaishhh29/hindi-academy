import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail, 
  Phone,
  Eye,
  Trash2
} from 'lucide-react';

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  occupation: string;
  experience: string;
  goals: string;
  preferredTime: string;
  courseType: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Appointment {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  appointmentType: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  bookedAt: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const AdminPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'appointments'>('users');
  const [selectedItem, setSelectedItem] = useState<User | Appointment | null>(null);

  useEffect(() => {
    // Load data from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('signupUsers') || '[]');
    const storedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    setUsers(storedUsers);
    setAppointments(storedAppointments);
  }, []);

  const updateUserStatus = (userId: number, status: 'approved' | 'rejected') => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, status } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('signupUsers', JSON.stringify(updatedUsers));
  };

  const updateAppointmentStatus = (appointmentId: number, status: 'confirmed' | 'cancelled') => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === appointmentId ? { ...appointment, status } : appointment
    );
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  };

  const deleteUser = (userId: number) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('signupUsers', JSON.stringify(updatedUsers));
  };

  const deleteAppointment = (appointmentId: number) => {
    const updatedAppointments = appointments.filter(appointment => appointment.id !== appointmentId);
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': case 'confirmed': return 'text-green-600 bg-green-100';
      case 'rejected': case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-orange-500 to-green-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6">Admin Panel</h1>
            <p className="text-xl">
              Manage student registrations and appointments
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-6 rounded-lg shadow-lg text-center"
            >
              <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800">{users.length}</h3>
              <p className="text-gray-600">Total Registrations</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow-lg text-center"
            >
              <Calendar className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800">{appointments.length}</h3>
              <p className="text-gray-600">Total Appointments</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-lg text-center"
            >
              <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800">
                {users.filter(u => u.status === 'pending').length + 
                 appointments.filter(a => a.status === 'pending').length}
              </h3>
              <p className="text-gray-600">Pending Actions</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-lg text-center"
            >
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800">
                {users.filter(u => u.status === 'approved').length + 
                 appointments.filter(a => a.status === 'confirmed').length}
              </h3>
              <p className="text-gray-600">Approved/Confirmed</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'users'
                      ? 'border-b-2 border-orange-500 text-orange-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  Student Registrations ({users.length})
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'appointments'
                      ? 'border-b-2 border-orange-500 text-orange-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Appointments ({appointments.length})
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'users' ? (
                <div className="space-y-4">
                  {users.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No student registrations yet.</p>
                  ) : (
                    users.map((user) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-2">
                              <h3 className="text-lg font-semibold text-gray-800">
                                {user.fullName}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                {user.status}
                              </span>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Mail className="w-4 h-4 mr-2" />
                                {user.email}
                              </div>
                              <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-2" />
                                {user.phone}
                              </div>
                              <div>
                                Course: {user.courseType}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedItem(user)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {user.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateUserStatus(user.id, 'approved')}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => updateUserStatus(user.id, 'rejected')}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No appointments booked yet.</p>
                  ) : (
                    appointments.map((appointment) => (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-2">
                              <h3 className="text-lg font-semibold text-gray-800">
                                {appointment.fullName}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                              </span>
                            </div>
                            <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Mail className="w-4 h-4 mr-2" />
                                {appointment.email}
                              </div>
                              <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-2" />
                                {appointment.phone}
                              </div>
                              <div>
                                Type: {appointment.appointmentType}
                              </div>
                              <div>
                                Date: {appointment.preferredDate} at {appointment.preferredTime}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedItem(appointment)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {appointment.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => deleteAppointment(appointment.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal for viewing details */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  {'courseType' in selectedItem ? 'Student Details' : 'Appointment Details'}
                </h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                {Object.entries(selectedItem).map(([key, value]) => {
                  if (key === 'id') return null;
                  return (
                    <div key={key} className="grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </dt>
                      <dd className="text-sm text-gray-900 col-span-2">{value}</dd>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
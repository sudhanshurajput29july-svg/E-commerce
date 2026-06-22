import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileSuccess } from '../../redux/authSlice.js';
import api from '../../services/api.js';
import { User, Mail, KeyRound, Save, Eye, EyeOff, Plus, Trash2, Edit2, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';

const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  // Profile fields state
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [profileLoading, setProfileLoading] = useState(false);

  // Address book states
  const [addresses, setAddresses] = useState(userInfo?.addresses || []);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);

  // Address form fields state
  const [addrType, setAddrType] = useState('Home');
  const [addrRecipientName, setAddrRecipientName] = useState('');
  const [addrLine, setAddrLine] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrPostalCode, setAddrPostalCode] = useState('');
  const [addrCountry, setAddrCountry] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addressLoading, setAddressLoading] = useState(false);

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      return toast.error('Please enter name and email');
    }

    setProfileLoading(true);
    try {
      const res = await api.put('/users/profile', { name, email });
      dispatch(updateProfileSuccess(res.data));
      toast.success('Profile details updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error('Please fill in all password fields');
    }

    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match');
    }

    setPasswordLoading(true);
    try {
      await api.put('/auth/changepassword', { currentPassword, newPassword });
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error changing password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!addrRecipientName || !addrLine || !addrCity || !addrPostalCode || !addrCountry || !addrPhone) {
      return toast.error('Please fill in all address details');
    }

    setAddressLoading(true);

    let updatedAddresses = [...addresses];
    const newAddressObj = {
      addressType: addrType,
      recipientName: addrRecipientName,
      addressLine: addrLine,
      city: addrCity,
      postalCode: addrPostalCode,
      country: addrCountry,
      phone: addrPhone
    };

    if (editingIndex === -1) {
      updatedAddresses.push(newAddressObj);
    } else {
      updatedAddresses[editingIndex] = newAddressObj;
    }

    try {
      const res = await api.put('/users/profile', {
        name: userInfo.name,
        email: userInfo.email,
        addresses: updatedAddresses
      });
      dispatch(updateProfileSuccess(res.data));
      setAddresses(res.data.addresses || []);
      toast.success(editingIndex === -1 ? 'Address added successfully' : 'Address updated successfully');
      setIsEditingAddress(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving address');
    } finally {
      setAddressLoading(false);
    }
  };

  const handleAddressDelete = async (idx) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    const updatedAddresses = addresses.filter((_, i) => i !== idx);

    try {
      const res = await api.put('/users/profile', {
        name: userInfo.name,
        email: userInfo.email,
        addresses: updatedAddresses
      });
      dispatch(updateProfileSuccess(res.data));
      setAddresses(res.data.addresses || []);
      toast.success('Address deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting address');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Profile Management</h1>
        <p className="text-xs text-slate-400">Update your account profile details and settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Account details */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 dark:bg-slate-800 dark:border-slate-700/60 shadow-2xs space-y-4">
          <h2 className="font-bold text-sm text-slate-850 dark:text-white flex items-center">
            <User className="h-4.5 w-4.5 mr-2 text-indigo-600" /> Account Profile
          </h2>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
                <User className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
                <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-xl text-xs transition flex items-center"
            >
              <Save className="h-4 w-4 mr-2" /> Save Profile
            </button>
          </form>
        </div>

        {/* Right Column: Security/Password change */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 dark:bg-slate-800 dark:border-slate-700/60 shadow-2xs space-y-4">
          <h2 className="font-bold text-sm text-slate-850 dark:text-white flex items-center">
            <KeyRound className="h-4.5 w-4.5 mr-2 text-indigo-600" /> Security Settings
          </h2>

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-10 pr-10 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
                <KeyRound className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-indigo-600 focus:outline-none transition dark:text-slate-400"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-10 pr-10 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
                <KeyRound className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-indigo-600 focus:outline-none transition dark:text-slate-400"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-10 pr-10 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
                <KeyRound className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-indigo-600 focus:outline-none transition dark:text-slate-400"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-xl text-xs transition flex items-center"
            >
              <Save className="h-4 w-4 mr-2" /> Change Password
            </button>
          </form>
        </div>

      </div>

      {/* Address Book Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 dark:bg-slate-800 dark:border-slate-700/60 shadow-2xs space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 dark:border-slate-700">
          <h2 className="font-bold text-sm text-slate-850 dark:text-white flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-indigo-600" /> Address Book (Manage Saved Addresses)
          </h2>
          {!isEditingAddress && addresses.length < 3 && (
            <button
              onClick={() => {
                setIsEditingAddress(true);
                setEditingIndex(-1);
                setAddrType('Home');
                setAddrRecipientName(userInfo?.name || '');
                setAddrLine('');
                setAddrCity('');
                setAddrPostalCode('');
                setAddrCountry('');
                setAddrPhone('');
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-1.5 px-3 rounded-xl text-2xs transition flex items-center"
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add New Address
            </button>
          )}
        </div>

        {isEditingAddress ? (
          <form onSubmit={handleAddressSubmit} className="space-y-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-150 dark:bg-slate-900/35 dark:border-slate-700 max-w-2xl">
            <h3 className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
              {editingIndex === -1 ? 'Add New Address (Maximum 3 Addresses)' : 'Edit Saved Address'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">Address Label</label>
                <select
                  value={addrType}
                  onChange={(e) => setAddrType(e.target.value)}
                  className="w-full bg-white border border-slate-350 rounded-xl py-2 px-3 text-xs focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={addrRecipientName}
                  onChange={(e) => setAddrRecipientName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full bg-white border border-slate-350 rounded-xl py-2 px-3 text-xs focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={addrLine}
                  onChange={(e) => setAddrLine(e.target.value)}
                  placeholder="123 Main St, Apt 4"
                  className="w-full bg-white border border-slate-350 rounded-xl py-2 px-3 text-xs focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">City</label>
                <input
                  type="text"
                  required
                  value={addrCity}
                  onChange={(e) => setAddrCity(e.target.value)}
                  placeholder="New York"
                  className="w-full bg-white border border-slate-350 rounded-xl py-2 px-3 text-xs focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">Postal Code</label>
                <input
                  type="text"
                  required
                  value={addrPostalCode}
                  onChange={(e) => setAddrPostalCode(e.target.value)}
                  placeholder="10001"
                  className="w-full bg-white border border-slate-350 rounded-xl py-2 px-3 text-xs focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">Country</label>
                <input
                  type="text"
                  required
                  value={addrCountry}
                  onChange={(e) => setAddrCountry(e.target.value)}
                  placeholder="United States"
                  className="w-full bg-white border border-slate-350 rounded-xl py-2 px-3 text-xs focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-3xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={addrPhone}
                  onChange={(e) => setAddrPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full bg-white border border-slate-350 rounded-xl py-2 px-3 text-xs focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                disabled={addressLoading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-xl text-xs transition"
              >
                {addressLoading ? 'Saving...' : 'Save Address'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditingAddress(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-xl text-xs transition dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            {addresses.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No saved addresses found. Add an address to use during checkout.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {addresses.map((addr, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-150 rounded-2xl p-4 space-y-3 relative bg-slate-50/20 dark:border-slate-700/60 dark:bg-slate-900/10 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          addr.addressType === 'Home' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/25 dark:text-indigo-400' :
                          addr.addressType === 'Work' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/25 dark:text-amber-400' :
                          'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-400'
                        }`}>
                          {addr.addressType}
                        </span>
                      </div>
                      <div className="text-xs space-y-1">
                        <p className="font-extrabold text-slate-800 dark:text-slate-200">{addr.recipientName}</p>
                        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{addr.addressLine}, {addr.city}</p>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">{addr.postalCode}, {addr.country}</p>
                        <p className="text-slate-500 dark:text-slate-400 font-bold mt-1 text-[11px]">Phone: {addr.phone}</p>
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold">
                      <button
                        onClick={() => {
                          setIsEditingAddress(true);
                          setEditingIndex(idx);
                          setAddrType(addr.addressType || 'Home');
                          setAddrRecipientName(addr.recipientName || '');
                          setAddrLine(addr.addressLine || '');
                          setAddrCity(addr.city || '');
                          setAddrPostalCode(addr.postalCode || '');
                          setAddrCountry(addr.country || '');
                          setAddrPhone(addr.phone || '');
                        }}
                        className="text-indigo-600 hover:text-indigo-500 flex items-center"
                      >
                        <Edit2 className="h-3 w-3 mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleAddressDelete(idx)}
                        className="text-rose-600 hover:text-rose-500 flex items-center"
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

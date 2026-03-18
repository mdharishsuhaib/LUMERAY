import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCurrency, CURRENCIES } from '../../context/CurrencyContext';
import { User, Mail, Edit2, Save, X, Lock, Globe, Eye, EyeOff } from 'lucide-react';
import API from '../../api';

export const Settings = () => {
  const { user, updateUser } = useAuth();
  const { defaultCurrency, setDefaultCurrency } = useCurrency();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editPassword, setEditPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);
  const [currencySaved, setCurrencySaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setSaveLoading(true);

    try {
      // ✅ Call backend to update name, email, and optionally password
      const payload: any = { name: editName, email: editEmail };
      if (editPassword.trim() !== '') payload.password = editPassword;

      const res = await API.put('/user/update', payload);

      // Update local auth state so navbar/profile reflects new name/email immediately
      updateUser({ name: res.data.user.name, email: res.data.user.email });
      setSaveSuccess(true);
      setEditPassword('');
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.response?.data?.error || 'Failed to update profile. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setEditName(user?.name || '');
    setEditEmail(user?.email || '');
    setEditPassword('');
    setSaveError('');
    setIsEditing(false);
  };

  const handleSaveCurrency = () => {
    setDefaultCurrency(selectedCurrency);
    setCurrencySaved(true);
    setTimeout(() => setCurrencySaved(false), 2000);
  };

  const selectedCurrencyObj = CURRENCIES.find(c => c.code === selectedCurrency);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>

      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
          ✓ Profile updated successfully. You can now log in with your new credentials.
        </div>
      )}

      {/* ── Currency Preferences ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Currency Preferences</h2>
          <p className="text-sm text-gray-500 mt-1">
            Set your default currency. You can still choose a different currency per expense when adding one.
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={selectedCurrency}
                  onChange={(e) => { setSelectedCurrency(e.target.value); setCurrencySaved(false); }}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.symbol} {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleSaveCurrency}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium whitespace-nowrap"
              >
                <Save className="w-4 h-4" />
                {currencySaved ? 'Saved ✓' : 'Save'}
              </button>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl font-bold text-indigo-600">{selectedCurrencyObj?.symbol}</span>
            <div>
              <p className="font-medium text-gray-900">{selectedCurrencyObj?.name}</p>
              <p className="text-sm text-gray-500">
                New expenses will default to {selectedCurrencyObj?.code}. Existing expenses keep their original currency.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Profile Information ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
            <p className="text-sm text-gray-500 mt-1">
              Changes are saved to the database — updated credentials work on next login.
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-2xl font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{user?.name || 'LUMERAY User'}</h3>
              <p className="text-sm text-gray-500">Member since 2026</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                {saveError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
                    {saveError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder="Leave blank to keep current password"
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saveLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Full Name</p>
                    <p className="font-medium">{user?.name || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Email Address</p>
                    <p className="font-medium">{user?.email || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Password</p>
                    <p className="font-medium text-gray-400">••••••••</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';

export default function ProfileSettings() {
  const { user, setAccessToken } = useAuthStore();

  const [profile, setProfile] = useState({
    firstName:  user?.firstName  || '',
    lastName:   user?.lastName   || '',
    department: user?.department || '',
  });

  const [password, setPassword] = useState({
    currentPassword:  '',
    newPassword:      '',
    confirmPassword:  '',
  });

  const [savingProfile,  setSavingProfile]  = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileChange = (e) =>
    setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handlePasswordChange = (e) =>
    setPassword((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await axiosClient.patch('/users/profile', profile);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password.newPassword !== password.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setSavingPassword(true);
    try {
      await axiosClient.patch('/users/password', {
        currentPassword: password.currentPassword,
        newPassword:     password.newPassword,
      });
      toast.success('Password changed successfully');
      setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold" style={{ color: '#1E293B' }}>
          Profile Settings
        </h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>
          Manage your account details
        </p>
      </div>

      {/* Avatar */}
      <div className="bg-white rounded-2xl border p-6 mb-5"
        style={{ borderColor: '#E2E8F0' }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
            style={{ background: '#71A5DE' }}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <p className="font-semibold text-base" style={{ color: '#1E293B' }}>
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-sm capitalize" style={{ color: '#64748B' }}>
              {user?.role} · {user?.department}
            </p>
            <p className="text-sm" style={{ color: '#64748B' }}>
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Profile form */}
      <div className="bg-white rounded-2xl border p-6 mb-5"
        style={{ borderColor: '#E2E8F0' }}>
        <h2 className="font-semibold mb-5" style={{ color: '#1E293B' }}>
          Personal Information
        </h2>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'First name', name: 'firstName' },
              { label: 'Last name',  name: 'lastName'  },
            ].map(({ label, name }) => (
              <div key={name}>
                <label className="block text-xs font-medium mb-1"
                  style={{ color: '#1E293B' }}>{label}</label>
                <input type="text" name={name} value={profile[name]}
                  onChange={handleProfileChange} required
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#E2E8F0', color: '#1E293B' }}
                  onFocus={e => e.target.style.borderColor = '#71A5DE'}
                  onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1"
              style={{ color: '#1E293B' }}>Department</label>
            <input type="text" name="department" value={profile.department}
              onChange={handleProfileChange}
              placeholder="e.g. Software Engineering"
              className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
              style={{ borderColor: '#E2E8F0', color: '#1E293B' }}
              onFocus={e => e.target.style.borderColor = '#71A5DE'}
              onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
          </div>

          <button type="submit" disabled={savingProfile}
            className="py-2.5 px-6 rounded-lg text-sm font-semibold text-white transition"
            style={{ background: savingProfile ? '#5A8DC9' : '#71A5DE' }}>
            {savingProfile ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>

      {/* Password form */}
      <div className="bg-white rounded-2xl border p-6"
        style={{ borderColor: '#E2E8F0' }}>
        <h2 className="font-semibold mb-5" style={{ color: '#1E293B' }}>
          Change Password
        </h2>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {[
            { label: 'Current password',  name: 'currentPassword'  },
            { label: 'New password',      name: 'newPassword'      },
            { label: 'Confirm new password', name: 'confirmPassword' },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block text-xs font-medium mb-1"
                style={{ color: '#1E293B' }}>{label}</label>
              <input type="password" name={name} value={password[name]}
                onChange={handlePasswordChange} required
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                style={{ borderColor: '#E2E8F0', color: '#1E293B' }}
                onFocus={e => e.target.style.borderColor = '#71A5DE'}
                onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
            </div>
          ))}

          <button type="submit" disabled={savingPassword}
            className="py-2.5 px-6 rounded-lg text-sm font-semibold text-white transition"
            style={{ background: savingPassword ? '#71A5DE' : '#1E293B' }}>
            {savingPassword ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Avatar, Button, TextField, Alert } from '@mui/material';
import { getUserProfile, updateUserProfile } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ username: '', email: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const data = await getUserProfile();
        setProfile(data);
        setForm({ username: data.username, email: data.email });
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(false);    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) throw new Error('No token found');
      await updateUserProfile(form);
      setSuccess(true);
      setEditMode(false);
      setProfile({ ...profile, ...form });
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 6 }}>
      <Avatar sx={{ width: 64, height: 64, mb: 2, mx: 'auto' }}>
        {profile.username[0].toUpperCase()}
      </Avatar>
      <Typography variant="h5" align="center" gutterBottom>User Profile</Typography>
      {success && <Alert severity="success">Profile updated!</Alert>}
      {editMode ? (
        <>
          <TextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleSave} sx={{ mr: 2 }}>Save</Button>
          <Button variant="outlined" onClick={() => setEditMode(false)}>Cancel</Button>
        </>
      ) : (
        <>
          <Typography><b>Username:</b> {profile.username}</Typography>
          <Typography><b>Email:</b> {profile.email}</Typography>
          <Button variant="contained" sx={{ mt: 2, mr: 2 }} onClick={() => setEditMode(true)}>Edit</Button>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={logout}>Logout</Button>
        </>
      )}
    </Box>
  );
};

export default UserProfile;

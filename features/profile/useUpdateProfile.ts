// hooks/useUpdateProfile.ts
'use client';

import { useState } from 'react';
import { UpdateUserInput } from '@/lib/types/profile'; // ✅ Import yang benar

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (data: UpdateUserInput): Promise<any | null> => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }

      const formData = new FormData();
      
      if (data.username) formData.append('username', data.username);
      if (data.email) formData.append('email', data.email);
      if (data.password) formData.append('password', data.password);
      if (data.profile_photo) formData.append('profile_photo', data.profile_photo);

      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw {
          message: result.message || 'Gagal mengupdate profil',
          status: response.status,
          errors: result.errors,
        };
      }

      // Update localStorage
      if (result.user) {
        const currentUser = localStorage.getItem('user');
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          const updatedUser = {
            ...userData,
            name: result.user.username || userData.name,
            email: result.user.email || userData.email,
            profile_photo: result.user.profile_photo || userData.profile_photo,
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }

      return result;
    } catch (err: any) {
      setError(err.message || 'Gagal mengupdate profil');
      console.error('Update profile error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading, error };
}
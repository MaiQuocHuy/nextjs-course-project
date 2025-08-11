import { baseQueryWithReauth } from '@/lib/baseQueryWithReauth';
import { createApi } from '@reduxjs/toolkit/query/react';



interface ResetPasswordRequest {
  oldPassword: string;
  newPassword: string;
}

interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  thumbnail?: File;
  currentName?: string; // fallback
}


interface UpdateThumbnailRequest {
  thumbnail: File;
  currentName: string; // Required
}

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Settings'],
  endpoints: (builder) => ({
    resetPassword: builder.mutation<void, ResetPasswordRequest>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),

    updateProfile: builder.mutation<void, UpdateProfileRequest>({
      query: ({ name, bio, thumbnail, currentName }) => {

        const formData = new FormData();

        if (name && name.trim()) {
          formData.append('name', name.trim());
        } else {
          throw new Error('Name is required');
        }
        
        formData.append('bio', bio || '');
        
        if (thumbnail) {
          formData.append('thumbnail', thumbnail);
        }

        return {
          url: '/users/profile',
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: ['Settings'],
    }),  

    updateThumbnail: builder.mutation<void, UpdateThumbnailRequest>({
      query: ({ thumbnail, currentName }) => {
        const formData = new FormData();
        formData.append('name', currentName); 
        formData.append('bio', '');
        formData.append('thumbnail', thumbnail);
        return {
          url: '/users/profile',
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const { 
  useResetPasswordMutation, 
  useUpdateProfileMutation,
  useUpdateThumbnailMutation 
} = settingsApi;
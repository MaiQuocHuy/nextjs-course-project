import { baseQueryWithReauth } from '@/lib/baseQueryWithReauth';
import { apiResponse, ApplicationDetailResponse, ReSubmitAppplicationRequest, ReSubmitAppplicationResponse } from '@/types';
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
  bio?: string;
  currentName: string; // Required
}

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Settings' , 'InstructorApplication'],
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

        formData.append('name', name?.trim() || '');
        
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
      query: ({ thumbnail,bio, currentName }) => {
        const formData = new FormData();
        formData.append('name', currentName);
        if (bio) {formData.append('bio', bio);}
        formData.append('thumbnail', thumbnail);
        return {
          url: '/users/profile',
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: ['Settings'],
    }),

    getApplicationDetail: builder.query<apiResponse<ApplicationDetailResponse>, string>({
      query: (id) => ({
        url: `/instructor-applications/${id}`,
        method: 'GET',
      }),
      providesTags: ['InstructorApplication'],
    }),

    reSubmitApplication: builder.mutation<apiResponse<ReSubmitAppplicationResponse>, ReSubmitAppplicationRequest>({
      query: (data) => {
        const formData = new FormData();

        formData.append('portfolio', data.portfolio);

        formData.append('certificate', data.certificate);
        formData.append('cv', data.cv);
        
        if (data.other) {
          formData.append('other', data.other);
        }
        return {
          url: `/instructor-applications/documents/upload`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['InstructorApplication'],  
    }),
  }),
});

export const { 
  useResetPasswordMutation, 
  useUpdateProfileMutation,
  useUpdateThumbnailMutation,
  useGetApplicationDetailQuery,
  useReSubmitApplicationMutation,
} = settingsApi;
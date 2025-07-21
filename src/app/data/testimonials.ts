// Mock testimonials data
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

export const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Emily Rodriguez',
    role: 'Software Engineer',
    company: 'Google',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b67565b4?w=150&h=150&fit=crop&crop=face',
    content: 'The web development course completely transformed my career. The instructors are world-class and the hands-on projects gave me real-world experience.',
    rating: 5
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    role: 'Data Scientist',
    company: 'Microsoft',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    content: 'I went from zero programming knowledge to landing my dream job in data science. The course structure is perfect for beginners.',
    rating: 5
  },
  {
    id: '3',
    name: 'Sarah Chen',
    role: 'UX Designer',
    company: 'Apple',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    content: 'The UI/UX design course taught me industry-standard practices. I now design apps used by millions of people worldwide.',
    rating: 5
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'DevOps Engineer',
    company: 'Netflix',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    content: 'The DevOps course is incredibly comprehensive. I learned Docker, Kubernetes, and cloud deployment in just 3 months.',
    rating: 5
  },
  {
    id: '5',
    name: 'Lisa Park',
    role: 'Mobile Developer',
    company: 'Spotify',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    content: 'The React Native course helped me build cross-platform apps efficiently. The instructor support was exceptional.',
    rating: 5
  },
  {
    id: '6',
    name: 'James Wilson',
    role: 'Full Stack Developer',
    company: 'Airbnb',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    content: 'Best investment I ever made. The full-stack bootcamp gave me all the skills needed for modern web development.',
    rating: 5
  }
];

export const getFeaturedTestimonials = () => {
  return mockTestimonials.slice(0, 3);
};

export const getAllTestimonials = () => {
  return mockTestimonials;
};

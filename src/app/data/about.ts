// About page data
export interface CompanyValue {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface CompanyStats {
  id: string;
  value: string;
  label: string;
  description: string;
}

export interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
}

export const companyValues: CompanyValue[] = [
  {
    id: '1',
    title: 'Excellence in Education',
    description: 'We are committed to delivering the highest quality educational content and experiences that meet industry standards and exceed student expectations.',
    icon: 'Trophy'
  },
  {
    id: '2',
    title: 'Accessibility for All',
    description: 'Education should be accessible to everyone, regardless of background, location, or financial situation. We break down barriers to learning.',
    icon: 'Heart'
  },
  {
    id: '3',
    title: 'Innovation & Technology',
    description: 'We leverage cutting-edge technology and innovative teaching methods to create engaging, interactive, and effective learning experiences.',
    icon: 'Lightbulb'
  },
  {
    id: '4',
    title: 'Community & Support',
    description: 'Learning is better together. We foster a supportive community where students and instructors collaborate, share knowledge, and grow together.',
    icon: 'Users'
  },
  {
    id: '5',
    title: 'Continuous Improvement',
    description: 'We constantly evolve our platform, content, and methods based on student feedback and industry trends to stay at the forefront of education.',
    icon: 'TrendingUp'
  },
  {
    id: '6',
    title: 'Real-World Impact',
    description: 'Our courses are designed to have practical applications, helping students build skills that directly translate to career success and personal growth.',
    icon: 'Target'
  }
];

export const companyStats: CompanyStats[] = [
  {
    id: '1',
    value: '50,000+',
    label: 'Active Students',
    description: 'Students from around the world'
  },
  {
    id: '2',
    value: '200+',
    label: 'Expert Courses',
    description: 'Across multiple disciplines'
  },
  {
    id: '3',
    value: '95%',
    label: 'Success Rate',
    description: 'Students achieve their goals'
  },
  {
    id: '4',
    value: '120+',
    label: 'Countries',
    description: 'Global reach and impact'
  }
];

export const companyMilestones: Milestone[] = [
  {
    id: '1',
    year: '2019',
    title: 'SybauEducation Founded',
    description: 'Started with a vision to democratize quality education and make learning accessible to everyone, everywhere.'
  },
  {
    id: '2',
    year: '2020',
    title: 'First 1,000 Students',
    description: 'Reached our first milestone of 1,000 active students and launched our mobile learning platform.'
  },
  {
    id: '3',
    year: '2021',
    title: 'Global Expansion',
    description: 'Expanded to 50+ countries and partnered with leading tech companies for curriculum development.'
  },
  {
    id: '4',
    year: '2022',
    title: 'AI-Powered Learning',
    description: 'Introduced AI-powered personalized learning paths and adaptive assessment systems.'
  },
  {
    id: '5',
    year: '2023',
    title: '25,000+ Graduates',
    description: 'Celebrated 25,000+ successful course completions and launched our job placement program.'
  },
  {
    id: '6',
    year: '2024',
    title: 'Industry Recognition',
    description: 'Won "EdTech Innovation Award" and established partnerships with Fortune 500 companies.'
  }
];

export const getCompanyValues = () => companyValues;
export const getCompanyStats = () => companyStats;
export const getCompanyMilestones = () => companyMilestones;

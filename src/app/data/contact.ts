// Contact page data
export interface ContactInfo {
  id: string;
  type: 'email' | 'phone' | 'address' | 'social';
  icon: string;
  label: string;
  value: string;
  href?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  email: string;
  linkedin?: string;
  twitter?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export const contactInfo: ContactInfo[] = [
  {
    id: '1',
    type: 'email',
    icon: 'Mail',
    label: 'Email Us',
    value: 'hello@sybau-education.com',
    href: 'mailto:hello@sybau-education.com'
  },
  {
    id: '2',
    type: 'phone',
    icon: 'Phone',
    label: 'Call Us',
    value: '+84 888 194 225',
    href: 'tel:+84888194225'
  },
  {
    id: '3',
    type: 'address',
    icon: 'MapPin',
    label: 'Visit Us',
    value: '470 Tran Dai Nghia, Ngu Hanh Son, Da Nang, Vietnam',
    href: 'https://www.google.com/maps/place/Tr%C6%B0%E1%BB%9Dng+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+C%C3%B4ng+ngh%E1%BB%87+Th%C3%B4ng+tin+v%C3%A0+Truy%E1%BB%81n+th%C3%B4ng+Vi%E1%BB%87t+-+H%C3%A0n,+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+%C4%90%C3%A0+N%E1%BA%B5ng/@15.9752603,108.2506521,846m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3142108997dc971f:0x1295cb3d313469c9!8m2!3d15.9752603!4d108.253227!16s%2Fg%2F1yjg80dyy?entry=ttu&g_ep=EgoyMDI1MDkxNy4wIKXMDSoASAFQAw%3D%3D'
  },
  {
    id: '4',
    type: 'social',
    icon: 'Clock',
    label: 'Support Hours',
    value: 'Mon-Fri: 9AM-6PM EST',
  }
];

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Phuong Ngoc',
    title: 'Founder & CEO',
    bio: 'Former Google engineer with 10+ years in EdTech. Passionate about democratizing quality education.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
    email: 'sarah@sybau-education.com',
    linkedin: 'https://linkedin.com/in/sarahjohnson',
    twitter: 'https://twitter.com/sarahjohnson'
  },
  {
    id: '2',
    name: 'Huy Le',
    title: 'Head of Engineering',
    bio: 'Full-stack developer and tech lead with expertise in scalable learning platforms.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    email: 'huyle@sybau-education.com',
    linkedin: 'https://linkedin.com/in/huyle'
  },
  {
    id: '3',
    name: 'Huy Mai',
    title: 'Head of Content',
    bio: 'Educational content expert with a background in curriculum design and instructional technology.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
    email: 'huymai@sybau-education.com',
    linkedin: 'https://linkedin.com/in/huymai'
  },
  {
    id: '4',
    name: 'Minh Tam',
    title: 'Student Success Manager',
    bio: 'Dedicated to helping students achieve their learning goals through personalized support.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    email: 'minhtam@sybau-education.com',
    linkedin: 'https://linkedin.com/in/minhtam'
  },
  {
    id: '5',
    name: 'Son Trinh',
    title: 'Student Success Manager',
    bio: 'Dedicated to helping students achieve their learning goals through personalized support.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    email: 'minhtam@sybau-education.com',
    linkedin: 'https://linkedin.com/in/minhtam'
  }
];

export const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How do I enroll in a course?',
    answer: 'Simply browse our course catalog, select the course you want, and click "Enroll Now". You can pay securely online and get instant access to all course materials.'
  },
  {
    id: '2',
    question: 'Do you offer certificates upon completion?',
    answer: 'Yes! All our courses include a certificate of completion that you can download and share on professional networks like LinkedIn.'
  },
  {
    id: '3',
    question: 'Can I get a refund if I\'m not satisfied?',
    answer: 'We offer a 30-day money-back guarantee. If you\'re not completely satisfied with your course, contact us within 30 days for a full refund.'
  },
  {
    id: '4',
    question: 'Are the courses self-paced or scheduled?',
    answer: 'Most of our courses are self-paced, allowing you to learn at your own convenience. Some advanced courses may have live sessions or deadlines.'
  },
  {
    id: '5',
    question: 'Do you provide job placement assistance?',
    answer: 'Yes! We offer career services including resume review, interview preparation, and connections to our partner companies for job opportunities.'
  }
];

export const getContactInfo = () => contactInfo;
export const getTeamMembers = () => teamMembers;
export const getFAQs = () => faqs;

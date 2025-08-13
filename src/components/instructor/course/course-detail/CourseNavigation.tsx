import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CourseNavigationProps {
  activeSection: 'overview' | 'content' | 'reviews';
  onNavigate: (section: 'overview' | 'content' | 'reviews') => void;
}

const CourseNavigation = ({
  activeSection,
  onNavigate,
}: CourseNavigationProps) => {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b">
      <div className="flex items-center gap-4">
        {/* Back button */}
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push('/instructor/courses')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        {/* Navigator */}
        <nav className="container flex gap-4 p-4">
          {/* Overview page */}
          <Button
            variant="ghost"
            className={cn(
              'font-medium',
              activeSection === 'overview' && 'bg-secondary'
            )}
            onClick={() => onNavigate('overview')}
          >
            Overview
          </Button>

          {/* Course content page */}
          <Button
            variant="ghost"
            className={cn(
              'font-medium',
              activeSection === 'content' && 'bg-secondary'
            )}
            onClick={() => onNavigate('content')}
          >
            Content
          </Button>

          {/* Reviews page */}
          <Button
            variant="ghost"
            className={cn(
              'font-medium',
              activeSection === 'reviews' && 'bg-secondary'
            )}
            onClick={() => onNavigate('reviews')}
          >
            Reviews
          </Button>
        </nav>
      </div>
    </div>
  );
};

export default CourseNavigation;

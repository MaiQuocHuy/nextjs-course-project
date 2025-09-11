import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CourseDetailsSections } from '@/types/instructor/courses/course-details';

interface CourseNavigationProps {
  activeSection: CourseDetailsSections;
  onNavigate: (section: CourseDetailsSections) => void;
}

interface NavigateButtonProps {
  activeSection: string;
  section: CourseDetailsSections;
  onNavigate: (section: CourseDetailsSections) => void;
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
          {Object.values(CourseDetailsSections).map((section, index) => {
            return (
              <NavigateButton
                key={index}
                activeSection={activeSection}
                section={section}
                onNavigate={onNavigate}
              />
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default CourseNavigation;

const NavigateButton = ({
  activeSection,
  section,
  onNavigate,
}: NavigateButtonProps) => {
  return (
    <Button
      variant="ghost"
      className={cn('font-medium', activeSection === section && 'bg-secondary')}
      onClick={() => onNavigate(section)}
    >
      {section.charAt(0).toUpperCase() + section.slice(1)}
    </Button>
  );
};

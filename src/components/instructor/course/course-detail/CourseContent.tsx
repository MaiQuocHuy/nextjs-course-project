import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/instructor/course/course-detail/Collapsible';
import { ChevronRight, BookOpen, Video, Brain, FileText } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
// ...existing imports...
import { Edit, Trash2, Lock, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import CreateLessonsPage2 from '../create-course/create-lessons/create-lessons2';
import SectionsLessonsManager, {
  SectionWithComments,
} from '../SectionsLessonsManager';
import { useGetSectionsQuery } from '@/services/instructor/courses-api';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { loadingAnimation } from '@/utils/instructor/loading-animation';
import { createFileFromUrl } from '@/utils/instructor/create-file-from-url';

interface CourseContentProps {
  courseId: string;
}

const CourseContent = ({ courseId }: CourseContentProps) => {
  const [courseSections, setCourseSections] = useState<SectionWithComments[]>();
  const [isSetUpSections, setIsSetUpSections] = useState(false);
  const { data: sections, isLoading: isFetchingSections, isError } = useGetSectionsQuery(courseId);
  const dispatch: AppDispatch = useDispatch();

  // Loading animation
  useEffect(() => {
    if (isFetchingSections || isFetchingSections) {
      loadingAnimation(true, dispatch);
    } else {
      loadingAnimation(false, dispatch);
    }
    return () => {
      loadingAnimation(false, dispatch);
    };
  }, [isFetchingSections, isSetUpSections]);

  // Modify lesson's property from 'order' to 'orderIndex'
  useEffect(() => {
    if (sections) {
      const updateSections = async () => {
        if (sections) {          
          setIsSetUpSections(true);
          const sectionsCopy = await Promise.all(
            sections.map(async (sec: any) => ({
              ...sec,
              lessons: await Promise.all(
                sec.lessons.map(async (les: any) => {
                  const lessonsVideo = await createFileFromUrl(
                    les.video.url,
                    les.title
                  ); // Your async function here
                  return {
                    ...les,
                    orderIndex: les.order,
                    video: { ...les.video, file: lessonsVideo },
                  };
                })
              ),
            }))
          );
          // console.log(sectionsCopy);
          setIsSetUpSections(false);
          setCourseSections(sectionsCopy);
        }
      };
      updateSections();
    }
  }, [sections]);

  if (isFetchingSections || isFetchingSections) {
    return <></>;
  }

  return (
    <>
      {(isError || courseSections?.length === 0) ? (
        <p>Error</p>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent>
              {courseSections && (
                <SectionsLessonsManager
                  courseId={courseId}
                  mode="view"
                  sections={courseSections}
                  canEditContent={true}
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CourseContent;

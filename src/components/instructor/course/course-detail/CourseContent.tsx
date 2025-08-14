import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
// import SectionsLessonsManager, {
// } from '../SectionsLessonsManager';
import SectionsLessonsManager2 from '../SectionsLessonsManager2';
import { useGetSectionsQuery } from '@/services/instructor/courses-api';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { loadingAnimation } from '@/utils/instructor/loading-animation';
import { CourseBasicInfoType } from '@/utils/instructor/create-course-validations/course-basic-info-validation';
import { Section } from '@/types/student';
import { SectionDetail } from '@/types/instructor/courses';
import { createFileFromUrl } from '@/utils/instructor/create-file-from-url';
import { SectionType } from '@/utils/instructor/create-course-validations/lessons-validations';
import { set } from 'zod';

interface CourseContentProps {
  courseBasicInfo: CourseBasicInfoType;
}

const CourseContent = ({ courseBasicInfo }: CourseContentProps) => {
  const {
    data: sections,
    isLoading: isFetchingSections,
    isError,
  } = useGetSectionsQuery(courseBasicInfo.id);

  const [updatedSections, setUpdatedSections] = useState<SectionType[]>([]);
  const [isSettingUp, setIsSettingUp] = useState(false);

  const dispatch: AppDispatch = useDispatch();

  // Loading animation
  useEffect(() => {
    if (isFetchingSections || isSettingUp) {
      loadingAnimation(true, dispatch);
    } else {
      loadingAnimation(false, dispatch);
    }
    return () => {
      loadingAnimation(false, dispatch);
    };
  }, [isFetchingSections, isSettingUp]);

  // Add video file creation
  useEffect(() => {
    const fetchFiles = async () => {
      if (sections && sections.length > 0) {
        setIsSettingUp(true);
        const updatedSections = await Promise.all(
          sections.map(async (section: SectionDetail) => ({
            ...section,
            lessons: await Promise.all(
              section.lessons.map(async (lesson) => ({
                ...lesson,
                video: lesson.video && {
                  ...lesson.video,
                  file: await createFileFromUrl(lesson.video.url, lesson.video.title),
                },
                orderIndex: lesson.order,
              }))
            ),
            
          }))
        );
        setUpdatedSections(updatedSections);
        setIsSettingUp(false);
      }
    };
    fetchFiles();
  }, [sections]);

  if (isFetchingSections || isSettingUp) {
    return <></>;
  }

  return (
    <>
      {isError || (updatedSections && updatedSections.length === 0) ? (
        <p>Error</p>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent>
              {courseBasicInfo.id && (
                <SectionsLessonsManager2
                  courseId={courseBasicInfo.id}
                  mode="view"
                  sections={updatedSections}
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

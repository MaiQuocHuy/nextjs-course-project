'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Eye, Users, Clock, BookOpen, Video, Brain } from 'lucide-react';
import { CourseSummary } from '@/components/instructor/course/create-course/create-lessons/course-summary';
import type { CourseCreationType } from '@/lib/instructor/create-course-validations/lessons-validations';

// Mock course data - in real app, this would come from API
const mockCourseData: CourseCreationType & {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  price: number;
  thumbnail: string;
  status: 'draft' | 'published' | 'pending';
  enrolledStudents: number;
  createdAt: string;
} = {
  id: 'course-123',
  title: 'React Programming: From Basics to Advanced',
  description:
    'A comprehensive course on React, covering everything from basic concepts to advanced techniques like hooks, context, and performance optimization.',
  category: 'Programming',
  level: 'Intermediate',
  price: 199,
  thumbnail: '/placeholder.svg?height=200&width=300&text=React+Course',
  status: 'published',
  enrolledStudents: 1247,
  createdAt: '2024-01-15',
  sections: [
    {
      id: 'section-1',
      title: 'Introduction to React',
      order: 1,
      isCollapsed: false,
      lessons: [
        {
          id: 'lesson-1',
          title: 'What is React?',
          order: 1,
          type: 'video',
          documents: [
            {
              file: new File([''], 'react-intro.pdf', {
                type: 'application/pdf',
              }),
              status: 'publish',
            },
          ],
          questions: [],
          isCollapsed: false,
          video: {
            file: new File([''], 'react-intro.mp4', { type: 'video/mp4' }),
          },
        },
        {
          id: 'lesson-2',
          title: 'React Fundamentals Quiz',
          order: 2,
          type: 'quiz',
          documents: [],
          questions: [
            {
              id: 'q1',
              question: 'What is React?',
              options: [
                'JavaScript Library',
                'CSS Framework',
                'Database',
                'Server',
              ],
              correctAnswer: 0,
              explanation:
                'React is a JavaScript library for building user interfaces.',
              order: 1,
            },
          ],
          isCollapsed: false,
        },
      ],
    },
  ],
};

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [courseData, setCourseData] = useState(mockCourseData);

  // In real app, fetch course data based on courseId
  useEffect(() => {
    // fetchCourseData(courseId).then(setCourseData)
    if (params) {
    }
  }, [params]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const calculateCourseStats = () => {
    const totalLessons = courseData.sections.reduce(
      (acc, section) => acc + section.lessons.length,
      0
    );
    const videoLessons = courseData.sections.reduce(
      (acc, section) =>
        acc +
        section.lessons.filter((lesson) => lesson.type === 'video').length,
      0
    );
    const quizLessons = courseData.sections.reduce(
      (acc, section) =>
        acc + section.lessons.filter((lesson) => lesson.type === 'quiz').length,
      0
    );
    const totalQuestions = courseData.sections.reduce(
      (acc, section) =>
        acc +
        section.lessons.reduce(
          (lessonAcc, lesson) => lessonAcc + lesson.questions.length,
          0
        ),
      0
    );

    return { totalLessons, videoLessons, quizLessons, totalQuestions };
  };

  const stats = calculateCourseStats();

  if (isEditing) {
    // Import and render the CreateLessonsPage component in edit mode
    // For now, we'll show a placeholder
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            Edit Course: {courseData.title}
          </h1>
          <Button variant="outline" onClick={handleEditToggle}>
            Cancel Edit
          </Button>
        </div>
        {/* Here you would render the CreateLessonsPage component with the existing course data */}
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            Edit mode would render the CreateLessonsPage component with
            pre-filled data from this course.
          </p>
          <Button className="mt-4" onClick={handleEditToggle}>
            Back to View Mode
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Course Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{courseData.title}</h1>
          <div className="flex items-center gap-4">
            <Badge className={getStatusColor(courseData.status)}>
              {courseData.status.toUpperCase()}
            </Badge>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {courseData.enrolledStudents.toLocaleString()} students
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                Created {new Date(courseData.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview as Student
          </Button>
          <Button onClick={handleEditToggle}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Course
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Course Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <CourseSummary course={courseData} />

          {/* Course Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Course Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{stats.totalLessons}</div>
                  <div className="text-sm text-muted-foreground">
                    Total Lessons
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Video className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">{stats.videoLessons}</div>
                  <div className="text-sm text-muted-foreground">
                    Video Lessons
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Brain className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">{stats.quizLessons}</div>
                  <div className="text-sm text-muted-foreground">
                    Quiz Lessons
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Users className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                  <div className="text-2xl font-bold">
                    {courseData.enrolledStudents}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Enrolled Students
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Content Structure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {courseData.sections.map((section, sectionIndex) => (
                <Card key={section.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      Section {section.order}: {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {lesson.type === 'video' ? (
                            <Video className="h-5 w-5 text-green-500" />
                          ) : (
                            <Brain className="h-5 w-5 text-purple-500" />
                          )}
                          <div>
                            <div className="font-medium">
                              Lesson {lesson.order}: {lesson.title}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {lesson.type === 'video' && 'Video lesson'}
                              {lesson.type === 'quiz' &&
                                `Quiz with ${lesson.questions.length} questions`}
                              {lesson.documents.length > 0 &&
                                ` • ${lesson.documents.length} documents`}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={
                            lesson.type === 'video' ? 'default' : 'secondary'
                          }
                        >
                          {lesson.type === 'video' ? 'Video' : 'Quiz'}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Course Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Analytics dashboard would be implemented here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Course Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Course settings would be implemented here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

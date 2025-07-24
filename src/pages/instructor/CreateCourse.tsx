import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Plus,
  X,
  PlayCircle,
  FileText,
  Save,
  Send,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';

const courseSchema = z.object({
  title: z.string().min(1, 'Course title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(0, 'Price must be positive'),
  image: z.string().optional(),
  introVideo: z.string().optional(),
});

interface Lesson {
  id: string;
  title: string;
  videoFile?: File;
  documents: File[];
  quiz?: {
    questions: {
      question: string;
      options: string[];
      correctAnswer: number;
    }[];
  };
}

export const CreateCourse = () => {
  const [step, setStep] = useState(1);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [imagePreview, setImagePreview] = useState<string>('');

  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      price: 0,
    },
  });

  const addLesson = () => {
    const newLesson: Lesson = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      documents: [],
    };
    setLessons([...lessons, newLesson]);
  };

  const removeLesson = (id: string) => {
    setLessons(lessons.filter((lesson) => lesson.id !== id));
  };

  const updateLesson = (id: string, updates: Partial<Lesson>) => {
    setLessons(
      lessons.map((lesson) =>
        lesson.id === id ? { ...lesson, ...updates } : lesson
      )
    );
  };

  const onSubmit = (values: z.infer<typeof courseSchema>) => {
    console.log('Course data:', values);
    console.log('Lessons:', lessons);
    // Here you would typically send the data to your API
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/instructor/courses">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create New Course</h1>
          <p className="text-muted-foreground">
            Build an engaging course for your students
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center space-x-2 ${
                step >= 1 ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                1
              </div>
              <span>Course Details</span>
            </div>
            <Separator className="flex-1" />
            <div
              className={`flex items-center space-x-2 ${
                step >= 2 ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                2
              </div>
              <span>Add Lessons</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
                <CardDescription>
                  Provide basic information about your course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter course title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what students will learn in this course"
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="programming">
                              Programming
                            </SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="data-science">
                              Data Science
                            </SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="photography">
                              Photography
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Course Image *</Label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="cursor-pointer"
                      />
                    </div>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Course preview"
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                  </div>
                </div>

                {/* Intro Video Upload */}
                <div className="space-y-2">
                  <Label>Introduction Video (optional)</Label>
                  <Input
                    type="file"
                    accept="video/*"
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload a short video introducing your course
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-gradient-primary"
                  >
                    Continue to Lessons
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Course Lessons</CardTitle>
                  <CardDescription>
                    Add lessons, videos, and quizzes to your course
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    type="button"
                    onClick={addLesson}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Lesson
                  </Button>
                </CardContent>
              </Card>

              {lessons.map((lesson, index) => (
                <Card key={lesson.id} className="shadow-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">
                          Lesson {index + 1}
                        </CardTitle>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLesson(lesson.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Lesson Title *</Label>
                      <Input
                        placeholder="Enter lesson title"
                        value={lesson.title}
                        onChange={(e) =>
                          updateLesson(lesson.id, { title: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label>Video Upload</Label>
                      <div className="flex items-center space-x-2">
                        <PlayCircle className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="file"
                          accept="video/*"
                          className="cursor-pointer"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Documents (optional)</Label>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="file"
                          multiple
                          className="cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Label className="text-sm text-muted-foreground">
                        Quiz (optional)
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        <Plus className="mr-2 h-3 w-3" />
                        Add Quiz Questions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Course Details
                    </Button>
                    <div className="flex gap-3">
                      <Button type="submit" variant="outline">
                        <Save className="mr-2 h-4 w-4" />
                        Save Draft
                      </Button>
                      <Button type="submit" className="bg-gradient-primary">
                        <Send className="mr-2 h-4 w-4" />
                        Send for Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

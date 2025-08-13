'use client';

import type React from 'react';
import type { QuizQuestionType } from '@/utils/instructor/create-course-validations/lessons-validations';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  LayoutTemplateIcon as Template,
  BookOpen,
  Code,
  Calculator,
} from 'lucide-react';

interface QuizTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  questions: QuizQuestionType[];
}

const quizTemplates: QuizTemplate[] = [
  {
    id: 'programming-basics',
    name: 'Programming Basics',
    description: 'Fundamental programming concepts and terminology',
    category: 'Programming',
    icon: <Code className="h-5 w-5" />,
    questions: [
      {
        id: 'q1',
        question: 'What is a variable in programming?',
        options: [
          'A container for storing data values',
          'A type of loop',
          'A function parameter',
          'A programming language',
        ],
        correctAnswer: 0,
        explanation:
          'A variable is a container for storing data values that can be changed during program execution.',
      },
      {
        id: 'q2',
        question: 'Which of the following is NOT a primitive data type?',
        options: ['Integer', 'String', 'Boolean', 'Array'],
        correctAnswer: 3,
        explanation:
          'Array is a composite data type, not a primitive one. Primitive types include integer, string, and boolean.',
      },
    ],
  },
  {
    id: 'web-development',
    name: 'Web Development Fundamentals',
    description: 'Basic concepts of HTML, CSS, and JavaScript',
    category: 'Web Development',
    icon: <BookOpen className="h-5 w-5" />,
    questions: [
      {
        id: 'q1',
        question: 'What does HTML stand for?',
        options: [
          'Hyper Text Markup Language',
          'High Tech Modern Language',
          'Home Tool Markup Language',
          'Hyperlink and Text Markup Language',
        ],
        correctAnswer: 0,
        explanation:
          'HTML stands for Hyper Text Markup Language, used for creating web pages.',
      },
      {
        id: 'q2',
        question: 'Which CSS property is used to change the text color?',
        options: ['font-color', 'text-color', 'color', 'foreground-color'],
        correctAnswer: 2,
        explanation:
          "The 'color' property in CSS is used to set the color of text.",
      },
    ],
  },
  {
    id: 'mathematics',
    name: 'Basic Mathematics',
    description: 'Fundamental mathematical concepts and operations',
    category: 'Mathematics',
    icon: <Calculator className="h-5 w-5" />,
    questions: [
      {
        id: 'q1',
        question: 'What is the result of 15 + 25?',
        options: ['30', '35', '40', '45'],
        correctAnswer: 2,
        explanation: '15 + 25 = 40',
      },
      {
        id: 'q2',
        question: 'What is 12 × 8?',
        options: ['84', '96', '104', '112'],
        correctAnswer: 1,
        explanation: '12 × 8 = 96',
      },
    ],
  },
];

interface QuizTemplatesProps {
  onTemplateSelect: (questions: QuizQuestionType[]) => void;
}

export function QuizTemplates({ onTemplateSelect }: QuizTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<QuizTemplate | null>(
    null
  );

  const handleTemplateSelect = (template: QuizTemplate) => {
    const questionsWithNewIds = template.questions.map((q) => ({
      ...q,
      id: `${q.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));
    onTemplateSelect(questionsWithNewIds);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Template className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Quiz Templates</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizTemplates.map((template) => (
          <Card
            key={template.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                {template.icon}
                <span>{template.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>

              <div className="flex items-center justify-between">
                <Badge variant="secondary">{template.category}</Badge>
                <span className="text-xs text-muted-foreground">
                  {template.questions.length} questions
                </span>
              </div>

              <div className="flex gap-2">
                {/* Preview */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        {template.icon}
                        {template.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        {template.description}
                      </p>

                      <div className="space-y-4">
                        {template.questions.map((question, index) => (
                          <Card key={question.id}>
                            <CardContent className="p-4">
                              <h4 className="font-medium mb-2">
                                Question {index + 1}
                              </h4>
                              <p className="mb-3">{question.question}</p>

                              <div className="space-y-1">
                                {question.options.map((option, optionIndex) => (
                                  <div
                                    key={optionIndex}
                                    className={`p-2 rounded text-sm ${
                                      optionIndex === question.correctAnswer
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : 'bg-muted'
                                    }`}
                                  >
                                    {optionIndex === question.correctAnswer &&
                                      '✓ '}
                                    {option}
                                  </div>
                                ))}
                              </div>

                              {question.explanation && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  <strong>Explanation:</strong>{' '}
                                  {question.explanation}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  size="sm"
                  onClick={() => handleTemplateSelect(template)}
                >
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

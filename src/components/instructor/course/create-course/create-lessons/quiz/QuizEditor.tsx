'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/instructor/commom/Collapsible';
import { QuestionContent } from './QuestionContent';
import { Trash2, Plus, Edit3, ChevronRight } from 'lucide-react';
import { DragDropReorder } from '@/components/instructor/course/create-course/create-lessons/DragDropReorder';
import type { QuizQuestionType } from '@/utils/instructor/course/create-course-validations/course-content-validations';
import WarningAlert from '@/components/instructor/commom/WarningAlert';

interface QuizEditorProps {
  canEdit: boolean;
  questions: QuizQuestionType[];
  onQuestionsChange: (questions: QuizQuestionType[]) => void;
}

export function QuizEditor({
  canEdit,
  questions,
  onQuestionsChange,
}: QuizEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] =
    useState<QuizQuestionType | null>(null);
  const [isDeleteQuizDialogOpen, setDeleteQuizDialogOpen] = useState(false);

  useEffect(() => {
    if (selectedQuestion) {
      setDeleteQuizDialogOpen(true);
    }
  }, [selectedQuestion]);

  const updateQuestion = (id: string, updates: Partial<QuizQuestionType>) => {
    const updatedQuestions = questions.map((q) =>
      q.id === id ? { ...q, ...updates } : q
    );
    onQuestionsChange(updatedQuestions);
  };

  const deleteQuestion = (id: string) => {
    const updatedQuestions = questions.filter((q) => q.id !== id);
    // Reorder remaining questions
    updatedQuestions.forEach((q, index) => {
      q.orderIndex = index;
    });
    onQuestionsChange(updatedQuestions);
  };

  const addNewQuestion = () => {
    const newQuestion: QuizQuestionType = {
      id: `new-question-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      questionText: '',
      options: {
        A: '',
        B: '',
        C: '',
        D: '',
      }, // Start with two empty options
      correctAnswer: 'A',
      explanation: '',
      orderIndex: questions.length,
    };
    onQuestionsChange([...questions, newQuestion]);
    setEditingId(newQuestion.id);
  };

  const updateOption = (questionId: string, option: string, answer: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (question) {
      const newOptions = { ...question.options, [option]: answer };
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const renderQuestion = (question: QuizQuestionType, index: number) => (
    <Collapsible key={question.id} defaultOpen={index === 0}>
      <Card className="gap-3">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 ">
            <CardTitle className="text-base flex items-center justify-between ">
              <div className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 transition-transform data-[state=open]:rotate-90 shrink-0" />
                <span className="whitespace-nowrap">
                  Question {question.orderIndex + 1}
                </span>
                {question.questionText && (
                  <span className="line-clamp-1 text-sm font-normal text-muted-foreground ">
                    - {question.questionText}
                  </span>
                )}
              </div>

              {canEdit && (
                <div className="flex" onClick={(e) => e.stopPropagation()}>
                  {/* Edit button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setEditingId(
                        editingId === question.id ? null : question.id
                      )
                    }
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>

                  {/* Remove button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (!question.id.includes('new-question')) {
                        setSelectedQuestion(question);
                      } else {
                        deleteQuestion(question.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent className="w-full">
          <CardContent className="space-y-4 w-full">
            <QuestionContent 
              question={question}
              isEditing={editingId === question.id}
              updateQuestion={updateQuestion}
              updateOption={updateOption}
            />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Quiz Questions ({questions.length})</h3>
        {canEdit && (
          <Button type="button" onClick={addNewQuestion}>
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        )}
      </div>

      {questions.length > 0 ? (
        <DragDropReorder
          items={questions}
          onReorder={
            canEdit
              ? (reorderedQuestions) => {
                  // Update the order property and reorder
                  const updatedQuestions = reorderedQuestions.map(
                    (question, index) => ({
                      ...question,
                      orderIndex: index,
                    })
                  );
                  onQuestionsChange(updatedQuestions);
                }
              : null
          }
          renderItem={renderQuestion}
          className="space-y-8"
        />
      ) : (
        <Card className="p-8 text-center text-muted-foreground">
          <p>No questions yet. Click "Add Question" to get started.</p>
        </Card>
      )}

      {selectedQuestion && (
        <WarningAlert
          open={isDeleteQuizDialogOpen}
          onOpenChange={(open) => {
            setDeleteQuizDialogOpen(open);
            if (!open) {
              setSelectedQuestion(null);
            }
          }}
          title="Are you sure you want to delete this question?"
          onClick={() => {
            deleteQuestion(selectedQuestion.id);
            setSelectedQuestion(null);
          }}
          actionTitle="Delete Question"
        />
      )}
    </div>
  );
}

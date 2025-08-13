"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  useGenerateQuestionsMutation,
  useSaveQuestionsMutation,
} from "@/services/quiz/geminiApi";
import type { QuestionType } from "@/services/quiz/geminiApi";

export default function TestGeminiAIPage() {
  const [file, setFile] = useState<File | null>(null);
  const [extractPreview, setExtractPreview] = useState("");
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [sectionId, setSectionId] = useState("001");
  const [lessonId, setLessonId] = useState("001");
  const [error, setError] = useState<string | null>(null);

  const [generateQuestions, { isLoading: generating }] =
    useGenerateQuestionsMutation();
  const [saveQuestions, { isLoading: saving }] = useSaveQuestionsMutation();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestions([]);
    setError(null);
    setFile(e.target.files?.[0] ?? null);
  };

  const handleGenerate = async () => {
    if (!file) {
      alert("Please select a .docx file first.");
      return;
    }
    setError(null);

    try {
      const mammoth = (await import("mammoth")).default;
      const arrayBuffer = await file.arrayBuffer();
      const { value } = await mammoth.extractRawText({ arrayBuffer });
      const cleanedText = value.trim();
      setExtractPreview(cleanedText.substring(0, 5000));

      const data = await generateQuestions({
        sectionId,
        lessonId,
        text: cleanedText,
        numQuestions: 5,
      }).unwrap();

      console.log("Generated questions data:", data);

      // Kiểm tra xem data có phải array không
      if (!Array.isArray(data)) {
        console.error("Data is not an array:", data);
        throw new Error("Invalid response format: expected array of questions");
      }

      const normalized: QuestionType[] = data.map((q: any, idx: number) => {
        // Chuyển đổi options thành format A, B, C, D
        const originalOptions = q.options ?? {};
        const standardOptions: Record<string, string> = {};
        const optionLabels = ["A", "B", "C", "D", "E", "F"];

        let labelIndex = 0;
        Object.entries(originalOptions).forEach(([key, value]) => {
          if (labelIndex < optionLabels.length) {
            standardOptions[optionLabels[labelIndex]] = String(value);
            labelIndex++;
          }
        });

        // Tìm correct answer key mới
        let newCorrectAnswer = q.correctAnswer ?? "";
        if (originalOptions[newCorrectAnswer]) {
          const originalKeys = Object.keys(originalOptions);
          const originalIndex = originalKeys.indexOf(newCorrectAnswer);
          if (originalIndex >= 0 && originalIndex < optionLabels.length) {
            newCorrectAnswer = optionLabels[originalIndex];
          }
        }

        return {
          id: q.id || uuidv4(),
          questionText: q.questionText ?? q.question ?? "",
          options: standardOptions,
          correctAnswer: newCorrectAnswer,
          explanation: q.explanation ?? "",
        };
      });

      setQuestions(normalized);
    } catch (err: any) {
      console.error("Generate error:", err);
      console.error("Error details:", {
        message: err.message,
        stack: err.stack,
        originalError: err,
      });
      setError(err?.data?.message || err?.message || "Generate failed");
    }
  };

  const acceptAll = async () => {
    if (!sectionId || !lessonId) {
      alert("Missing sectionId or lessonId.");
      return;
    }
    if (questions.length === 0) {
      alert("No questions to save.");
      return;
    }
    setError(null);

    try {
      await saveQuestions({ sectionId, lessonId, questions }).unwrap();
      alert("Saved successfully!");
    } catch (err: any) {
      console.error("Save error:", err);
      setError(err.message || "Save failed");
    }
  };

  const updateOption = (qIndex: number, key: string, value: string) => {
    const copy = [...questions];
    copy[qIndex] = {
      ...copy[qIndex],
      options: { ...copy[qIndex].options, [key]: value },
    };
    setQuestions(copy);
  };

  const addNewOption = (qIndex: number) => {
    const copy = [...questions];
    const currentOptions = copy[qIndex].options;
    const optionLabels = ["A", "B", "C", "D", "E", "F"];
    const usedLabels = Object.keys(currentOptions);
    const nextLabel = optionLabels.find((label) => !usedLabels.includes(label));

    if (nextLabel) {
      copy[qIndex].options[nextLabel] = "";
      setQuestions(copy);
    }
  };

  const removeOption = (qIndex: number, optionKey: string) => {
    const copy = [...questions];
    delete copy[qIndex].options[optionKey];
    // Nếu đáp án đúng bị xóa, reset về rỗng
    if (copy[qIndex].correctAnswer === optionKey) {
      copy[qIndex].correctAnswer = "";
    }
    setQuestions(copy);
  };

  const saveQuestionLocally = (index: number) => {
    setEditingIndex(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            Generate MCQ from Word Document
          </h1>
          <p className="text-gray-600 mb-6">
            Upload a Word document and generate multiple choice questions using
            AI
          </p>

          <div className="mb-6 flex gap-4">
            <label className="flex-1">
              <div className="mb-2 text-sm font-medium text-gray-700">
                Section ID
              </div>
              <input
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </label>
            <label className="flex-1">
              <div className="mb-2 text-sm font-medium text-gray-700">
                Lesson ID
              </div>
              <input
                value={lessonId}
                onChange={(e) => setLessonId(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </label>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block">
                  <div className="mb-2 text-sm font-medium text-gray-700">
                    Upload Word Document
                  </div>
                  <input
                    type="file"
                    accept=".docx"
                    onChange={onFileChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </label>
              </div>
              <button
                onClick={handleGenerate}
                disabled={!file || generating}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 font-medium flex items-center gap-2"
              >
                {generating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Processing...
                  </>
                ) : (
                  "Generate MCQ"
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-800">
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}
        </div>

        {extractPreview && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h4 className="font-semibold text-lg mb-3 text-gray-900">
              Document Preview
            </h4>
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 max-h-60 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">
                {extractPreview}
              </pre>
            </div>
          </div>
        )}

        {questions.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Generated Questions
              </h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {questions.length} questions
              </span>
            </div>

            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-6 border border-gray-200 rounded-lg bg-gray-50"
                >
                  {editingIndex === idx ? (
                    <>
                      <label className="block mb-4">
                        <div className="text-sm text-gray-600 mb-2 font-medium">
                          Question
                        </div>
                        <textarea
                          className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={3}
                          value={q.questionText}
                          onChange={(e) => {
                            const copy = [...questions];
                            copy[idx].questionText = e.target.value;
                            setQuestions(copy);
                          }}
                          placeholder="Enter your question here..."
                        />
                      </label>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Options:</h4>
                        {Object.keys(q.options).map((key) => (
                          <div
                            key={key}
                            className="flex gap-2 items-center mb-2"
                          >
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-800">
                              {key}
                            </div>
                            <input
                              className="flex-1 border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={q.options[key]}
                              onChange={(e) =>
                                updateOption(idx, key, e.target.value)
                              }
                              placeholder={`Option ${key}...`}
                            />
                            {Object.keys(q.options).length > 2 && (
                              <button
                                className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                                onClick={() => removeOption(idx, key)}
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          className="mt-2 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                          onClick={() => addNewOption(idx)}
                          disabled={Object.keys(q.options).length >= 6}
                        >
                          + Add Option
                        </button>
                      </div>

                      <div className="mb-4">
                        <label className="block">
                          <div className="text-sm text-gray-600 mb-2">
                            Correct Answer
                          </div>
                          <select
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={q.correctAnswer}
                            onChange={(e) => {
                              const copy = [...questions];
                              copy[idx].correctAnswer = e.target.value;
                              setQuestions(copy);
                            }}
                          >
                            <option value="">Select correct answer...</option>
                            {Object.keys(q.options).map((key) => (
                              <option key={key} value={key}>
                                {key}: {q.options[key].substring(0, 50)}
                                {q.options[key].length > 50 ? "..." : ""}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <label className="block">
                        <div className="text-sm text-gray-600 mb-2 font-medium">
                          Explanation
                        </div>
                        <textarea
                          className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={3}
                          value={q.explanation}
                          onChange={(e) => {
                            const copy = [...questions];
                            copy[idx].explanation = e.target.value;
                            setQuestions(copy);
                          }}
                          placeholder="Optional explanation for the correct answer..."
                        />
                      </label>
                      <div className="mt-4 flex gap-3">
                        <button
                          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
                          onClick={() => saveQuestionLocally(idx)}
                        >
                          Save Changes
                        </button>
                        <button
                          className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                          onClick={() => setEditingIndex(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg text-gray-800">
                          {idx + 1}. {q.questionText}
                        </h3>
                        <div>
                          <button
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={() => setEditingIndex(idx)}
                          >
                            Edit
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {Object.entries(q.options).map(([k, v]) => (
                          <div
                            key={k}
                            className={`flex items-start gap-3 p-2 rounded ${
                              k === q.correctAnswer
                                ? "bg-green-50 border border-green-200"
                                : "bg-gray-50"
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                                k === q.correctAnswer
                                  ? "bg-green-500 text-white"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {k}
                            </div>
                            <div className="flex-1">
                              {v}
                              {k === q.correctAnswer && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  ✓ Correct
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {q.explanation && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-sm">
                            <strong className="text-blue-800">
                              Explanation:
                            </strong>
                            <span className="text-gray-700 ml-2">
                              {q.explanation}
                            </span>
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={acceptAll}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  "Accept All & Save to Database"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

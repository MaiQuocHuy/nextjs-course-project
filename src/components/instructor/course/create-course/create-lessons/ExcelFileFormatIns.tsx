'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Eye, Download } from 'lucide-react';
import { useState } from 'react';
import { ExcelViewer } from './preview/ExcelViewer';
import {
  ExcelQuizData,
  generateExcelTemplate,
} from '@/utils/instructor/course/excel/excel-parser';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Sample data for the Excel file
const exampleData: ExcelQuizData[] = [
  {
    question:
      'Which programming language is commonly used for web development?',
    option1: 'Excel',
    option2: 'JavaScript',
    option3: 'Photoshop',
    option4: 'Hardware',
    correctAnswer: 'B',
    explanation:
      'JavaScript is a core technology for web development alongside HTML and CSS',
  },
  {
    question: 'What does HTML stand for?',
    option1: 'Hyper Text Markup Language',
    option2: 'High Tech Modern Language',
    option3: 'Hyper Transfer Machine Learning',
    option4: 'Home Tool Management Language',
    correctAnswer: 'A',
    explanation:
      'HTML (Hyper Text Markup Language) is the standard markup language for documents designed to be displayed in a web browser',
  },
  {
    question: 'Which of the following is a version control system?',
    option1: 'MySQL',
    option2: 'Git',
    option3: 'Apache',
    option4: 'React',
    correctAnswer: 'B',
    explanation:
      'Git is a distributed version control system designed to track changes in source code during software development',
  },
  {
    question: 'What is the function of CSS in web development?',
    option1: 'To handle server requests',
    option2: 'To define the structure of web pages',
    option3: 'To style the appearance of web pages',
    option4: 'To manage databases',
    correctAnswer: 'C',
    explanation:
      'CSS (Cascading Style Sheets) is used to control the visual presentation of web pages',
  },
];

const ExcelFileFormatIns = () => {
  const [showExampleCard, setShowExampleCard] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);

  const handlePreview = () => {
    setShowExampleCard(!showExampleCard);
    const excelFile = generateExcelTemplate(exampleData);
    setExcelFile(excelFile);
  };

  const handleDownloadTemplate = () => {
    const excelFile = generateExcelTemplate(exampleData);
    // Create a download link and trigger download
    const url = URL.createObjectURL(excelFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = excelFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="space-y-1">
        <Card className="gap-2 py-4">
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">
                Excel Quiz Template Specifications
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Follow these guidelines to ensure your Excel quiz file is
                correctly formatted and validated:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Column A: Question text (10-1000 characters)</li>
                <li>Column B: Option 1</li>
                <li>Column C: Option 2</li>
                <li>Column D: Option 3</li>
                <li>Column E: Option 4</li>
                <li>Column F: Correct Answer (A, B, C, or D)</li>
                <li>Column G: Explanation (optional, max 500 characters)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Validation Rules</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>
                  Question text must contain between 10 and 1000 characters
                </li>
                <li>All four options (B-E) must be provided</li>
                <li>
                  Correct Answer must be exactly "A", "B", "C", or "D"
                  (case-insensitive)
                </li>
                <li>Explanation, if provided, must be under 500 characters</li>
              </ul>
            </div>

            <div className="text-sm">
              <p>
                <strong>Note:</strong> All sheets in your Excel file will be
                processed. Text validation is case-insensitive, and the system
                will automatically capitalize the first letter of all text
                fields in the final data.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2 pt-0">
            {/* Preview Sample Template button */}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handlePreview}
            >
              <Eye size={16} /> Preview Sample Template
            </Button>

            {/* Download Template button */}
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleDownloadTemplate}
            >
              <Download size={16} /> Download Excel Template
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={showExampleCard} onOpenChange={setShowExampleCard}>
        <DialogContent
          style={{
            width: '90vw',
            maxWidth: '90vw',
            maxHeight: '95vh',
            padding: '15px',
          }}
        >
          <DialogHeader>
            <DialogTitle>Sample Template</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto" style={{ height: '85vh' }}>
            {excelFile && <ExcelViewer file={excelFile} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExcelFileFormatIns;

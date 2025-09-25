export interface ExcelQuizData {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
}

export function parseExcelFile(file: File): Promise<ExcelQuizData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        // Use xlsx library to parse Excel data
        const XLSX = await import('xlsx');
        const data = e.target?.result as ArrayBuffer;
        const workbook = XLSX.read(data, { type: 'array' });

        const allQuizData: ExcelQuizData[] = [];

        // Iterate through all sheets in the workbook
        workbook.SheetNames.forEach((sheetName: string) => {
          const worksheet = workbook.Sheets[sheetName];

          // Convert the worksheet to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // Map the Excel data to our ExcelQuizData format
          const sheetQuizData: ExcelQuizData[] = jsonData.map((row: any) => {
            // Clean the data by removing newlines from all fields
            const cleanField = (value: any): string => {
              if (value === undefined || value === null) return '';
              return String(value)
                .replace(/\r?\n|\r/g, ' ')
                .trim();
            };

            return {
              question: cleanField(row['Question']),
              option1: cleanField(row['Option 1']),
              option2: cleanField(row['Option 2']),
              option3: cleanField(row['Option 3']),
              option4: cleanField(row['Option 4']),
              correctAnswer: cleanField(row['Correct Answer']) as
                | 'A'
                | 'B'
                | 'C'
                | 'D',
              explanation: cleanField(row['Explanation'] || ''),
            };
          });

          // Add the data from this sheet to our collection
          allQuizData.push(...sheetQuizData);
        });

        resolve(allQuizData);
      } catch (error) {
        // console.error('Excel parsing error:', error);
        reject(
          new Error(`Invalid Excel file format: ${(error as Error).message}`)
        );
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

export function generateExcelTemplate(data: ExcelQuizData[] = []): File {
  const XLSX = require('xlsx');

  // Define the headers for the template
  const headers = [
    'Question',
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
    'Correct Answer',
    'Explanation',
  ];

  // Create a new workbook and worksheet with headers
  const workbook = XLSX.utils.book_new();

  // Create worksheet with headers regardless of whether data exists
  const worksheet = XLSX.utils.aoa_to_sheet([headers]);

  // If data exists, add it after the header row
  if (data.length > 0) {
    // Convert data to array format compatible with headers
    const rows = data.map((item) => [
      item.question,
      item.option1,
      item.option2,
      item.option3,
      item.option4,
      item.correctAnswer,
      item.explanation || '',
    ]);

    // Append data rows after the header
    XLSX.utils.sheet_add_aoa(worksheet, rows, { origin: 1 });
  }

  // Set column widths for better appearance
  const colWidths = [
    { wch: 40 }, // Column A: Question
    { wch: 20 }, // Column B: Option 1
    { wch: 20 }, // Column C: Option 2
    { wch: 20 }, // Column D: Option 3
    { wch: 20 }, // Column E: Option 4
    { wch: 15 }, // Column F: Correct Answer
    { wch: 35 }, // Column G: Explanation
  ];
  worksheet['!cols'] = colWidths;

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Quiz Questions');

  // Generate the Excel file as an array buffer
  const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

  // Convert ArrayBuffer to Blob
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  // Create a File object from the Blob
  return new File([blob], 'quiz_questions_template.xlsx', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

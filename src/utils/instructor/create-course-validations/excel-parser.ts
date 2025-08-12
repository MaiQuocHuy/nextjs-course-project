export interface ExcelQuizData {
  question: string;
  option1: string;
  option2: string;
  option3?: string;
  option4?: string;
  option5?: string;
  option6?: string;
  correctAnswer: number;
  explanation?: string;
}

export function parseExcelFile(file: File): Promise<ExcelQuizData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        // This is a simplified parser - in a real app, you'd use a library like xlsx
        const text = e.target?.result as string;

        // Mock parsing for demonstration
        // In reality, you'd parse the actual Excel file
        const mockData: ExcelQuizData[] = [
          {
            question: 'Sample question from Excel file?',
            option1: 'Option A',
            option2: 'Option B',
            option3: 'Option C',
            option4: 'Option D',
            correctAnswer: 1,
            explanation: 'This is the explanation from Excel',
          },
        ];

        resolve(mockData);
      } catch (error) {
        reject(new Error('Invalid Excel file format'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function validateExcelFormat(data: any[]): boolean {
  if (!Array.isArray(data) || data.length === 0) return false;

  return data.every(
    (row) =>
      row.question &&
      row.option1 &&
      row.option2 &&
      typeof row.correctAnswer === 'number' &&
      row.correctAnswer >= 1 &&
      row.correctAnswer <= 6
  );
}

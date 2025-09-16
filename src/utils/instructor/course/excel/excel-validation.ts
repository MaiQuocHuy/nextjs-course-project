import * as XLSX from 'xlsx';

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export interface ExcelQuizValidationResult {
  isValid: boolean;
  errors: string[];
  data?: any[][];
}

interface RowWithSheetInfo {
  sheetName: string;
  rowIndex: number;
  data: any[];
}

/**
 * Validates Excel file content for quiz questions format across all sheets
 * The expected format is:
 * First row: Headers ("Question", "Option 1", "Option 2", "Option 3", "Option 4", "Correct Answer", "Explanation")
 * Column A: Question text (10-1000 characters)
 * Column B: Option 1
 * Column C: Option 2
 * Column D: Option 3
 * Column E: Option 4
 * Column F: Correct Answer (must be "A", "B", "C", or "D")
 * Column G: Explanation (optional, max 500 characters)
 * 
 * Validation rules:
 * - First row must contain the required headers
 * - Question text must be between 10 and 1000 characters
 * - All four options must be provided
 * - Correct Answer must be exactly "A", "B", "C", or "D" (case insensitive)
 * - Explanation, if provided, must be under 500 characters
 * - All columns are validated case-insensitively
 * - The first letter of text fields will be capitalized in the final data
 */
export const validateExcelQuizFormat = async (file: File): Promise<ExcelQuizValidationResult> => {
  const result: ExcelQuizValidationResult = {
    isValid: false,
    errors: [],
  };

  try {
    const rowsWithSheetInfo = await readExcelFile(file);
    
    // Check if file has any data
    if (!rowsWithSheetInfo || rowsWithSheetInfo.length === 0) {
      result.errors.push('The Excel file appears to be empty. No quiz questions found in any sheet.');
      return result;
    }
    
    // Track processed sheets to validate headers
    const processedSheets = new Set<string>();
    
    // Validate each row
    for (let i = 0; i < rowsWithSheetInfo.length; i++) {
      const { sheetName, rowIndex, data: rowData } = rowsWithSheetInfo[i];
      
      // Validate headers in the first row of each sheet
      if (!processedSheets.has(sheetName) && rowIndex === 1) {
        processedSheets.add(sheetName);
        
        // Expected headers (case-insensitive)
        const expectedHeaders = ['question', 'option 1', 'option 2', 'option 3', 'option 4', 'correct answer', 'explanation'];
        const requiredHeaders = expectedHeaders.slice(0, 6); // All except explanation are required
        
        // Convert headers to lowercase for case-insensitive comparison
        const actualHeaders = rowData.map(header => String(header || '').toLowerCase().trim());
        
        // Check if required headers are present
        for (let j = 0; j < requiredHeaders.length; j++) {
          if (!actualHeaders[j] || !actualHeaders[j].includes(requiredHeaders[j].toLowerCase())) {
            result.errors.push(`Sheet "${sheetName}": First row must contain header "${requiredHeaders[j]}" in column ${String.fromCharCode(65 + j)}`);
          }
        }
        
        continue;
      }
      
      // Check if row has at least 6 columns (A-F, G is optional)
      if (!rowData || rowData.length < 6) {
        result.errors.push(`Sheet "${sheetName}", Row ${rowIndex}: Missing required columns`);
        continue;
      }

      // Check that required fields are not empty and validate question length
      const questionText = String(rowData[0] || '');
      if (!questionText) {
        result.errors.push(`Sheet "${sheetName}", Row ${rowIndex}: Question text is missing`);
      } else if (questionText.length < 10) {
        result.errors.push(`Sheet "${sheetName}", Row ${rowIndex}: Question text is too short (minimum 10 characters)`);
      } else if (questionText.length > 1000) {
        result.errors.push(`Sheet "${sheetName}", Row ${rowIndex}: Question text is too long (maximum 1000 characters)`);
      }
      
      // Check all four options and store them for correct answer validation
      const options = [];
      for (let j = 1; j <= 4; j++) {
        const optionText = rowData[j];
        if (!optionText) {
          result.errors.push(`Sheet "${sheetName}", Row ${rowIndex}: Option ${j} is missing`);
        }
        options.push(optionText);
      }

      // Validate correct answer matches one of the option keys ("A", "B", "C", "D")
      const correctAnswer = String(rowData[5] || '').trim().toUpperCase();
      if (!correctAnswer) {
        result.errors.push(`Sheet "${sheetName}", Row ${rowIndex}: Correct answer is missing`);
      } else if (!['A', 'B', 'C', 'D'].includes(correctAnswer)) {
        result.errors.push(`Sheet "${sheetName}", Row ${rowIndex}: Correct answer must be "A", "B", "C", or "D"`);
      }
      
      // Validate explanation length if present
      if (rowData[6]) {
        const explanation = String(rowData[6]);
        if (explanation.length > 500) {
          result.errors.push(`Sheet "${sheetName}", Row ${rowIndex}: Explanation is too long (maximum 500 characters)`);
        }
      }
    }

    // Set valid if no errors were found
    if (result.errors.length === 0) {
      result.isValid = true;
      
      // Track which sheets have been processed to identify header rows
      const processedSheets = new Set<string>();
      
      // Process and normalize data before returning, filtering out header rows
      result.data = rowsWithSheetInfo.filter(row => {
        // Check if this is a header row (first row of a sheet)
        if (!processedSheets.has(row.sheetName) && row.rowIndex === 1) {
          processedSheets.add(row.sheetName);
          return false; // Skip header rows
        }
        return true;
      }).map(row => {
        const processedRow = [...row.data];
        
        // Capitalize first letter of question text
        if (processedRow[0]) {
          processedRow[0] = capitalizeFirstLetter(String(processedRow[0]));
        }
        
        // Capitalize first letter of each option
        for (let j = 1; j <= 4; j++) {
          if (processedRow[j]) {
            processedRow[j] = capitalizeFirstLetter(String(processedRow[j]));
          }
        }
        
        // Ensure correct answer is uppercase
        if (processedRow[5]) {
          processedRow[5] = String(processedRow[5]).trim().toUpperCase();
        }
        
        // Capitalize first letter of explanation if present
        if (processedRow[6]) {
          processedRow[6] = capitalizeFirstLetter(String(processedRow[6]));
        }
        
        return processedRow;
      });
    }
    
  } catch (error) {
    result.errors.push('Failed to process Excel file: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }

  return result;
};

// Helper function to read Excel file content from all sheets
const readExcelFile = (file: File): Promise<RowWithSheetInfo[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error('Failed to read file'));
          return;
        }
        
        // Parse the Excel file
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get all sheets and combine their data with sheet info
        const allRows: RowWithSheetInfo[] = [];
        
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          // Convert each sheet to array of arrays (rows)
          const sheetRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          
          // Add each non-empty row with its sheet information
          sheetRows.forEach((row, rowIndex) => {
            // Skip completely empty rows
            if (row.length > 0 && row.some(cell => cell !== null && cell !== undefined && cell !== '')) {
              allRows.push({
                sheetName,
                rowIndex: rowIndex + 1, // Make it 1-indexed for user-friendly messages
                data: row
              });
            }
          });
        });
        
        resolve(allRows);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    // Read the file as an array buffer
    reader.readAsArrayBuffer(file);
  });
};

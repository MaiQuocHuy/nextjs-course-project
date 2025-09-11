'use client';

import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SheetData {
  name: string;
  data: any[][];
}

// Helper function to convert column index to Excel column name (A, B, C...AA, AB, etc.)
const getExcelColumnName = (index: number): string => {
  let columnName = '';
  let temp = index;
  
  while (temp >= 0) {
    columnName = String.fromCharCode(65 + (temp % 26)) + columnName;
    temp = Math.floor(temp / 26) - 1;
  }
  
  return columnName;
};

export const ExcelViewer = ({ file }: { file: File }) => {
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [activeSheet, setActiveSheet] = useState<string>('');

  useEffect(() => {
    let mounted = true;

    // Create downloadable URL for the file
    const downloadUrl = URL.createObjectURL(file);
    setFileUrl(downloadUrl);

    const parseExcel = async () => {      
      try {
        setIsLoading(true);
        const arrayBuffer = await file.arrayBuffer();
        
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        const sheetsData: SheetData[] = workbook.SheetNames.map(name => {
          const worksheet = workbook.Sheets[name];
          // Convert sheet to JSON (array of arrays format)
          const data = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
          return { name, data: data as any[][] };
        });
        
        if (mounted) {
          setSheets(sheetsData);          
          if (sheetsData.length > 0) {
            setActiveSheet(sheetsData[0].name);
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Excel processing error:', err);
        if (mounted) {
          setError(
            `Failed to process Excel file: ${
              err instanceof Error ? err.message : 'Unknown error'
            }`
          );
          setIsLoading(false);
        }
      }
    };

    parseExcel();

    return () => {
      mounted = false;
      URL.revokeObjectURL(downloadUrl);
    };
  }, [file]);

  // Display loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Loading Excel data...</p>
        <p className="text-xs text-muted-foreground mt-2">
          This may take a moment for large files
        </p>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // No sheets found
  if (sheets.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No data found in Excel file</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Custom styles for Excel-like appearance with horizontal scrolling */}
      <style dangerouslySetInnerHTML={{ __html: `
        .excel-container {
          overflow-x: auto;
          max-width: 100%;
          position: relative;
          background-color: #f8f9fa;
          border-radius: 4px;
        }
        
        /* Custom scrollbar styling */
        .excel-container::-webkit-scrollbar {
          height: 8px;
        }
        
        .excel-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        .excel-container::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        
        .excel-container::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        
        .excel-table table {
          border-collapse: collapse;
          table-layout: auto;
          width: auto;
          min-width: 100%;
          background-color: white;
        }
        
        .excel-table th, .excel-table td {
          border: 1px solid #e5e7eb;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 8px 12px;
          min-width: 100px;
          font-size: 14px;
        }
        
        .excel-cell-header {
          background-color: #f3f4f6;
          font-weight: 600;
          color: #4b5563;
        }
        
        .excel-table td:first-child, .excel-table th:first-child {
          position: sticky;
          left: 0;
          z-index: 10;
          background-color: #f3f4f6;
          min-width: 40px;
          width: 40px;
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
        }
        
        /* Make sure the headers stay on top when scrolling */
        .excel-table thead th {
          position: sticky;
          top: 0;
          z-index: 20;
          background-color: #f3f4f6;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          height: 36px;
        }
        
        /* The corner cell needs highest z-index */
        .excel-table thead th:first-child {
          z-index: 30;
        }
        
        /* Improving the visual appearance to match the image */
        .excel-table {
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }
      ` }} />
      
      {/* Sheet tabs */}
      <Tabs 
        defaultValue={sheets[0]?.name} 
        className="w-full flex-1 flex flex-col px-4"
        onValueChange={setActiveSheet}
      >
        <div className="flex justify-between items-center mb-2">
          {/* Hide tabs if only one sheet */}
          {sheets.length > 1 && (
            <TabsList className="bg-gray-100 rounded-md p-0.5">
              {sheets.map((sheet) => (
                <TabsTrigger 
                  key={sheet.name} 
                  value={sheet.name} 
                  className="px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  {sheet.name}
                </TabsTrigger>
              ))}
            </TabsList>
          )}
          
          <div className="text-sm text-muted-foreground mr-2">
            {sheets.map(sheet => (
              <div 
                key={sheet.name} 
                className="tabsheet-info" 
                style={{ display: sheet.name === activeSheet ? 'block' : 'none' }}
              >
                {sheet.data.length} rows × {sheet.data[0]?.length || 0} columns
              </div>
            ))}
          </div>
        </div>

        {sheets.map((sheet) => (
          <TabsContent key={sheet.name} value={sheet.name} className="flex-1 min-h-0">
            <div className="excel-container h-full overflow-auto">
              <div className="excel-table h-full">
                <UITable>
                <TableHeader>
                  <TableRow>
                    {/* Corner cell for row/column headers intersection */}
                    <TableHead className="excel-cell-header text-center"></TableHead>
                    
                    {/* Column headers (A, B, C, etc.) */}
                    {Array.from({ length: sheet.data[0]?.length || 0 }).map((_, colIndex) => (
                      <TableHead 
                        key={colIndex} 
                        className="excel-cell-header text-center"
                      >
                        {getExcelColumnName(colIndex)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sheet.data.map((row: any[], rowIndex: number) => (
                    <TableRow key={rowIndex}>
                      {/* Row number */}
                      <TableCell className="excel-cell-header text-center">
                        {rowIndex + 1}
                      </TableCell>
                      
                      {/* Row data */}
                      {row.map((cell: any, cellIndex: number) => (
                        <TableCell key={cellIndex}>
                          {cell !== undefined && cell !== null ? String(cell) : ''}
                        </TableCell>
                      ))}

                      {/* Fill empty cells if row is shorter than max columns */}
                      {Array.from({ length: Math.max(0, (sheet.data[0]?.length || 0) - row.length) }).map((_, i) => (
                        <TableCell key={`empty-${rowIndex}-${i}`}></TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </UITable>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Download button */}
      <div className="border-t mt-3 border-gray-300 flex justify-end p-4">
        {fileUrl && (
          <Button variant="default" className="bg-black hover:bg-gray-800 text-white rounded-md px-3" asChild>
            <a
              href={fileUrl}
              download={file.name}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};

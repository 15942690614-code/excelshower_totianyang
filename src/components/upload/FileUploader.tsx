'use client';

import React, { useState, useCallback } from 'react';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { parseFile } from '@/lib/parsers';
import { ParsedData } from '@/types';

interface FileUploaderProps {
  onDataParsed: (data: ParsedData[]) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onDataParsed }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    validateAndSetFiles(droppedFiles);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      validateAndSetFiles(selectedFiles);
    }
  }, []);

  const validateAndSetFiles = (newFiles: File[]) => {
    if (newFiles.length > 10) {
      setError('Max 10 files allowed');
      return;
    }
    const validFiles = newFiles.filter(f => f.size <= 50 * 1024 * 1024);
    if (validFiles.length !== newFiles.length) {
      setError('Some files exceeded 50MB limit');
    } else {
      setError(null);
    }
    setFiles(validFiles);
  };

  const handleUpload = async () => {
    setParsing(true);
    setError(null);
    try {
      console.log('Starting file processing...', files.map(f => f.name));
      const results = await Promise.all(files.map(async file => {
        const parsed = await parseFile(file);
        console.log(`Parsed raw data for ${file.name}:`, parsed);
        
        // If it's a PDF/Word/Image and has raw text but unstructured rows, use AI to structure it
        if (['pdf', 'word', 'image'].includes(parsed.fileType) && parsed.rows.length > 0) {
             console.log(`Sending content of ${file.name} to AI for analysis...`);
             try {
                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content: parsed.fullText || JSON.stringify(parsed.rows),
                        fileType: parsed.fileType
                    })
                });
                
                if (response.ok) {
                    const aiData = await response.json();
                    console.log(`AI Analysis result for ${file.name}:`, aiData);
                    if (aiData.headers && aiData.rows) {
                        return { ...parsed, headers: aiData.headers, rows: aiData.rows };
                    }
                } else {
                    const errorText = await response.text();
                    console.error('AI API Error:', errorText);
                }
             } catch (e) {
                 console.warn('AI analysis failed, falling back to raw parse', e);
             }
        } else if (parsed.fileType === 'excel') {
             // For Excel, double check headers and rows
             console.log('Excel structure check:', { headers: parsed.headers, rowsLength: parsed.rows.length });
        }

        return parsed;
      }));
      
      console.log('Final processed data:', results);
      onDataParsed(results);
    } catch (err: any) {
      console.error('Upload Error:', err);
      setError('Error parsing files: ' + err.message);
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept=".xlsx,.xls,.pdf,.docx,.jpg,.png"
        />
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-10 w-10 text-gray-400" />
          <p className="text-lg font-medium text-gray-700">
            Drag & Drop files here or click to upload
          </p>
          <p className="text-sm text-gray-500">
            Supports Excel, PDF, Word, Images (Max 50MB)
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">{file.name}</span>
                <span className="text-xs text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <Button
        className="w-full"
        onClick={handleUpload}
        disabled={files.length === 0 || parsing}
      >
        {parsing ? 'Processing...' : 'Process Files'}
      </Button>
    </div>
  );
};

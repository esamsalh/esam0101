
import React, { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import FileUploader from './components/FileUploader';
import ResultCard from './components/ResultCard';
import { OCRResult } from './types';
import { processImageOCR } from './services/geminiService';

const App: React.FC = () => {
  const [results, setResults] = useState<OCRResult[]>([]);
  const [isGlobalProcessing, setIsGlobalProcessing] = useState(false);

  const handleFilesSelected = (files: FileList) => {
    const fileArray = Array.from(files);
    const newResults: OCRResult[] = fileArray.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      fileName: file.name,
      previewUrl: URL.createObjectURL(file),
      status: 'pending'
    }));

    setResults(prev => [...newResults, ...prev]);
    
    // Start processing each file
    fileArray.forEach((file, index) => {
      startOCR(file, newResults[index].id);
    });
  };

  const startOCR = async (file: File, id: string) => {
    setIsGlobalProcessing(true);
    setResults(prev => prev.map(r => r.id === id ? { ...r, status: 'processing' } : r));

    const result = await processImageOCR(file, id);

    setResults(prev => prev.map(r => 
      r.id === id ? { 
        ...r, 
        ...result 
      } : r
    ));
    
    setIsGlobalProcessing(false);
  };

  const removeResult = (id: string) => {
    setResults(prev => {
      const filtered = prev.filter(r => r.id !== id);
      const target = prev.find(r => r.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return filtered;
    });
  };

  const clearAll = () => {
    results.forEach(r => URL.revokeObjectURL(r.previewUrl));
    setResults([]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
        {/* Intro Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Professional Document Digitization
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Extract text and tables from official documents with pixel-perfect accuracy. 
            Supports Arabic/English and maintains original formatting.
          </p>
        </header>

        {/* Upload Section */}
        <section className="mb-16">
          <FileUploader 
            onFilesSelected={handleFilesSelected} 
            isProcessing={isGlobalProcessing} 
          />
        </section>

        {/* Results Section */}
        {results.length > 0 && (
          <section className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-800">Extracted Documents</h2>
                <span className="bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {results.length}
                </span>
              </div>
              <button 
                onClick={clearAll}
                className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1.5"
              >
                <i className="fa-solid fa-trash-can text-xs"></i>
                Clear All
              </button>
            </div>

            {results.map(result => (
              <ResultCard 
                key={result.id} 
                result={result} 
                onRemove={removeResult} 
              />
            ))}
          </section>
        )}

        {/* Empty State Illustration */}
        {results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 opacity-40 grayscale pointer-events-none">
            <img 
              src="https://picsum.photos/seed/ocr/400/300" 
              alt="Empty State" 
              className="rounded-2xl mb-6 shadow-lg grayscale"
            />
            <p className="text-slate-500 font-medium italic">No documents processed yet</p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-8 mb-6">
            <i className="fa-solid fa-shield-halved text-slate-400 text-xl" title="Secure Processing"></i>
            <i className="fa-solid fa-bolt text-slate-400 text-xl" title="Fast Execution"></i>
            <i className="fa-solid fa-microchip text-slate-400 text-xl" title="AI Powered"></i>
          </div>
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} VisionOCR Architect. All document processing is handled via advanced multimodal models.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;

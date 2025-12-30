
import React, { useState } from 'react';
import { OCRResult, TextBlock, ExtractedTable } from '../types';

interface ResultCardProps {
  result: OCRResult;
  onRemove: (id: string) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onRemove }) => {
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');

  const copyToClipboard = () => {
    const text = result.data?.rawText || '';
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const downloadHtml = () => {
    const content = document.getElementById(`result-content-${result.id}`)?.innerHTML;
    if (!content) return;
    const blob = new Blob([`<html><body style="font-family: sans-serif; padding: 40px;">${content}</body></html>`], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.fileName}-extracted.html`;
    a.click();
  };

  const renderContent = () => {
    if (viewMode === 'raw') {
      return (
        <pre className="whitespace-pre-wrap text-sm text-slate-700 bg-slate-100 p-4 rounded-lg font-mono leading-relaxed" dir="auto">
          {result.data?.rawText}
        </pre>
      );
    }

    return (
      <div id={`result-content-${result.id}`} className="space-y-6">
        {result.data?.blocks.map((block: any, idx) => {
          if (block.type === 'table' || block.rows) {
            return (
              <div key={idx} className="overflow-x-auto my-4 rounded-xl border border-slate-200 shadow-sm">
                <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700">
                  <tbody className="bg-white divide-y divide-slate-100">
                    {block.rows?.map((row: any, rIdx: number) => (
                      <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        {row.cells?.map((cell: any, cIdx: number) => (
                          <td 
                            key={cIdx} 
                            className={`px-4 py-3 ${cell.isHeader ? 'font-bold bg-slate-100 text-slate-900 text-center' : 'text-center'}`}
                            dir="auto"
                          >
                            {cell.content}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          const Tag = block.type === 'heading' ? 'h3' : 'p';
          const alignmentClass = block.alignment === 'rtl' ? 'text-right' : 'text-left';
          const dirAttr = block.alignment === 'rtl' ? 'rtl' : 'ltr';

          return (
            <Tag 
              key={idx} 
              dir={dirAttr}
              className={`
                ${alignmentClass} 
                ${block.type === 'heading' ? 'text-xl font-bold text-slate-800 mt-6 mb-3' : 'text-slate-700 leading-relaxed mb-4'}
              `}
            >
              {block.content}
            </Tag>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200">
            <img src={result.previewUrl} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 text-sm truncate max-w-[200px]">{result.fileName}</h4>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${result.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                {result.status === 'completed' ? 'Extraction Successful' : 'Processing...'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-200 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('formatted')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'formatted' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Formatted
            </button>
            <button 
              onClick={() => setViewMode('raw')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'raw' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Raw Text
            </button>
          </div>
          <div className="w-px h-6 bg-slate-300 mx-1"></div>
          <button 
            onClick={copyToClipboard}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
            title="Copy Text"
          >
            <i className="fa-regular fa-copy"></i>
          </button>
          <button 
            onClick={downloadHtml}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
            title="Export as HTML"
          >
            <i className="fa-solid fa-download"></i>
          </button>
          <button 
            onClick={() => onRemove(result.id)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors"
            title="Remove"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-8 max-h-[600px] overflow-y-auto custom-scrollbar">
        {result.status === 'processing' && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 text-sm font-medium">Analyzing document structure & tables...</p>
          </div>
        )}

        {result.status === 'error' && (
          <div className="flex flex-col items-center justify-center py-10 bg-red-50 rounded-xl border border-red-100">
            <i className="fa-solid fa-circle-exclamation text-red-400 text-3xl mb-3"></i>
            <p className="text-red-700 font-semibold mb-1">OCR Processing Failed</p>
            <p className="text-red-600 text-sm">{result.error}</p>
          </div>
        )}

        {result.status === 'completed' && renderContent()}
      </div>
    </div>
  );
};

export default ResultCard;

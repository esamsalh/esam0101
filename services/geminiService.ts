
import { GoogleGenAI, Type } from "@google/genai";
import { OCRResult, TextBlock, ExtractedTable } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `You are a professional OCR systems architect. 
Extract text from the provided image EXACTLY as written. 
DO NOT paraphrase, summarize, or improve the text.
Preserve the original text order, paragraph structure, and line breaks.

Detect tables and represent them in a structured format. 
Return the result in JSON format following this schema:
{
  "blocks": [
    {
      "type": "paragraph" | "heading" | "list-item",
      "content": "string text here",
      "alignment": "rtl" | "ltr"
    },
    {
      "type": "table",
      "rows": [
        {
          "cells": [
            { "content": "cell content", "isHeader": boolean }
          ]
        }
      ]
    }
  ],
  "rawText": "full extracted text as one string"
}

Support both Arabic and English. Use "rtl" for Arabic-dominated text blocks and "ltr" for English-dominated text blocks.`;

export const processImageOCR = async (
  file: File,
  id: string
): Promise<Partial<OCRResult>> => {
  try {
    const base64Data = await fileToBase64(file);
    const mimeType = file.type;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: "Perform professional OCR on this image. Identify all text and tables. Return ONLY JSON." }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.1, // Low temperature for higher accuracy in extraction
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            blocks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  content: { type: Type.STRING },
                  alignment: { type: Type.STRING },
                  rows: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        cells: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              content: { type: Type.STRING },
                              isHeader: { type: Type.BOOLEAN }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            rawText: { type: Type.STRING }
          }
        }
      }
    });

    const resultData = JSON.parse(response.text || '{}');
    return {
      id,
      status: 'completed',
      data: resultData
    };
  } catch (error: any) {
    console.error("OCR Error:", error);
    return {
      id,
      status: 'error',
      error: error.message || "Failed to process image"
    };
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

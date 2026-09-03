import React from 'react'
import { DocumentUpload } from '@/components/documents/DocumentUpload'
import { DocumentList } from '@/components/documents/DocumentList'

export default function KnowledgeBase() {
  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Knowledge Base</h1>
        <p className="text-muted-foreground">
          Upload documents to provide context for Python AI. Supported formats: PDF, DOCX, TXT, CSV, MD, PPTX, XLSX.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="bg-card border rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Your Documents</h2>
            <DocumentList />
          </div>
        </div>
        
        <div className="col-span-1 space-y-6">
          <div className="bg-card border rounded-xl shadow-sm p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Upload New</h2>
            <DocumentUpload />
          </div>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Chat from './pages/Chat'
import KnowledgeBase from './pages/KnowledgeBase'
import Settings from './pages/Settings'
import { Toaster } from 'sonner'

function App() {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Chat />} />
          <Route path="/c/:chatId" element={<Chat />} />
          <Route path="/documents" element={<KnowledgeBase />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
      <Toaster position="top-right" theme="system" richColors />
    </>
  )
}

export default App

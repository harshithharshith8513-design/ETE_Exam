import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { IdeasGallery } from './pages/IdeasGallery';
import { IdeaDetail } from './pages/IdeaDetail';
import { CreateIdea } from './pages/CreateIdea';
import { EditIdea } from './pages/EditIdea';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/ideas" element={<IdeasGallery />} />
                <Route path="/ideas/:id" element={<IdeaDetail />} />
                <Route path="/ideas/create" element={<CreateIdea />} />
                <Route path="/ideas/:id/edit" element={<EditIdea />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>
            
            <footer className="border-t border-emerald-500/20 dark:border-purple-500/20 py-6 text-center text-xs opacity-80 glass-card mt-auto transition-colors">
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                <p>© 2026 Innovation Idea Hub. Production-Ready MERN Stack Application.</p>
                <div className="flex items-center space-x-4">
                  <span>Node.js + Express</span>
                  <span>•</span>
                  <span>MongoDB + Mongoose</span>
                  <span>•</span>
                  <span>React + Tailwind CSS</span>
                </div>
              </div>
            </footer>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

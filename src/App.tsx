import React, { useState, useEffect } from 'react';
import { DressProject, UserSession } from './types';
import { ProjectStorage } from './lib/storage';
import { Header } from './components/Header';
import { AuthGate } from './components/AuthGate';
import { ProjectList } from './components/ProjectList';
import { ProjectDetailView } from './components/ProjectDetailView';
import { NewProjectModal } from './components/NewProjectModal';
import { SettingsModal } from './components/SettingsModal';
import { geminiBrain } from './services/gemini';

export const App: React.FC = () => {
  const [session, setSession] = useState<UserSession>(ProjectStorage.getUserSession());
  const [projects, setProjects] = useState<DressProject[]>(ProjectStorage.getProjects());
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(!!geminiBrain.getApiKey());

  useEffect(() => {
    setProjects(ProjectStorage.getProjects());
  }, []);

  const handleLogout = () => {
    ProjectStorage.clearUserSession();
    setSession({
      isAuthenticated: false,
      name: 'Guest',
      role: 'reviewer',
      authMethod: 'passcode'
    });
  };

  const handleCreateProject = (newProject: DressProject) => {
    const updated = [newProject, ...projects];
    setProjects(updated);
    ProjectStorage.saveProjects(updated);
    setSelectedProjectId(newProject.id);
  };

  const handleUpdateProject = (updatedProject: DressProject) => {
    const updatedList = projects.map(p => (p.id === updatedProject.id ? updatedProject : p));
    setProjects(updatedList);
    ProjectStorage.saveProjects(updatedList);
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // If user is not yet authenticated, render the Cloudflare Auth Gate!
  if (!session.isAuthenticated) {
    return <AuthGate onLoginSuccess={(s) => setSession(s)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Prompt',sans-serif]">
      
      {/* Top Header */}
      <Header
        session={session}
        onLogout={handleLogout}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        hasGeminiKey={hasGeminiKey}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 md:py-8">
        {selectedProject ? (
          <ProjectDetailView
            project={selectedProject}
            onBack={() => setSelectedProjectId(null)}
            onUpdateProject={handleUpdateProject}
          />
        ) : (
          <ProjectList
            projects={projects}
            onSelectProject={(proj) => setSelectedProjectId(proj.id)}
            onNewProject={() => setIsNewProjectModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Fashion Ad Studio © 2025 • ขับเคลื่อนด้วย Google AI Studio (Gemini 2.5) & Google Flow Video Architecture
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Cloudflare Edge Deployment Ready</span>
            <span>•</span>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="hover:text-pink-400 transition"
            >
              ตั้งค่าระบบ
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onCreateProject={handleCreateProject}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onKeySaved={() => setHasGeminiKey(!!geminiBrain.getApiKey())}
      />

    </div>
  );
};

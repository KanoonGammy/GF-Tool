import React, { useState } from 'react';
import { DressProject, VideoIteration, DoDChecklist, RevisionMemory, GarmentDNA } from '../types';
import { StoryboardDirectorView } from './StoryboardDirectorView';
import { VideoReviewRoom } from './VideoReviewRoom';
import { GarmentDnaView } from './GarmentDnaView';
import { ArchetypeKnowledgeView } from './ArchetypeKnowledgeView';
import { CumulativeMemoryTimeline } from './CumulativeMemoryTimeline';
import { RevisionModal } from './RevisionModal';
import { PersistentReferenceSidebar } from './PersistentReferenceSidebar';
import { ArchetypeKnowledgeManager } from '../lib/archetypeKnowledge';
import { ArrowLeft, Video, Sparkles, BrainCircuit, ShieldCheck, Film, Layers, CheckCircle2, ChevronRight, User, BookOpen } from 'lucide-react';
import { ProjectStorage } from '../lib/storage';

interface ProjectDetailViewProps {
  project: DressProject;
  onBack: () => void;
  onUpdateProject: (updated: DressProject) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  onBack,
  onUpdateProject
}) => {
  // Determine smart default tab:
  // User explicitly requested: Storyboard Grid & Prompt loop is the MAIN SCREEN ("ตรงนี้จะเป็นหน้าหลักเลย")!
  const [activeTab, setActiveTab] = useState<'storyboard' | 'review' | 'dna' | 'knowledge'>('storyboard');
  const [selectedIterationIndex, setSelectedIterationIndex] = useState<number>(
    project.iterations && project.iterations.length > 0 ? project.iterations.length - 1 : 0
  );
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);

  const currentIteration = project.iterations?.[selectedIterationIndex] || {
    id: 'placeholder-iter',
    iterationNumber: 1,
    durationSeconds: 10,
    engine: 'google_flow_omni',
    positivePrompt: 'คำสั่งสร้างวิดีโอยังไม่ถูกสร้าง',
    negativePrompt: 'default negatives',
    createdAt: new Date().toISOString()
  };

  // Handler for Proceeding to Video Generation from Storyboard
  const handleProceedToVideoGeneration = (positivePrompt: string, negativePrompt: string) => {
    // Generate new iteration and switch to DoD Review room!
    const nextIterationNum = (project.iterations?.length || 0) + 1;
    const newIteration: VideoIteration = {
      id: `iter-${Date.now()}`,
      iterationNumber: nextIterationNum,
      videoUrl: project.iterations?.[0]?.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-pink-dress-posing-40742-large.mp4',
      coverImageUrl: project.iterations?.[0]?.coverImageUrl || '/samples/pomelo_model_wearing.jpg',
      positivePrompt,
      negativePrompt,
      durationSeconds: 10,
      engine: 'google_flow_omni',
      createdAt: new Date().toISOString()
    };

    const updatedIterations = [...(project.iterations || []), newIteration];
    const updatedProj: DressProject = {
      ...project,
      status: 'ready_for_review',
      iterations: updatedIterations,
      updatedAt: new Date().toISOString()
    };

    ProjectStorage.saveProject(updatedProj);
    onUpdateProject(updatedProj);
    setSelectedIterationIndex(updatedIterations.length - 1);
    setActiveTab('review'); // Take user to DoD Review room!
  };

  // Handler for DoD Acceptance
  const handleAcceptDoD = (checklist: DoDChecklist, notes: string) => {
    const updatedIterations = [...(project.iterations || [])];
    if (updatedIterations[selectedIterationIndex]) {
      updatedIterations[selectedIterationIndex] = {
        ...updatedIterations[selectedIterationIndex],
        dodEvaluation: {
          checklist,
          decision: 'ACCEPTED',
          reviewerNotes: notes,
          reviewedAt: new Date().toISOString()
        }
      };
    }

    const updatedProj: DressProject = {
      ...project,
      status: 'approved',
      iterations: updatedIterations,
      updatedAt: new Date().toISOString()
    };

    ProjectStorage.saveProject(updatedProj);
    onUpdateProject(updatedProj);
  };

  // Handler for Submitting Revision & Learning
  const handleSubmitRevision = (newMemory: RevisionMemory) => {
    const nextIterationNum = (project.iterations?.length || 0) + 1;

    // Create new iteration record
    const newIteration: VideoIteration = {
      id: `iter-${Date.now()}`,
      iterationNumber: nextIterationNum,
      positivePrompt: `[STYLE]: High-end luxury fashion commercial film...\n[REVISION_DIRECTIVE]: ${newMemory.aiLearnedRule}`,
      negativePrompt: [...(project.garmentDna?.defaultNegativePrompts || []), ...newMemory.addedNegativeTokens].join(', '),
      durationSeconds: 10,
      engine: 'google_flow_omni',
      createdAt: new Date().toISOString()
    };

    const updatedMemories = [...(project.revisionMemories || []), newMemory];
    const updatedIterations = [...(project.iterations || []), newIteration];

    // Automatically record caution rule into Archetype Knowledge Base so AI learns forever!
    ArchetypeKnowledgeManager.addRuleFromFeedback(
      project.category || 'knitwear',
      newMemory.userFeedbackText,
      newMemory.addedNegativeTokens
    );

    const updatedProj: DressProject = {
      ...project,
      status: 'revision_requested',
      iterations: updatedIterations,
      revisionMemories: updatedMemories,
      updatedAt: new Date().toISOString()
    };

    ProjectStorage.saveProject(updatedProj);
    onUpdateProject(updatedProj);
    setSelectedIterationIndex(updatedIterations.length - 1);
    setActiveTab('storyboard'); // Go back to Main Storyboard screen with updated diff!
  };

  // Handler for updating Garment DNA
  const handleUpdateDna = (updatedDna: GarmentDNA) => {
    const updatedProj: DressProject = {
      ...project,
      garmentDna: updatedDna,
      updatedAt: new Date().toISOString()
    };
    ProjectStorage.saveProject(updatedProj);
    onUpdateProject(updatedProj);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="กลับไปหน้ารวมแคมเปญ"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-black text-white">{project.title}</h2>
              {project.status === 'approved' && (
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  DoD Passed
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              หมวดหมู่: <span className="text-slate-200 capitalize">{project.category.replace('_', ' ')}</span> • นางแบบ: <span className="text-pink-300 font-semibold">{project.modelPersona ? `${project.modelPersona.name} (${project.modelPersona.nationality})` : 'มาตรฐาน'}</span>
            </p>
          </div>
        </div>

        {/* Iteration Selector Pills */}
        {project.iterations && project.iterations.length > 0 && (
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-slate-800 overflow-x-auto">
            <span className="text-[11px] text-slate-500 px-2 font-semibold">รอบวิดีโอ:</span>
            {project.iterations.map((iter, idx) => (
              <button
                key={iter.id}
                onClick={() => setSelectedIterationIndex(idx)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                  selectedIterationIndex === idx
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                #{iter.iterationNumber}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Tabs Navigation: Storyboard (Main) -> DoD Review -> Garment DNA -> AI Knowledge */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        
        {/* Tab 1: Main Screen - Storyboard 2x3 & Prompt Studio */}
        <button
          onClick={() => setActiveTab('storyboard')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition flex-shrink-0 ${
            activeTab === 'storyboard'
              ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 text-white shadow-lg shadow-pink-500/25 ring-1 ring-pink-400'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>1. หน้าหลัก: Storyboard (2x3) & Prompt Studio</span>
        </button>

        {/* Tab 2: Definition of Done Review Room */}
        <button
          onClick={() => setActiveTab('review')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition flex-shrink-0 ${
            activeTab === 'review'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>2. ตรวจรับงาน Definition of Done</span>
        </button>

        {/* Tab 3: Garment DNA & Fabric/Color Scanner */}
        <button
          onClick={() => setActiveTab('dna')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition flex-shrink-0 ${
            activeTab === 'dna'
              ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>3. พาสปอร์ตชุด & สแกนผ้า 4 สี (DNA)</span>
        </button>

        {/* Tab 4: AI Archetype Knowledge Base */}
        <button
          onClick={() => setActiveTab('knowledge')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition flex-shrink-0 ${
            activeTab === 'knowledge'
              ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>4. คลังข้อควรระวังตามประเภทเสื้อผ้า</span>
        </button>

      </div>

      {/* Main Workspace with Persistent Reference Sidebar across ALL tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Active Step Workspace (Takes 8-9 cols) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          
          {/* Tab 1: Main Screen - Storyboard 2x3 Grid + Iterative Prompt Refinement */}
          {activeTab === 'storyboard' && project.garmentDna && (
            <StoryboardDirectorView
              project={project}
              dna={project.garmentDna}
              onProceedToVideoGeneration={handleProceedToVideoGeneration}
              onUpdateProject={onUpdateProject}
            />
          )}

          {/* Tab 2: Definition of Done Review Room */}
          {activeTab === 'review' && (
            <VideoReviewRoom
              project={project}
              currentIteration={currentIteration}
              onAccept={handleAcceptDoD}
              onRequestRevision={() => setIsRevisionModalOpen(true)}
            />
          )}

          {/* Tab 3: Garment DNA & Fabric Scanner */}
          {activeTab === 'dna' && project.garmentDna && (
            <GarmentDnaView
              dna={project.garmentDna}
              onUpdateDna={handleUpdateDna}
            />
          )}

          {/* Tab 4: AI Archetype Knowledge Base & Timeline */}
          {activeTab === 'knowledge' && (
            <div className="space-y-6">
              <ArchetypeKnowledgeView currentCategory={project.category} />
              <CumulativeMemoryTimeline memories={project.revisionMemories || []} />
            </div>
          )}
        </div>

        {/* Right Column: Persistent Reference Sidebar (Always visible on all tabs!) */}
        <div className="lg:col-span-4 xl:col-span-3 sticky top-20">
          <PersistentReferenceSidebar project={project} />
        </div>

      </div>

      {/* Revision Modal */}
      {project.garmentDna && (
        <RevisionModal
          isOpen={isRevisionModalOpen}
          onClose={() => setIsRevisionModalOpen(false)}
          iterationNumber={currentIteration.iterationNumber}
          dna={project.garmentDna}
          historicalMemories={project.revisionMemories || []}
          onSubmitRevision={handleSubmitRevision}
        />
      )}

    </div>
  );
};

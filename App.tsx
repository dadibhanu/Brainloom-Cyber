import React, { useState } from 'react';
import { LEVELS, MODULES } from './constants';
import { LevelMap } from './components/LevelMap';
import { LabInterface } from './components/LabInterface';
import { HomePage } from './components/HomePage';
import { UserProgress } from './types';

const App: React.FC = () => {
    const [progress, setProgress] = useState<UserProgress>({
        completedLevels: [],
        currentLevelId: 'sqli-1', // Default
        xp: 1250,
        streak: 12
    });
    
    // Navigation State
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'HOME' | 'MAP' | 'LAB'>('HOME');

    // Derived Data
    const activeModule = MODULES.find(m => m.id === activeModuleId);
    const moduleLevels = activeModuleId ? LEVELS.filter(l => l.moduleId === activeModuleId) : [];
    
    // Ensure current level exists within the active module context, or default to first of module
    const currentLevel = LEVELS.find(l => l.id === progress.currentLevelId) || moduleLevels[0] || LEVELS[0];

    // Handlers
    const handleModuleSelect = (moduleId: string) => {
        setActiveModuleId(moduleId);
        
        // When entering a module, find the first incomplete level or the last accessed one
        const modLevels = LEVELS.filter(l => l.moduleId === moduleId);
        if (modLevels.length > 0) {
            // Find first level not in completed list
            const firstIncomplete = modLevels.find(l => !progress.completedLevels.includes(l.id));
            if (firstIncomplete) {
                setProgress(prev => ({...prev, currentLevelId: firstIncomplete.id}));
            } else {
                // If all completed, go to last one
                setProgress(prev => ({...prev, currentLevelId: modLevels[modLevels.length - 1].id}));
            }
        }
        
        setViewMode('MAP');
    };

    const handleLevelSelect = (id: string) => {
        // Logic to ensure level is unlockable is handled in UI, but double check here
        // Simple check: is it in the current module?
        const targetLevel = LEVELS.find(l => l.id === id);
        if (targetLevel && targetLevel.moduleId === activeModuleId) {
             setProgress(prev => ({ ...prev, currentLevelId: id }));
             setViewMode('LAB');
        }
    };

    const handleLevelComplete = () => {
        if (!progress.completedLevels.includes(currentLevel.id)) {
            setProgress(prev => ({
                ...prev,
                completedLevels: [...prev.completedLevels, currentLevel.id],
                xp: prev.xp + 500
            }));
        }
    };

    const handleBackToMap = () => {
        setViewMode('MAP');
    };

    const handleHome = () => {
        setActiveModuleId(null);
        setViewMode('HOME');
    };

    return (
        <div className="flex flex-col h-screen bg-background-dark overflow-hidden font-display text-white selection:bg-primary selection:text-white">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-grid-pattern cyber-grid opacity-30"></div>
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent-green/10 rounded-full blur-[120px]"></div>
            </div>

            {/* Header */}
            <header className="relative z-20 flex items-center justify-between border-b border-border-dark bg-background-dark/80 backdrop-blur-md px-4 md:px-8 py-3 h-16 shrink-0">
                <div className="flex items-center gap-4">
                    <div 
                        onClick={handleHome}
                        className="flex items-center justify-center size-9 rounded bg-gradient-to-br from-primary to-[#5e5eff] shadow-neon cursor-pointer hover:scale-105 transition-transform"
                    >
                        <span className="material-symbols-outlined text-white" style={{fontSize: 24}}>security</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-white hidden md:block cursor-pointer" onClick={handleHome}>
                        Brainloom <span className="text-primary font-mono text-sm ml-2">// {activeModule ? activeModule.title.toUpperCase() : 'DASHBOARD'}</span>
                    </h1>
                    
                    {activeModuleId && (
                        <>
                            <div className="h-6 w-px bg-border-dark mx-2 hidden md:block"></div>
                            <nav className="flex gap-6">
                                <button 
                                    onClick={() => setViewMode('MAP')}
                                    className={`text-sm font-medium flex items-center gap-1 transition-colors ${viewMode === 'MAP' ? 'text-primary' : 'text-[#9090cb] hover:text-white'}`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">map</span> Path
                                </button>
                                <button 
                                    onClick={() => setViewMode('LAB')}
                                    className={`text-sm font-medium flex items-center gap-1 transition-colors ${viewMode === 'LAB' ? 'text-primary' : 'text-[#9090cb] hover:text-white'}`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">terminal</span> Lab
                                </button>
                            </nav>
                        </>
                    )}
                </div>
                
                <div className="flex items-center gap-6">
                    <button onClick={handleHome} className={`md:hidden ${viewMode === 'HOME' ? 'hidden' : ''} text-[#9090cb]`}>
                        <span className="material-symbols-outlined">home</span>
                    </button>
                    <div className="hidden md:flex flex-col items-end">
                        <div className="text-xs text-[#9090cb] font-mono">CyberUser_99</div>
                        <div className="text-xs text-accent-green">{progress.xp} XP</div>
                    </div>
                    <div className="size-9 rounded-full bg-cover bg-center border-2 border-border-dark shadow-neon" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDSk5ZxF1uVl4uYFqcwWq8Runn-bJVoHjeos9Do_6BicmRba_GvD54K1TFyJ3ADUdiyvmpbpx1iDDUdytom87cZzI_U-b0F52kxWDR2O6_Hq9J9UXJHM0uUhgj6MlBAJP7bG2IXgdRObSYFUWzNJaq58RGAG3OSoPhjjHhRx4EGLU-eEG9Tirgg4NSLBtRYWB4ialajN9tOEjLas4NuGNGPuZqhzMnf8ov31UNIOdoh_nd9W6VvKSV6ypmCTYW-h1g3eXocYslxwg')"}}></div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-1 overflow-hidden flex">
                {viewMode === 'HOME' && (
                    <HomePage progress={progress} onSelectModule={handleModuleSelect} />
                )}

                {viewMode === 'MAP' && activeModuleId && (
                    <div className="w-full h-full overflow-auto bg-background-dark/50 relative">
                        <div className="absolute top-4 left-4 z-20">
                            <button onClick={handleHome} className="bg-panel-dark/80 backdrop-blur border border-border-dark text-gray-400 hover:text-white px-3 py-1.5 rounded flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors">
                                <span className="material-symbols-outlined text-[16px]">grid_view</span> Dashboard
                            </button>
                        </div>
                        <LevelMap 
                            levels={moduleLevels}
                            currentLevelId={progress.currentLevelId} 
                            completedLevels={progress.completedLevels}
                            onSelectLevel={handleLevelSelect}
                        />
                    </div>
                )}

                {viewMode === 'LAB' && activeModuleId && (
                    <div className="w-full h-full flex flex-col md:flex-row overflow-hidden">
                        {/* Educational Sidebar (Left) */}
                        <div className="w-full md:w-[400px] bg-panel-dark border-r border-border-dark flex flex-col overflow-hidden shrink-0">
                            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                                <button onClick={handleBackToMap} className="text-[#9090cb] hover:text-white flex items-center gap-1 text-xs mb-4 font-bold uppercase tracking-wider">
                                    <span className="material-symbols-outlined text-[14px]">arrow_back</span> Back to Map
                                </button>
                                
                                <h2 className="text-2xl font-bold text-white mb-1">{currentLevel.title}</h2>
                                <p className={`text-sm font-mono mb-4 ${activeModule?.color || 'text-primary'}`}>{currentLevel.subtitle}</p>
                                
                                <div className="mb-6 bg-background-dark/50 p-3 rounded border border-border-dark">
                                    <p className="text-gray-300 text-sm leading-relaxed">{currentLevel.description}</p>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-xs font-bold text-accent-green uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">business_center</span> Real World Context
                                    </h3>
                                    <p className="text-gray-400 text-xs italic">{currentLevel.context}</p>
                                </div>

                                <div className="space-y-6">
                                    <section>
                                        <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${activeModule?.color?.replace('text-', 'bg-') || 'bg-primary'}`}></span> What is it?
                                        </h3>
                                        <p className="text-gray-400 text-sm">{currentLevel.educational.whatIsIt}</p>
                                    </section>
                                    <section>
                                        <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> How it works
                                        </h3>
                                        <p className="text-gray-400 text-sm">{currentLevel.educational.howItWorks}</p>
                                    </section>
                                    <section>
                                        <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-accent-green"></span> Prevention
                                        </h3>
                                        <p className="text-gray-400 text-sm">{currentLevel.educational.prevention}</p>
                                    </section>

                                    {currentLevel.educational.codeSnippet && (
                                        <div className="mt-4 rounded-lg overflow-hidden border border-border-dark bg-[#0B0B15]">
                                            <div className="bg-[#1a1a2e] px-3 py-1 text-[10px] text-gray-500 font-mono border-b border-border-dark">CODE_SNIPPET.js</div>
                                            <pre className="p-3 text-xs text-gray-300 font-mono overflow-x-auto">
                                                <code>{currentLevel.educational.codeSnippet}</code>
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Hint Box */}
                            <div className="p-4 border-t border-border-dark bg-[#1a1a2e]/50">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-yellow-500 text-[20px] mt-0.5">lightbulb</span>
                                    <div>
                                        <h4 className="text-xs font-bold text-yellow-500 uppercase">Hacker Hint</h4>
                                        <p className="text-xs text-gray-400 mt-1">{currentLevel.lab.hint}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Lab (Right) */}
                        <div className="flex-1 p-4 md:p-8 bg-background-dark/50 overflow-hidden flex flex-col">
                            <LabInterface level={currentLevel} onComplete={handleLevelComplete} />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
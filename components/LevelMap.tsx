import React from 'react';
import { Level } from '../types';

interface LevelMapProps {
    levels: Level[]; // Receive filtered levels
    currentLevelId: string;
    completedLevels: string[];
    onSelectLevel: (id: string) => void;
}

export const LevelMap: React.FC<LevelMapProps> = ({ levels, currentLevelId, completedLevels, onSelectLevel }) => {
    
    return (
        <div className="relative w-full max-w-4xl min-h-[800px] flex flex-col items-center py-20">
            {/* SVG Connector Path - Visible if more than 1 level */}
            {levels.length > 1 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <filter id="glow" height="140%" width="140%" x="-20%" y="-20%">
                            <feGaussianBlur stdDeviation="4" result="blur"></feGaussianBlur>
                            <feComposite in="SourceGraphic" in2="blur" operator="over"></feComposite>
                        </filter>
                        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#00ff9d', stopOpacity: 1 }} />
                            <stop offset="50%" style={{ stopColor: '#2525f4', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#2a2a4a', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                    <path 
                        d="M 450 100 L 450 150 L 450 250 L 450 400 L 450 550 L 450 700 L 450 850" 
                        fill="none" 
                        stroke="url(#pathGradient)" 
                        strokeWidth="6" 
                        strokeLinecap="round"
                        style={{ filter: 'url(#glow)' }}
                        className="opacity-60"
                    />
                </svg>
            )}

            {levels.map((level, index) => {
                const isCompleted = completedLevels.includes(level.id);
                // A level is locked if it's not completed, not current, and the previous level isn't completed
                const isLocked = !isCompleted && 
                                 currentLevelId !== level.id && 
                                 index > 0 && 
                                 !completedLevels.includes(levels[index - 1].id);

                // Use the level's defined position, or fallback to auto-layout if position is missing/reused awkwardly
                // We use the same positions array for all modules, so it looks like a similar path
                
                return (
                    <div 
                        key={level.id}
                        className={`absolute z-10 flex flex-col items-center group transition-all duration-300 ${isLocked ? 'opacity-50 grayscale' : 'hover:scale-105'}`}
                        style={{ top: `${level.position.y}px`, left: '50%', transform: 'translateX(-50%)' }}
                        onClick={() => !isLocked && onSelectLevel(level.id)}
                    >
                        <div className="relative">
                            {currentLevelId === level.id && !isLocked && (
                                <div className="absolute inset-0 bg-primary/40 rounded-full animate-ping hex-shape"></div>
                            )}
                            
                            <div className={`
                                relative hex-shape w-24 h-24 flex items-center justify-center border-[4px] cursor-pointer transition-colors shadow-2xl
                                ${isCompleted ? 'bg-panel-dark border-accent-green shadow-neon-green' : 
                                  currentLevelId === level.id ? 'bg-background-dark border-primary shadow-neon' : 
                                  'bg-panel-dark border-border-dark'}
                            `}>
                                <span className={`material-symbols-outlined text-4xl
                                    ${isCompleted ? 'text-accent-green' : currentLevelId === level.id ? 'text-primary' : 'text-gray-600'}
                                `}>
                                    {isLocked ? 'lock' : isCompleted ? 'verified_user' : 'security'}
                                </span>
                            </div>

                            {/* Label Badge */}
                            <div className={`
                                absolute top-1/2 -translate-y-1/2 left-28 w-48 p-3 rounded-lg border backdrop-blur-md transition-all z-20
                                ${currentLevelId === level.id ? 'bg-primary/90 border-primary shadow-neon translate-x-2' : 
                                  'bg-panel-dark/90 border-border-dark group-hover:translate-x-2'}
                            `}>
                                <p className={`text-[10px] font-bold uppercase tracking-wider ${currentLevelId === level.id ? 'text-white/80' : 'text-gray-400'}`}>
                                    Sub-module {index + 1}
                                </p>
                                <h4 className="text-sm font-bold text-white">{level.title}</h4>
                                <p className={`text-[10px] mt-1 ${currentLevelId === level.id ? 'text-white/90' : 'text-gray-500'}`}>
                                    {level.subtitle}
                                </p>
                            </div>

                        </div>
                    </div>
                );
            })}
        </div>
    );
};

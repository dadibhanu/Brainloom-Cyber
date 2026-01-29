import React from 'react';
import { MODULES, LEVELS } from '../constants';
import { UserProgress } from '../types';

interface HomePageProps {
    progress: UserProgress;
    onSelectModule: (moduleId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ progress, onSelectModule }) => {
    
    const getModuleStats = (moduleId: string) => {
        const moduleLevels = LEVELS.filter(l => l.moduleId === moduleId);
        const completedCount = moduleLevels.filter(l => progress.completedLevels.includes(l.id)).length;
        const totalCount = moduleLevels.length;
        const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
        
        // Calculate stars (0 to 5)
        const stars = totalCount === 0 ? 0 : Math.ceil((completedCount / totalCount) * 5);
        
        return { completedCount, totalCount, percent, stars };
    };

    return (
        <div className="w-full h-full overflow-y-auto custom-scrollbar p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Command Center</h2>
                    <p className="text-gray-400 max-w-2xl text-lg">
                        Select a training module to begin. Complete sub-modules to earn clearance levels and specialized certifications.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MODULES.map((module) => {
                        const stats = getModuleStats(module.id);
                        
                        return (
                            <div 
                                key={module.id}
                                onClick={() => onSelectModule(module.id)}
                                className="group relative bg-panel-dark border border-border-dark rounded-xl p-6 hover:border-primary transition-all cursor-pointer overflow-hidden hover:shadow-neon hover:-translate-y-1"
                            >
                                {/* Progress Bar Background */}
                                <div className="absolute bottom-0 left-0 h-1 bg-primary/30 w-full">
                                    <div 
                                        className="h-full bg-accent-green shadow-[0_0_10px_#00ff9d]" 
                                        style={{ width: `${stats.percent}%` }}
                                    ></div>
                                </div>

                                <div className="flex items-start justify-between mb-6">
                                    <div className={`w-12 h-12 rounded-lg bg-background-dark flex items-center justify-center ${module.color} border border-border-dark group-hover:border-white/20`}>
                                        <span className="material-symbols-outlined text-3xl">{module.icon}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span 
                                                key={star} 
                                                className={`material-symbols-outlined text-[16px] ${star <= stats.stars ? 'text-yellow-400 fill-current' : 'text-gray-700'}`}
                                            >
                                                star
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                    {module.title}
                                </h3>
                                <p className="text-gray-400 text-sm mb-6 h-12 line-clamp-2">
                                    {module.description}
                                </p>

                                <div className="flex items-center justify-between text-xs font-mono text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-gray-600 group-hover:bg-accent-green transition-colors"></span>
                                        {stats.completedCount} / {stats.totalCount} Sub-modules
                                    </span>
                                    <span className="group-hover:text-white transition-colors">
                                        {stats.percent}% COMPLETE
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    
                    {/* Coming Soon Card */}
                    <div className="border border-dashed border-border-dark rounded-xl p-6 flex flex-col items-center justify-center text-center opacity-50 select-none">
                        <span className="material-symbols-outlined text-4xl text-gray-600 mb-4">lock_clock</span>
                        <h3 className="text-lg font-bold text-gray-400">Network Defense</h3>
                        <p className="text-xs text-gray-600 mt-2">Module locked. Coming soon.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

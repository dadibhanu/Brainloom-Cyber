import React, { useState, useEffect } from 'react';
import { Level } from '../types';

interface LabInterfaceProps {
    level: Level;
    onComplete: () => void;
}

export const LabInterface: React.FC<LabInterfaceProps> = ({ level, onComplete }) => {
    const [input, setInput] = useState('');
    const [logs, setLogs] = useState<string[]>([]);
    const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [isThinking, setIsThinking] = useState(false);

    // Reset state when level changes
    useEffect(() => {
        setInput('');
        setLogs([]);
        setStatus('IDLE');
        setIsThinking(false);
    }, [level.id]);

    const handleExecute = () => {
        if (!input.trim()) return;

        setIsThinking(true);
        setStatus('IDLE');
        
        // Simulation logs based on type
        let method = 'POST';
        let url = `/api/${level.lab.targetType.toLowerCase()}`;
        if(level.lab.targetType === 'URL') { method = 'GET'; url = input; }
        
        setLogs(prev => [`> ${method} ${url}`, `> Payload: ${input.substring(0, 50)}${input.length > 50 ? '...' : ''}`, ...prev]);

        setTimeout(() => {
            const isSuccess = level.lab.successCondition(input);
            setIsThinking(false);

            if (isSuccess) {
                setStatus('SUCCESS');
                setLogs(prev => [`< RESPONSE: 200 OK`, `< DATA: ${level.lab.successMessage}`, ...prev]);
                onComplete();
            } else {
                setStatus('ERROR');
                setLogs(prev => [`< RESPONSE: 4xx/5xx ERROR`, `< MSG: ${level.lab.failMessage}`, ...prev]);
            }
        }, 800);
    };

    const getRealQuery = () => {
        return level.lab.initialQueryDisplay.replace('[INPUT]', input || '...');
    };

    // Render different inputs based on Target Type
    const renderInputArea = () => {
        switch(level.lab.targetType) {
            case 'FILE_UPLOAD':
                return (
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/10 transition-colors group">
                        <span className="material-symbols-outlined text-4xl text-gray-500 group-hover:text-primary mb-2">cloud_upload</span>
                        <p className="text-sm text-gray-400 mb-4">Click to select file (Simulated)</p>
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="shell.php" 
                            className="w-full bg-background-dark border border-border-dark rounded p-2 text-white text-sm text-center font-mono focus:border-primary focus:outline-none"
                        />
                    </div>
                );
            case 'TERMINAL':
                return (
                    <div className="bg-black rounded-lg border border-gray-700 p-4 font-mono text-sm">
                        <div className="text-green-500 mb-2">root@server:~#</div>
                        <div className="flex gap-2">
                            <span className="text-blue-400">$</span>
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="command..." 
                                className="flex-1 bg-transparent border-none text-white focus:ring-0 p-0"
                                onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
                            />
                        </div>
                    </div>
                );
            case 'API_JSON':
                return (
                    <div className="font-mono text-sm">
                         <div className="bg-[#1a1a2e] text-gray-400 px-3 py-1 text-xs border border-b-0 border-gray-700 rounded-t">Request Body (JSON)</div>
                        <textarea 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder='{"id": 1}'
                            className="w-full h-32 bg-background-dark border border-border-dark rounded-b p-3 text-green-400 focus:border-primary focus:outline-none resize-none"
                        />
                    </div>
                );
            case 'JWT':
                return (
                    <div className="font-mono text-sm">
                        <div className="bg-[#1a1a2e] text-gray-400 px-3 py-1 text-xs border border-b-0 border-gray-700 rounded-t">Authorization: Bearer</div>
                        <textarea 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZ3Vlc3QiLCJyb2xlIjoidXNlciJ9.SIGNATURE'
                            className="w-full h-32 bg-background-dark border border-border-dark rounded-b p-3 text-yellow-500 focus:border-primary focus:outline-none resize-none break-all"
                        />
                        <p className="text-[10px] text-gray-500 mt-1">Tip: Base64 decode middle part, edit, re-encode.</p>
                    </div>
                );
            case 'OTP':
                return (
                    <div className="bg-white/5 p-4 rounded-lg space-y-3">
                         <div className="text-center text-gray-300 mb-2">Enter verification code sent to +1 ***-***-99</div>
                         <div className="flex justify-center gap-2">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="w-10 h-12 border border-gray-600 rounded bg-black/40"></div>
                            ))}
                         </div>
                         <div>
                            <label className="text-xs text-gray-400">Interceptor / Proxy Input</label>
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Intercepted Request..."
                                className="w-full bg-background-dark border border-border-dark rounded px-2 py-2 text-white focus:border-primary outline-none font-mono text-xs" 
                            />
                         </div>
                    </div>
                );
            case 'BANK_TRANSFER':
                return (
                    <div className="bg-white/5 p-4 rounded-lg space-y-3">
                         <div>
                            <label className="text-xs text-gray-400">Recipient Account</label>
                            <input type="text" disabled value="Hacker_Wallet_X" className="w-full bg-black/20 border border-border-dark rounded px-2 py-1 text-gray-500 text-sm" />
                         </div>
                         <div>
                            <label className="text-xs text-gray-400">Amount ($)</label>
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="1000"
                                className="w-full bg-background-dark border border-border-dark rounded px-2 py-2 text-white focus:border-primary outline-none" 
                            />
                         </div>
                    </div>
                );
            default:
                return (
                    <div>
                        <label className="block text-gray-400 text-xs font-bold mb-1 uppercase tracking-wider">{level.lab.prompt}</label>
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={level.lab.placeholder}
                            className={`w-full bg-background-dark border ${status === 'SUCCESS' ? 'border-accent-green' : status === 'ERROR' ? 'border-accent-red' : 'border-border-dark'} rounded p-3 text-white text-sm focus:outline-none focus:border-primary transition-colors font-mono`}
                            onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
                        />
                    </div>
                );
        }
    };

    // Get Icon based on type
    const getTargetIcon = () => {
        switch(level.lab.targetType) {
            case 'FILE_UPLOAD': return 'upload_file';
            case 'TERMINAL': return 'terminal';
            case 'API_JSON': return 'data_object';
            case 'JWT': return 'vpn_key';
            case 'OTP': return 'pin';
            case 'BANK_TRANSFER': return 'account_balance';
            case 'EMAIL': return 'mail';
            default: return 'public';
        }
    };

    return (
        <div className="flex flex-col h-full bg-background-dark/50 backdrop-blur-md rounded-xl border border-border-dark overflow-hidden shadow-2xl">
            {/* Browser Bar */}
            <div className="bg-panel-dark px-4 py-3 border-b border-border-dark flex items-center gap-3">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="flex-1 bg-background-dark/80 rounded px-3 py-1 text-xs text-gray-400 font-mono flex items-center justify-between">
                    <span className="truncate">https://{level.lab.targetName.toLowerCase().replace(/\s/g, '-')}.com/v1/app</span>
                    <span className="material-symbols-outlined text-[14px]">lock</span>
                </div>
            </div>

            <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
                {/* Visual Target (Left) */}
                <div className="flex-1 p-6 flex flex-col items-center justify-center bg-gradient-to-br from-[#12121a] to-[#0d0d14] relative overflow-y-auto">
                    <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
                    
                    <div className="w-full max-w-sm z-10 bg-panel-dark border border-border-dark p-6 rounded-lg shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">{getTargetIcon()}</span>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg leading-tight">{level.lab.targetName}</h3>
                                <p className="text-gray-500 text-xs uppercase tracking-wide">Secure Environment</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {renderInputArea()}

                            <button 
                                onClick={handleExecute}
                                disabled={isThinking}
                                className={`w-full py-3 rounded font-bold text-sm uppercase tracking-wide transition-all
                                    ${status === 'SUCCESS' 
                                        ? 'bg-accent-green text-background-dark shadow-neon-green' 
                                        : 'bg-primary text-white hover:bg-primary-dark shadow-neon'}
                                `}
                            >
                                {isThinking ? 'Processing...' : status === 'SUCCESS' ? 'Exploit Successful' : 'Launch Attack'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Developer Console (Right) */}
                <div className="flex-1 bg-black border-l border-border-dark flex flex-col font-mono text-xs h-64 lg:h-auto">
                    <div className="bg-[#1a1a2e] px-4 py-2 text-gray-400 border-b border-border-dark flex justify-between">
                        <span>Backend / Network Logs</span>
                        <span>Monitor: Active</span>
                    </div>
                    
                    {/* Live Query Viewer */}
                    <div className="p-4 bg-[#0d0d12] border-b border-border-dark">
                        <p className="text-gray-500 mb-2">// Logic Processing Preview</p>
                        <div className="text-primary-dark/80 whitespace-pre-wrap break-all">
                             {getRealQuery()}
                        </div>
                    </div>

                    {/* Logs */}
                    <div className="flex-1 p-4 overflow-y-auto crt-overlay text-green-500/80 space-y-1">
                        {logs.length === 0 && <span className="opacity-30">Waiting for interaction...</span>}
                        {logs.map((log, i) => (
                            <div key={i} className={`${log.includes('RESPONSE') ? (log.includes('200') ? 'text-accent-green' : 'text-accent-red') : 'text-blue-400'}`}>
                                {log}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

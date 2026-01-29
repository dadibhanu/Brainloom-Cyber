export enum Difficulty {
    NOVICE = "Novice",
    INTERMEDIATE = "Intermediate",
    ADVANCED = "Advanced",
    EXPERT = "Expert"
}

export interface EducationalContent {
    whatIsIt: string;
    howItWorks: string;
    prevention: string;
    codeSnippet?: string;
}

export interface LabConfig {
    targetName: string;
    targetType: 'LOGIN' | 'SEARCH' | 'PROFILE' | 'DASHBOARD' | 'EXPORT' | 'EMAIL' | 'URL' | 'FILE_UPLOAD' | 'TERMINAL' | 'API_JSON' | 'BANK_TRANSFER' | 'OTP' | 'JWT';
    prompt: string;
    placeholder: string;
    initialQueryDisplay: string; // Used to show backend logic or HTTP request
    hint: string;
    successCondition: (input: string) => boolean;
    successMessage: string;
    failMessage: string;
}

export interface Module {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
}

export interface Level {
    id: string;
    moduleId: string; // Links level to a module
    title: string;
    subtitle: string;
    difficulty: Difficulty;
    description: string;
    context: string;
    educational: EducationalContent;
    lab: LabConfig;
    position: { x: number; y: number };
}

export interface UserProgress {
    completedLevels: string[]; // IDs
    currentLevelId: string; 
    xp: number;
    streak: number;
}

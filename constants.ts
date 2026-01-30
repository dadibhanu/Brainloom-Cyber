import { Difficulty, Level, Module } from './types';

/* ===================== MODULE DEFINITIONS ===================== */

export const MODULES: Module[] = [
  { id: 'sql', title: 'SQL Injection', description: 'Exploiting improper handling of user input in database queries to bypass authentication or extract sensitive data.', icon: 'database', color: 'text-blue-500' },
  { id: 'xss', title: 'Cross-Site Scripting', description: 'Injecting malicious JavaScript into web pages executed in victim browsers.', icon: 'javascript', color: 'text-yellow-400' },
  { id: 'idor', title: 'IDOR', description: 'Accessing unauthorized resources by manipulating object identifiers.', icon: 'badge', color: 'text-orange-500' },
  { id: 'auth', title: 'Broken Authentication', description: 'Abusing weak or misconfigured authentication mechanisms.', icon: 'lock_open', color: 'text-red-500' },
  { id: 'csrf', title: 'CSRF & Logic', description: 'Forcing authenticated users to perform unwanted actions.', icon: 'ads_click', color: 'text-pink-500' },
  { id: 'rce', title: 'RCE & Files', description: 'Achieving server-side code execution through unsafe file handling.', icon: 'terminal', color: 'text-purple-600' },
  { id: 'api', title: 'API Security', description: 'Exploiting broken authorization and logic flaws in APIs.', icon: 'api', color: 'text-cyan-400' },
  { id: 'email', title: 'Email & Phishing', description: 'Impersonation and deception attacks using email systems.', icon: 'mail', color: 'text-red-400' },
  { id: 'net', title: 'Network Infrastructure', description: 'Attacking exposed network services and misconfigurations.', icon: 'lan', color: 'text-indigo-400' },
  { id: 'ad', title: 'Active Directory', description: 'Abusing misconfigurations in Windows domain environments.', icon: 'domain', color: 'text-teal-400' },
  { id: 'cloud', title: 'Cloud & SaaS', description: 'Exploiting cloud misconfigurations and excessive permissions.', icon: 'cloud_queue', color: 'text-blue-300' }
];

/* ===================== POSITIONING ===================== */

const POS = [
  { x: 50, y: 100 },
  { x: 50, y: 250 },
  { x: 50, y: 400 },
  { x: 50, y: 550 },
  { x: 50, y: 700 }
];

const getPos = (idx: number) => POS[idx % POS.length];

/* ===================== LEVEL DEFINITIONS ===================== */

export const LEVELS: Level[] = [

/* ===================== SQL INJECTION ===================== */

{
  id: 'sqli-1',
  moduleId: 'sql',
  title: 'Login Bypass',
  subtitle: 'Banking Portal',
  difficulty: Difficulty.NOVICE,
  description: 'Exploit a vulnerable banking login page to bypass authentication using boolean-based SQL injection.',
  context: 'Bank Login',
  position: getPos(0),
  educational: {
    whatIsIt:
      'SQL Injection is a vulnerability that occurs when user input is directly concatenated into SQL queries. ' +
      'In authentication systems, this flaw can allow attackers to log in without valid credentials.',
    howItWorks:
      'The application constructs an SQL query using raw input. By injecting a condition like OR 1=1, ' +
      'the WHERE clause always evaluates to TRUE, causing the database to return a valid user record.',
    prevention:
      'Use prepared statements or parameterized queries. ' +
      'Never concatenate user input into SQL statements. ' +
      'Apply server-side validation and least-privilege database access.'
  },
  lab: {
    targetName: 'GlobalBank',
    targetType: 'LOGIN',
    prompt: 'Username',
    placeholder: 'admin',
    initialQueryDisplay: "SELECT * FROM users WHERE username='[INPUT]'",
    hint:
      'Think about how SQL evaluates conditions. If you can make the WHERE clause always true, ' +
      'authentication will succeed even without valid credentials.',
    successCondition: i => /or\s+1\s*=\s*1/i.test(i),
    successMessage:
      'Authentication bypass successful. You are now logged in as an administrator.',
    failMessage:
      'Authentication failed. The injected condition did not bypass the query.'
  }
},

{
  id: 'sqli-2',
  moduleId: 'sql',
  title: 'Marks Extraction',
  subtitle: 'Union-Based SQLi',
  difficulty: Difficulty.INTERMEDIATE,
  description: 'Extract sensitive database information using UNION-based SQL injection.',
  context: 'College Portal',
  position: getPos(1),
  educational: {
    whatIsIt:
      'Union-based SQL Injection allows attackers to retrieve data from additional tables ' +
      'by combining multiple SELECT statements.',
    howItWorks:
      'The database merges the result of the original query with attacker-supplied queries. ' +
      'If column counts match, the attacker can extract unauthorized data.',
    prevention:
      'Use prepared statements. ' +
      'Strictly validate input. ' +
      'Restrict database permissions and hide detailed error messages.'
  },
  lab: {
    targetName: 'UniResults',
    targetType: 'SEARCH',
    prompt: 'Student Name',
    placeholder: 'John',
    initialQueryDisplay: "SELECT marks FROM students WHERE name LIKE '%[INPUT]%'",
    hint:
      'Try extending the query so the database returns additional columns from another table.',
    successCondition: i => /union\s+select/i.test(i),
    successMessage:
      'Sensitive database data retrieved using UNION-based SQL injection.',
    failMessage:
      'Only legitimate student results were returned.'
  }
},

/* ===================== XSS ===================== */

{
  id: 'xss-1',
  moduleId: 'xss',
  title: 'Doctor Dashboard',
  subtitle: 'Stored XSS',
  difficulty: Difficulty.INTERMEDIATE,
  description: 'Inject a stored XSS payload that executes when doctors view patient notes.',
  context: 'Hospital System',
  position: getPos(2),
  educational: {
    whatIsIt:
      'Stored Cross-Site Scripting occurs when malicious scripts are permanently stored on the server.',
    howItWorks:
      'User input is saved in the database and later rendered in the browser without sanitization, ' +
      'allowing JavaScript execution in another user’s session.',
    prevention:
      'Encode output before rendering. ' +
      'Sanitize input and implement Content Security Policy (CSP).'
  },
  lab: {
    targetName: 'MediNotes',
    targetType: 'DASHBOARD',
    prompt: 'Note',
    placeholder: 'Patient is stable',
    initialQueryDisplay: '<div>[INPUT]</div>',
    hint:
      'Try injecting HTML elements that automatically execute JavaScript when rendered.',
    successCondition: i => /onerror|<script>/i.test(i),
    successMessage:
      'Stored XSS executed successfully on the doctor dashboard.',
    failMessage:
      'Input rendered safely without script execution.'
  }
},

/* ===================== IDOR ===================== */

{
  id: 'idor-1',
  moduleId: 'idor',
  title: 'Statement Download',
  subtitle: 'IDOR',
  difficulty: Difficulty.NOVICE,
  description: 'Access another customer’s bank statement by manipulating a numeric identifier.',
  context: 'Banking',
  position: getPos(3),
  educational: {
    whatIsIt:
      'Insecure Direct Object Reference occurs when internal object IDs are exposed without proper authorization.',
    howItWorks:
      'The application fetches resources based only on user-supplied IDs, ' +
      'allowing attackers to access other users’ data.',
    prevention:
      'Always verify resource ownership on the server. ' +
      'Use indirect references or UUIDs.'
  },
  lab: {
    targetName: 'BankDocs',
    targetType: 'URL',
    prompt: 'Statement ID',
    placeholder: '1001',
    initialQueryDisplay: 'GET /statement?id=[INPUT]',
    hint:
      'If IDs appear sequential, try modifying the value to access another record.',
    successCondition: i => /^[0-9]+$/.test(i) && i !== '1001',
    successMessage:
      'Unauthorized bank statement accessed successfully.',
    failMessage:
      'Access restricted to your own statement.'
  }
},

/* ===================== BROKEN AUTH ===================== */

{
  id: 'auth-1',
  moduleId: 'auth',
  title: 'Default Credentials',
  subtitle: 'HR Portal',
  difficulty: Difficulty.NOVICE,
  description: 'Gain administrator access using default credentials.',
  context: 'Corporate',
  position: getPos(4),
  educational: {
    whatIsIt:
      'Default credentials are preset usernames and passwords left unchanged after deployment.',
    howItWorks:
      'Attackers try well-known default credentials such as admin/admin to gain privileged access.',
    prevention:
      'Force password changes on first login and disable default accounts.'
  },
  lab: {
    targetName: 'CorpHR',
    targetType: 'LOGIN',
    prompt: 'Username:Password',
    placeholder: 'user:password',
    initialQueryDisplay: 'AUTH([INPUT])',
    hint:
      'Think about common default usernames and passwords used in enterprise applications.',
    successCondition: i => i === 'admin:admin',
    successMessage:
      'Administrator access gained using default credentials.',
    failMessage:
      'Login failed. Default credentials not accepted.'
  }
},

/* ===================== CSRF ===================== */

{
  id: 'csrf-1',
  moduleId: 'csrf',
  title: 'Fund Transfer',
  subtitle: 'CSRF Attack',
  difficulty: Difficulty.INTERMEDIATE,
  description: 'Trigger an unauthorized bank transfer using a CSRF attack.',
  context: 'Banking',
  position: getPos(0),
  educational: {
    whatIsIt:
      'Cross-Site Request Forgery tricks authenticated users into executing unwanted actions.',
    howItWorks:
      'The browser automatically sends session cookies with requests, ' +
      'allowing attackers to perform actions without the user’s knowledge.',
    prevention:
      'Use CSRF tokens, SameSite cookies, and validate request origins.'
  },
  lab: {
    targetName: 'BankCore',
    targetType: 'URL',
    prompt: 'Malicious URL',
    placeholder: '/transfer',
    initialQueryDisplay: '<img src="[INPUT]">',
    hint:
      'Trigger an action that changes data while the victim is logged in.',
    successCondition: i => i.includes('transfer'),
    successMessage:
      'Unauthorized fund transfer executed successfully.',
    failMessage:
      'Request blocked due to missing CSRF protection.'
  }
},

/* ===================== RCE ===================== */

{
  id: 'rce-1',
  moduleId: 'rce',
  title: 'File Upload',
  subtitle: 'Web Shell',
  difficulty: Difficulty.INTERMEDIATE,
  description: 'Achieve remote code execution by uploading a malicious file.',
  context: 'Hospital',
  position: getPos(1),
  educational: {
    whatIsIt:
      'Unrestricted file upload vulnerabilities allow attackers to upload executable files.',
    howItWorks:
      'The server fails to properly validate file type and execution permissions.',
    prevention:
      'Validate MIME types, restrict execution, and rename uploaded files.'
  },
  lab: {
    targetName: 'MediUpload',
    targetType: 'FILE_UPLOAD',
    prompt: 'Filename',
    placeholder: 'report.pdf',
    initialQueryDisplay: 'Uploading: [INPUT]',
    hint:
      'Try uploading a file type that the server may execute.',
    successCondition: i => /\.php$/i.test(i),
    successMessage:
      'Web shell uploaded and executable.',
    failMessage:
      'File uploaded safely without execution.'
  }
},

/* ===================== API ===================== */

{
  id: 'api-1',
  moduleId: 'api',
  title: 'BOLA',
  subtitle: 'Broken Object Level Auth',
  difficulty: Difficulty.INTERMEDIATE,
  description: 'Access another user’s account data by abusing broken object-level authorization.',
  context: 'Banking API',
  position: getPos(2),
  educational: {
    whatIsIt:
      'BOLA occurs when APIs fail to validate object ownership.',
    howItWorks:
      'Attackers change object IDs in API requests to access unauthorized data.',
    prevention:
      'Enforce object-level authorization for every request.'
  },
  lab: {
    targetName: 'BankAPI',
    targetType: 'URL',
    prompt: 'Account ID',
    placeholder: '101',
    initialQueryDisplay: 'GET /accounts/[INPUT]',
    hint:
      'Try requesting an account ID that does not belong to you.',
    successCondition: i => i !== '101',
    successMessage:
      'Unauthorized account data accessed.',
    failMessage:
      'Only your account data is accessible.'
  }
},

/* ===================== EMAIL ===================== */

{
  id: 'email-1',
  moduleId: 'email',
  title: 'Email Spoofing',
  subtitle: 'CEO Fraud',
  difficulty: Difficulty.NOVICE,
  description: 'Impersonate a company executive using email spoofing.',
  context: 'Corporate Email',
  position: getPos(3),
  educational: {
    whatIsIt:
      'Email spoofing allows attackers to forge sender addresses.',
    howItWorks:
      'Mail servers accept forged headers without proper verification.',
    prevention:
      'Implement SPF, DKIM, and DMARC with reject policies.'
  },
  lab: {
    targetName: 'MailGateway',
    targetType: 'EMAIL',
    prompt: 'From Address',
    placeholder: 'user@company.com',
    initialQueryDisplay: 'From: [INPUT]',
    hint:
      'Try sending an email as a trusted executive.',
    successCondition: i => /ceo@/i.test(i),
    successMessage:
      'Spoofed email accepted by the mail server.',
    failMessage:
      'Email delivered normally without impersonation.'
  }
},

/* ===================== CLOUD ===================== */

{
  id: 'cloud-1',
  moduleId: 'cloud',
  title: 'Public S3 Bucket',
  subtitle: 'Data Exposure',
  difficulty: Difficulty.NOVICE,
  description: 'Access sensitive hospital data from a publicly exposed cloud storage bucket.',
  context: 'Hospital Cloud',
  position: getPos(4),
  educational: {
    whatIsIt:
      'Cloud storage misconfigurations can expose sensitive data publicly.',
    howItWorks:
      'Improper ACLs allow unauthenticated users to read stored objects.',
    prevention:
      'Apply least-privilege IAM policies and disable public access.'
  },
  lab: {
    targetName: 'AWS S3',
    targetType: 'URL',
    prompt: 'Bucket URL',
    placeholder: 's3.amazonaws.com/bucket',
    initialQueryDisplay: 'GET [INPUT]',
    hint:
      'Look for directories or objects containing sensitive information.',
    successCondition: i => i.includes('patient'),
    successMessage:
      'Sensitive patient data exposed due to public bucket.',
    failMessage:
      'Access denied due to correct bucket permissions.'
  }
}

];

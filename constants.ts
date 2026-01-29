import { Difficulty, Level, Module } from './types';

export const MODULES: Module[] = [
    { id: 'sql', title: 'SQL Injection', description: 'Manipulate database queries.', icon: 'database', color: 'text-blue-500' },
    { id: 'xss', title: 'Cross-Site Scripting', description: 'Inject malicious scripts.', icon: 'javascript', color: 'text-yellow-400' },
    { id: 'idor', title: 'IDOR', description: 'Insecure Direct Object References.', icon: 'badge', color: 'text-orange-500' },
    { id: 'auth', title: 'Broken Authentication', description: 'Bypass login & session controls.', icon: 'lock_open', color: 'text-red-500' },
    { id: 'csrf', title: 'CSRF & Logic', description: 'Forgery, Clickjacking & Logic Abuse.', icon: 'ads_click', color: 'text-pink-500' },
    { id: 'rce', title: 'RCE & Files', description: 'Uploads, Path Traversal & Command Inj.', icon: 'terminal', color: 'text-purple-600' },
    { id: 'api', title: 'API Security', description: 'BOLA, Rate Limiting & JWT.', icon: 'api', color: 'text-cyan-400' },
    { id: 'email', title: 'Email & Phishing', description: 'Spoofing, BEC & Phishing.', icon: 'mail', color: 'text-red-400' },
    { id: 'net', title: 'Network Infra', description: 'Scanning, Firewall & Lateral Movement.', icon: 'lan', color: 'text-indigo-400' },
    { id: 'ad', title: 'Active Directory', description: 'Kerberoasting, Password Spraying & AD.', icon: 'domain', color: 'text-teal-400' },
    { id: 'cloud', title: 'Cloud & SaaS', description: 'AWS, IAM & Token Abuse.', icon: 'cloud_queue', color: 'text-blue-300' }
];

const POS = [
    { x: 50, y: 100 }, { x: 50, y: 250 }, { x: 50, y: 400 }, { x: 50, y: 550 }, { x: 50, y: 700 }
];

const getPos = (idx: number) => POS[idx % POS.length];

export const LEVELS: Level[] = [
    // --- SQL INJECTION ---
    {
        id: 'sqli-1', moduleId: 'sql', title: 'Login Bypass', subtitle: 'Banking Portal', difficulty: Difficulty.NOVICE,
        description: 'Bypass authentication using boolean injection.',
        context: 'Bank Login', position: getPos(0),
        educational: { whatIsIt: 'Authentication bypass via SQLi.', howItWorks: "' OR 1=1-- makes the query true.", prevention: 'Parameterized queries.' },
        lab: { targetName: 'GlobalBank', targetType: 'LOGIN', prompt: 'Username', placeholder: 'admin', initialQueryDisplay: "SELECT * FROM users WHERE user='[INPUT]'", hint: "Use ' OR 1=1 --", successCondition: i => i.includes("1=1"), successMessage: 'Welcome Admin.', failMessage: 'Access Denied.' }
    },
    {
        id: 'sqli-2', moduleId: 'sql', title: 'Result System', subtitle: 'Union Extraction', difficulty: Difficulty.INTERMEDIATE,
        description: 'Extract hidden result tables.',
        context: 'College System', position: getPos(1),
        educational: { whatIsIt: 'UNION SQLi.', howItWorks: 'Combining results from two tables.', prevention: 'Input validation.' },
        lab: { targetName: 'UniResults', targetType: 'SEARCH', prompt: 'Student Name', placeholder: 'John', initialQueryDisplay: "SELECT score FROM results WHERE name LIKE '%[INPUT]%'", hint: "UNION SELECT 1,database()", successCondition: i => i.toLowerCase().includes("union select"), successMessage: 'DB: university_prod', failMessage: 'No results.' }
    },
    {
        id: 'sqli-3', moduleId: 'sql', title: 'Patient Records', subtitle: 'Union Based', difficulty: Difficulty.ADVANCED,
        description: 'Retrieve patient data from another table.',
        context: 'Hospital', position: getPos(2),
        educational: { whatIsIt: 'Data extraction.', howItWorks: 'UNION ALL SELECT.', prevention: 'ORM.' },
        lab: { targetName: 'MediRecords', targetType: 'URL', prompt: 'ID Param', placeholder: '1', initialQueryDisplay: "SELECT name FROM patients WHERE id=[INPUT]", hint: "UNION SELECT password FROM users", successCondition: i => i.toLowerCase().includes("union select"), successMessage: 'Admin Password: hash123', failMessage: 'Record 1 loaded.' }
    },
    {
        id: 'sqli-4', moduleId: 'sql', title: 'Order Tracking', subtitle: 'Blind Boolean', difficulty: Difficulty.EXPERT,
        description: 'Infer data from true/false responses.',
        context: 'E-commerce', position: getPos(3),
        educational: { whatIsIt: 'Blind SQLi.', howItWorks: 'AND 1=1 vs AND 1=0.', prevention: 'Prepared Statements.' },
        lab: { targetName: 'ShipFast', targetType: 'SEARCH', prompt: 'Order ID', placeholder: '100', initialQueryDisplay: "SELECT status FROM orders WHERE id='[INPUT]'", hint: "' AND 1=1 --", successCondition: i => i.includes("AND 1=1"), successMessage: 'Order Found (True).', failMessage: 'Not Found.' }
    },

    // --- XSS ---
    {
        id: 'xss-1', moduleId: 'xss', title: 'Doctor Dashboard', subtitle: 'Stored XSS', difficulty: Difficulty.INTERMEDIATE,
        description: 'Inject malicious script into patient notes.',
        context: 'Hospital', position: getPos(0),
        educational: { whatIsIt: 'Stored XSS.', howItWorks: 'Script saves to DB, executes for victim.', prevention: 'Encoding/Sanitization.' },
        lab: { targetName: 'MediNotes', targetType: 'DASHBOARD', prompt: 'Note', placeholder: 'Fever', initialQueryDisplay: "<div>[INPUT]</div>", hint: "<img src=x onerror=alert(1)>", successCondition: i => i.toLowerCase().includes("onerror"), successMessage: 'XSS Executed on Doctor Dashboard.', failMessage: 'Note saved.' }
    },
    {
        id: 'xss-2', moduleId: 'xss', title: 'Admission Enquiry', subtitle: 'Reflected XSS', difficulty: Difficulty.NOVICE,
        description: 'Reflect script via search parameter.',
        context: 'College', position: getPos(1),
        educational: { whatIsIt: 'Reflected XSS.', howItWorks: 'Input reflected immediately.', prevention: 'Escape URL params.' },
        lab: { targetName: 'UniAdmit', targetType: 'URL', prompt: 'Query', placeholder: '?q=science', initialQueryDisplay: "Search: [INPUT]", hint: "<script>alert(1)</script>", successCondition: i => i.includes("<script>"), successMessage: 'Alert(1) Popped.', failMessage: 'Search done.' }
    },
    {
        id: 'xss-3', moduleId: 'xss', title: 'User Profile', subtitle: 'DOM XSS', difficulty: Difficulty.ADVANCED,
        description: 'Exploit unsafe JavaScript DOM manipulation.',
        context: 'SaaS', position: getPos(2),
        educational: { whatIsIt: 'DOM XSS.', howItWorks: 'source -> sink (innerHTML).', prevention: 'Avoid innerHTML.' },
        lab: { targetName: 'CloudProfile', targetType: 'PROFILE', prompt: 'Name', placeholder: 'Alice', initialQueryDisplay: "div.innerHTML = 'Hi ' + [INPUT]", hint: "<img src=x onerror=alert(1)>", successCondition: i => i.includes("onerror"), successMessage: 'DOM XSS Success.', failMessage: 'Updated.' }
    },

    // --- IDOR ---
    {
        id: 'idor-1', moduleId: 'idor', title: 'Bank Statement', subtitle: 'ID Manipulation', difficulty: Difficulty.NOVICE,
        description: 'Download other users\' statements.',
        context: 'Banking', position: getPos(0),
        educational: { whatIsIt: 'IDOR.', howItWorks: 'Change ID in URL.', prevention: 'Access controls.' },
        lab: { targetName: 'BankDocs', targetType: 'URL', prompt: 'URL', placeholder: '/download?id=100', initialQueryDisplay: "GET /file?id=[INPUT]", hint: "Change 100 to 101", successCondition: i => i.includes("101") || i.includes("102"), successMessage: 'Downloading Statement for User 101...', failMessage: 'Your statement.' }
    },
    {
        id: 'idor-2', moduleId: 'idor', title: 'Marks Portal', subtitle: 'Predictable Resource', difficulty: Difficulty.INTERMEDIATE,
        description: 'View other student marks.',
        context: 'College', position: getPos(1),
        educational: { whatIsIt: 'Predictable IDs.', howItWorks: 'Sequential IDs.', prevention: 'UUIDs.' },
        lab: { targetName: 'UniMarks', targetType: 'URL', prompt: 'Student ID', placeholder: 'STU001', initialQueryDisplay: "SELECT marks FROM students WHERE id='[INPUT]'", hint: "STU002", successCondition: i => i === "STU002", successMessage: 'Marks for STU002: 98%', failMessage: 'Your marks: 75%' }
    },
    {
        id: 'idor-3', moduleId: 'idor', title: 'Lab Reports', subtitle: 'Access Control', difficulty: Difficulty.ADVANCED,
        description: 'Access medical reports of other patients.',
        context: 'Hospital', position: getPos(2),
        educational: { whatIsIt: 'Broken Access Control.', howItWorks: 'Missing owner check.', prevention: 'Verify session owner.' },
        lab: { targetName: 'MediLab', targetType: 'URL', prompt: 'Report ID', placeholder: 'REP-555', initialQueryDisplay: "GET /report/[INPUT]", hint: "REP-556", successCondition: i => i.includes("556"), successMessage: 'Patient Name: VIP_USER (Leaked)', failMessage: 'Report loaded.' }
    },

    // --- BROKEN AUTH ---
    {
        id: 'auth-1', moduleId: 'auth', title: 'HR System', subtitle: 'Default Creds', difficulty: Difficulty.NOVICE,
        description: 'Login using default admin credentials.',
        context: 'Corporate', position: getPos(0),
        educational: { whatIsIt: 'Default passwords.', howItWorks: 'admin:admin', prevention: 'Force change on setup.' },
        lab: { targetName: 'CorpHR', targetType: 'LOGIN', prompt: 'User:Pass', placeholder: 'user:123', initialQueryDisplay: "Auth([INPUT])", hint: "admin:admin", successCondition: i => i === "admin:admin", successMessage: 'Welcome Admin.', failMessage: 'Invalid.' }
    },
    {
        id: 'auth-2', moduleId: 'auth', title: 'Credential Stuffing', subtitle: 'Reuse Attack', difficulty: Difficulty.INTERMEDIATE,
        description: 'Try reused passwords from a breach.',
        context: 'E-commerce', position: getPos(1),
        educational: { whatIsIt: 'Stuffing.', howItWorks: 'Automated login attempts.', prevention: 'MFA, Captcha.' },
        lab: { targetName: 'ShopLogin', targetType: 'LOGIN', prompt: 'User:Pass', placeholder: 'email:pass', initialQueryDisplay: "CheckCreds([INPUT])", hint: "victim@mail.com:password123", successCondition: i => i.includes("password123"), successMessage: 'Account Accessed.', failMessage: 'Failed.' }
    },
    {
        id: 'auth-3', moduleId: 'auth', title: 'Password Reset', subtitle: 'Flow Bypass', difficulty: Difficulty.ADVANCED,
        description: 'Manipulate reset request to send token to attacker.',
        context: 'SaaS', position: getPos(2),
        educational: { whatIsIt: 'Weak Recovery.', howItWorks: 'Parameter pollution.', prevention: 'Validate email.' },
        lab: { targetName: 'CloudReset', targetType: 'API_JSON', prompt: 'JSON', placeholder: '{"email":"victim"}', initialQueryDisplay: "Reset([INPUT])", hint: "Add 'cc':'attacker'", successCondition: i => i.includes("cc") || i.includes("bcc"), successMessage: 'Token sent to attacker.', failMessage: 'Email sent.' }
    },
    {
        id: 'auth-4', moduleId: 'auth', title: 'MFA Bypass', subtitle: 'Logic Flaw', difficulty: Difficulty.EXPERT,
        description: 'Bypass MFA by manipulating response.',
        context: 'Banking', position: getPos(3),
        educational: { whatIsIt: 'MFA Bypass.', howItWorks: 'Response manipulation.', prevention: 'Server-side check.' },
        lab: { targetName: 'BankMFA', targetType: 'API_JSON', prompt: 'Response', placeholder: '{"success":false}', initialQueryDisplay: "Interceptor: [INPUT]", hint: "Set success:true", successCondition: i => i.includes("true"), successMessage: 'MFA Bypassed.', failMessage: 'OTP Required.' }
    },

    // --- CSRF & LOGIC ---
    {
        id: 'csrf-1', moduleId: 'csrf', title: 'Fund Transfer', subtitle: 'CSRF', difficulty: Difficulty.INTERMEDIATE,
        description: 'Trick user into transferring funds.',
        context: 'Banking', position: getPos(0),
        educational: { whatIsIt: 'CSRF.', howItWorks: 'Unwanted action via cookie.', prevention: 'Anti-CSRF Tokens.' },
        lab: { targetName: 'BankCore', targetType: 'URL', prompt: 'Malicious Link', placeholder: 'http://...', initialQueryDisplay: "<img src='[INPUT]'>", hint: "/transfer?to=hacker&amt=500", successCondition: i => i.includes("transfer") && i.includes("to="), successMessage: 'Transfer initiated.', failMessage: 'Invalid.' }
    },
    {
        id: 'csrf-2', moduleId: 'csrf', title: 'Course Register', subtitle: 'CSRF', difficulty: Difficulty.NOVICE,
        description: 'Force student to register for a course.',
        context: 'College', position: getPos(1),
        educational: { whatIsIt: 'CSRF.', howItWorks: 'Auto-submit form.', prevention: 'Tokens.' },
        lab: { targetName: 'UniReg', targetType: 'URL', prompt: 'Link', placeholder: '/reg?id=101', initialQueryDisplay: "Visit: [INPUT]", hint: "/register?course=HACK101", successCondition: i => i.includes("course="), successMessage: 'Registered for HACK101.', failMessage: 'Failed.' }
    },
    {
        id: 'csrf-3', moduleId: 'csrf', title: 'Change Address', subtitle: 'CSRF', difficulty: Difficulty.INTERMEDIATE,
        description: 'Change delivery address silently.',
        context: 'E-commerce', position: getPos(2),
        educational: { whatIsIt: 'State Change.', howItWorks: 'POST request forgery.', prevention: 'SameSite Cookies.' },
        lab: { targetName: 'ShopSet', targetType: 'URL', prompt: 'Payload', placeholder: '/update', initialQueryDisplay: "POST /update?addr=[INPUT]", hint: "AttackerAddress", successCondition: i => i.length > 5, successMessage: 'Address Changed.', failMessage: 'Failed.' }
    },
    {
        id: 'csrf-4', moduleId: 'csrf', title: 'SSO Redirect', subtitle: 'Open Redirect', difficulty: Difficulty.NOVICE,
        description: 'Redirect user to phishing site via SSO.',
        context: 'Company SSO', position: getPos(3),
        educational: { whatIsIt: 'Open Redirect.', howItWorks: 'Trusted domain redirects to untrusted.', prevention: 'Whitelist URLs.' },
        lab: { targetName: 'CorpSSO', targetType: 'URL', prompt: 'Return URL', placeholder: '/dashboard', initialQueryDisplay: "GET /login?return=[INPUT]", hint: "http://evil.com", successCondition: i => i.includes("http"), successMessage: 'Redirected to evil.com', failMessage: 'Logged in.' }
    },
    {
        id: 'csrf-5', moduleId: 'csrf', title: 'Clickjacking', subtitle: 'UI Redress', difficulty: Difficulty.ADVANCED,
        description: 'Trick user into clicking hidden buttons.',
        context: 'Banking', position: getPos(4),
        educational: { whatIsIt: 'Clickjacking.', howItWorks: 'Invisible iframe.', prevention: 'X-Frame-Options.' },
        lab: { targetName: 'BankUI', targetType: 'URL', prompt: 'Iframe Style', placeholder: 'opacity: 1', initialQueryDisplay: "<iframe style='[INPUT]'>", hint: "opacity: 0", successCondition: i => i.includes("opacity: 0") || i.includes("opacity:0"), successMessage: 'User clicked "Transfer All".', failMessage: 'Frame visible.' }
    },

    // --- RCE & FILES ---
    {
        id: 'rce-1', moduleId: 'rce', title: 'Medical Report', subtitle: 'Shell Upload', difficulty: Difficulty.INTERMEDIATE,
        description: 'Upload web shell via report portal.',
        context: 'Hospital', position: getPos(0),
        educational: { whatIsIt: 'File Upload.', howItWorks: 'Upload .php.', prevention: 'Validate file type.' },
        lab: { targetName: 'MediUpload', targetType: 'FILE_UPLOAD', prompt: 'Filename', placeholder: 'scan.pdf', initialQueryDisplay: "File: [INPUT]", hint: "shell.php", successCondition: i => i.includes(".php"), successMessage: 'Shell uploaded at /uploads/shell.php', failMessage: 'PDF uploaded.' }
    },
    {
        id: 'rce-2', moduleId: 'rce', title: 'Assignment', subtitle: 'Upload Bypass', difficulty: Difficulty.ADVANCED,
        description: 'Bypass extension filters.',
        context: 'College', position: getPos(1),
        educational: { whatIsIt: 'Filter Bypass.', howItWorks: 'shell.php.jpg or null byte.', prevention: 'Content verification.' },
        lab: { targetName: 'UniAssign', targetType: 'FILE_UPLOAD', prompt: 'Filename', placeholder: 'hw.docx', initialQueryDisplay: "File: [INPUT]", hint: "shell.php.jpg", successCondition: i => i.includes(".php."), successMessage: 'Bypass successful.', failMessage: 'Blocked.' }
    },
    {
        id: 'rce-3', moduleId: 'rce', title: 'Report Export', subtitle: 'Command Inj', difficulty: Difficulty.EXPERT,
        description: 'Inject OS commands into export feature.',
        context: 'Company', position: getPos(2),
        educational: { whatIsIt: 'Command Injection.', howItWorks: '; ls -la', prevention: 'No exec calls.' },
        lab: { targetName: 'CorpExport', targetType: 'TERMINAL', prompt: 'Filename', placeholder: 'rep.pdf', initialQueryDisplay: "zip [INPUT]", hint: "; whoami", successCondition: i => i.includes(";") || i.includes("|"), successMessage: 'root', failMessage: 'Zipped.' }
    },
    {
        id: 'rce-4', moduleId: 'rce', title: 'Backup Script', subtitle: 'Command Inj', difficulty: Difficulty.EXPERT,
        description: 'Inject commands into backup utility.',
        context: 'Hospital', position: getPos(3),
        educational: { whatIsIt: 'Command Inj.', howItWorks: '$(cat /etc/passwd)', prevention: 'Sanitize.' },
        lab: { targetName: 'MediBackup', targetType: 'TERMINAL', prompt: 'IP', placeholder: '127.0.0.1', initialQueryDisplay: "ping [INPUT]", hint: "`id`", successCondition: i => i.includes("`") || i.includes("$"), successMessage: 'uid=0(root)', failMessage: 'Ping ok.' }
    },
    {
        id: 'rce-5', moduleId: 'rce', title: 'Study Material', subtitle: 'Path Traversal', difficulty: Difficulty.INTERMEDIATE,
        description: 'Read system files via download.',
        context: 'College', position: getPos(4),
        educational: { whatIsIt: 'Path Traversal.', howItWorks: '../../etc/passwd', prevention: 'Chroot.' },
        lab: { targetName: 'UniLib', targetType: 'URL', prompt: 'File', placeholder: 'book.pdf', initialQueryDisplay: "read([INPUT])", hint: "../../../etc/passwd", successCondition: i => i.includes(".."), successMessage: 'root:x:0:0...', failMessage: 'Reading book.' }
    },
    // --- BUSINESS LOGIC ---
    {
        id: 'logic-1', moduleId: 'csrf', title: 'Coupon Abuse', subtitle: 'Double Dip', difficulty: Difficulty.NOVICE,
        description: 'Reuse coupons multiple times.',
        context: 'E-commerce', position: getPos(0),
        educational: { whatIsIt: 'Logic Flaw.', howItWorks: 'Race condition or lack of check.', prevention: 'Atomic transactions.' },
        lab: { targetName: 'ShopCart', targetType: 'API_JSON', prompt: 'Coupon', placeholder: 'SAVE10', initialQueryDisplay: "Cart-[INPUT]", hint: "Apply SAVE10 twice", successCondition: i => i.match(/SAVE10/g)?.length === 2, successMessage: 'Discount applied twice.', failMessage: 'Applied once.' }
    },
    {
        id: 'logic-2', moduleId: 'csrf', title: 'Transfer Limit', subtitle: 'Race Condition', difficulty: Difficulty.EXPERT,
        description: 'Exceed daily limits via race condition.',
        context: 'Banking', position: getPos(1),
        educational: { whatIsIt: 'Race Condition.', howItWorks: 'Parallel requests.', prevention: 'Locks.' },
        lab: { targetName: 'BankCore', targetType: 'BANK_TRANSFER', prompt: 'Amount', placeholder: '500', initialQueryDisplay: "Limit: 1000. Sending: [INPUT]", hint: "Send 2000 (Simulates parallel)", successCondition: i => parseInt(i) > 1000, successMessage: 'Limit Exceeded ($2000 sent).', failMessage: 'Sent.' }
    },

    // --- API ---
    {
        id: 'api-1', moduleId: 'api', title: 'BOLA', subtitle: 'IDOR', difficulty: Difficulty.INTERMEDIATE,
        description: 'Access other account details.',
        context: 'Banking API', position: getPos(0),
        educational: { whatIsIt: 'BOLA.', howItWorks: 'Change object ID.', prevention: 'Authz checks.' },
        lab: { targetName: 'BankAPI', targetType: 'URL', prompt: 'Endpoint', placeholder: '/me', initialQueryDisplay: "GET /accounts/[INPUT]", hint: "/102", successCondition: i => i.includes("102"), successMessage: 'Account 102 Data.', failMessage: 'Your data.' }
    },
    {
        id: 'api-2', moduleId: 'api', title: 'Mass Assignment', subtitle: 'Privilege Esc', difficulty: Difficulty.ADVANCED,
        description: 'Become admin during signup.',
        context: 'SaaS', position: getPos(1),
        educational: { whatIsIt: 'Mass Assignment.', howItWorks: 'Bind extra fields.', prevention: 'DTOs.' },
        lab: { targetName: 'CloudReg', targetType: 'API_JSON', prompt: 'JSON', placeholder: '{"user":"me"}', initialQueryDisplay: "create([INPUT])", hint: '"role":"admin"', successCondition: i => i.includes("admin"), successMessage: 'Created Admin User.', failMessage: 'Created User.' }
    },
    {
        id: 'api-3', moduleId: 'api', title: 'Rate Limit', subtitle: 'OTP Bypass', difficulty: Difficulty.INTERMEDIATE,
        description: 'Brute force OTP due to missing rate limits.',
        context: 'OTP API', position: getPos(2),
        educational: { whatIsIt: 'No Rate Limit.', howItWorks: 'Inf requests.', prevention: 'Throttling.' },
        lab: { targetName: 'VerifyAPI', targetType: 'OTP', prompt: 'Payload', placeholder: '1234', initialQueryDisplay: "POST /verify", hint: "Send 100 requests (Type 'BRUTE')", successCondition: i => i.includes("BRUTE"), successMessage: 'OTP Found: 5921', failMessage: 'Invalid OTP.' }
    },
    {
        id: 'api-4', moduleId: 'api', title: 'JWT Tampering', subtitle: 'None Alg', difficulty: Difficulty.EXPERT,
        description: 'Forge JWT token to be admin.',
        context: 'Fintech Mobile', position: getPos(3),
        educational: { whatIsIt: 'JWT Attack.', howItWorks: 'alg: none.', prevention: 'Enforce alg.' },
        lab: { targetName: 'FinApp', targetType: 'JWT', prompt: 'Token', placeholder: 'header.payload.sig', initialQueryDisplay: "Auth: Bearer [INPUT]", hint: "Set alg:none, role:admin, remove sig", successCondition: i => i.includes("none") && i.includes("admin"), successMessage: 'Admin Access Granted.', failMessage: 'Invalid Sig.' }
    },

    // --- EMAIL ---
    {
        id: 'email-1', moduleId: 'email', title: 'Email Spoofing', subtitle: 'Fake Sender', difficulty: Difficulty.NOVICE,
        description: 'Send email as CEO.',
        context: 'Bank', position: getPos(0),
        educational: { whatIsIt: 'Spoofing.', howItWorks: 'From header.', prevention: 'DMARC.' },
        lab: { targetName: 'MailSrv', targetType: 'EMAIL', prompt: 'From', placeholder: 'me@site.com', initialQueryDisplay: "Sender: [INPUT]", hint: "ceo@bank.com", successCondition: i => i.includes("ceo@"), successMessage: 'Spoofed email sent.', failMessage: 'Sent.' }
    },
    {
        id: 'email-2', moduleId: 'email', title: 'BEC', subtitle: 'Payment Fraud', difficulty: Difficulty.INTERMEDIATE,
        description: 'Request urgent payment as vendor.',
        context: 'Finance', position: getPos(1),
        educational: { whatIsIt: 'BEC.', howItWorks: 'Social Engineering.', prevention: 'Verification.' },
        lab: { targetName: 'CorpMail', targetType: 'EMAIL', prompt: 'Body', placeholder: 'Hi...', initialQueryDisplay: "Body: [INPUT]", hint: "Urgent wire transfer", successCondition: i => i.toLowerCase().includes("urgent") && i.includes("wire"), successMessage: 'Finance approved payment.', failMessage: 'Ignored.' }
    },
    {
        id: 'email-3', moduleId: 'email', title: 'Credential Phish', subtitle: 'Fake Link', difficulty: Difficulty.NOVICE,
        description: 'Steal student logins.',
        context: 'College', position: getPos(2),
        educational: { whatIsIt: 'Phishing.', howItWorks: 'Fake login page.', prevention: 'Awareness.' },
        lab: { targetName: 'WebMail', targetType: 'EMAIL', prompt: 'Link', placeholder: 'uni.edu', initialQueryDisplay: "Click: [INPUT]", hint: "uni-login.com", successCondition: i => i.includes("uni-login"), successMessage: 'Creds Harvested.', failMessage: 'Link checked.' }
    },

    // --- NETWORK ---
    {
        id: 'net-1', moduleId: 'net', title: 'Port Scan', subtitle: 'Recon', difficulty: Difficulty.NOVICE,
        description: 'Find open ports.',
        context: 'Campus', position: getPos(0),
        educational: { whatIsIt: 'Nmap.', howItWorks: 'SYN Scan.', prevention: 'Firewall.' },
        lab: { targetName: 'Terminal', targetType: 'TERMINAL', prompt: 'Cmd', placeholder: 'ping', initialQueryDisplay: "[INPUT]", hint: "nmap 192.168.1.1", successCondition: i => i.includes("nmap"), successMessage: 'Ports 22, 80 OPEN.', failMessage: 'Cmd failed.' }
    },
    {
        id: 'net-2', moduleId: 'net', title: 'Lateral Move', subtitle: 'SSH Keys', difficulty: Difficulty.EXPERT,
        description: 'Move to database server.',
        context: 'Corporate', position: getPos(1),
        educational: { whatIsIt: 'Pivoting.', howItWorks: 'SSH keys.', prevention: 'Segmentation.' },
        lab: { targetName: 'SSH', targetType: 'TERMINAL', prompt: 'Cmd', placeholder: 'ls', initialQueryDisplay: "[INPUT]", hint: "ssh db_admin@10.0.0.5", successCondition: i => i.includes("ssh") && i.includes("10."), successMessage: 'Connected to DB Server.', failMessage: 'Connection refused.' }
    },

    // --- AD ---
    {
        id: 'ad-1', moduleId: 'ad', title: 'Password Spray', subtitle: 'Brute Force', difficulty: Difficulty.INTERMEDIATE,
        description: 'Try "Spring2023" on all users.',
        context: 'Corporate AD', position: getPos(0),
        educational: { whatIsIt: 'Spraying.', howItWorks: '1 pass, many users.', prevention: 'Strong policies.' },
        lab: { targetName: 'ADLogin', targetType: 'TERMINAL', prompt: 'Cmd', placeholder: 'login', initialQueryDisplay: "crackmapexec [INPUT]", hint: "-p Spring2023", successCondition: i => i.includes("Spring2023"), successMessage: '2 Accounts Cracked.', failMessage: 'Failed.' }
    },
    {
        id: 'ad-2', moduleId: 'ad', title: 'Kerberoasting', subtitle: 'Ticket Attacks', difficulty: Difficulty.EXPERT,
        description: 'Request TGS for service accounts.',
        context: 'AD Domain', position: getPos(1),
        educational: { whatIsIt: 'Kerberoasting.', howItWorks: 'Offline crack of TGS.', prevention: 'Strong svc pass.' },
        lab: { targetName: 'PowerView', targetType: 'TERMINAL', prompt: 'Cmd', placeholder: 'Get-NetUser', initialQueryDisplay: "[INPUT]", hint: "Get-NetUser | Get-TGS", successCondition: i => i.includes("Get-TGS"), successMessage: 'Hash extracted for SQLSvc.', failMessage: 'No tickets.' }
    },

    // --- CLOUD ---
    {
        id: 'cloud-1', moduleId: 'cloud', title: 'S3 Bucket', subtitle: 'Public Data', difficulty: Difficulty.NOVICE,
        description: 'Find patient files in public bucket.',
        context: 'Hospital', position: getPos(0),
        educational: { whatIsIt: 'Misconfig.', howItWorks: 'Public read.', prevention: 'Private buckets.' },
        lab: { targetName: 'AWS S3', targetType: 'URL', prompt: 'Bucket', placeholder: 's3.com/files', initialQueryDisplay: "GET [INPUT]", hint: "s3.com/patients", successCondition: i => i.includes("patient"), successMessage: 'Found records.zip', failMessage: 'Access Denied.' }
    },
    {
        id: 'cloud-2', moduleId: 'cloud', title: 'IAM Esc', subtitle: 'Privilege Esc', difficulty: Difficulty.EXPERT,
        description: 'Escalate from user to admin via policy.',
        context: 'Cloud IAM', position: getPos(1),
        educational: { whatIsIt: 'IAM Abuse.', howItWorks: 'AttachUserPolicy.', prevention: 'Least privilege.' },
        lab: { targetName: 'AWS CLI', targetType: 'TERMINAL', prompt: 'Cmd', placeholder: 'aws s3 ls', initialQueryDisplay: "[INPUT]", hint: "aws iam attach-user-policy --admin", successCondition: i => i.includes("attach-user-policy"), successMessage: 'AdminAttached.', failMessage: 'Denied.' }
    }
];

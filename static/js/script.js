// ============== PDF.js Worker Setup ==============
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// ============== State ==============
let resumeText = '';
let currentFile = null;
let analysisResult = null;
let charts = {};

// ============== Theme Toggle ==============
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

themeToggle.addEventListener('click', () => {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  themeIcon.className = next === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  if (analysisResult) {
    setTimeout(() => renderAllCharts(analysisResult), 100);
  }
});

// ============== Toast Notifications ==============
function showToast(type, title, message) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast-custom toast-${type}`;
  const icons = { success: 'check', error: 'xmark', warning: 'triangle-exclamation', info: 'circle-info' };
  toast.innerHTML = `
    <div class="toast-icon"><i class="fas fa-${icons[type]}"></i></div>
    <div class="toast-content">
      <strong>${title}</strong>
      <small>${message}</small>
    </div>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ============== File Upload ==============
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const filePreview = document.getElementById('filePreview');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const fileRemove = document.getElementById('fileRemove');

dropzone.addEventListener('click', () => fileInput.click());

dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', () => {
  dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('dragover');
  if (e.dataTransfer.files.length) {
    handleFile(e.dataTransfer.files[0]);
  }
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length) handleFile(e.target.files[0]);
});

fileRemove.addEventListener('click', () => {
  currentFile = null;
  resumeText = '';
  filePreview.classList.remove('active');
  fileInput.value = '';
  checkReady();
});

function handleFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  
  if (!['pdf', 'docx'].includes(ext)) {
    showToast('error', 'Invalid File', 'Please upload a PDF or DOCX file.');
    return;
  }
  
  if (file.size > 5 * 1024 * 1024) {
    showToast('error', 'File Too Large', 'Maximum file size is 5MB.');
    return;
  }
  
  currentFile = file;
  fileName.textContent = file.name;
  fileSize.textContent = formatSize(file.size);
  filePreview.classList.add('active');
  
  showToast('info', 'Processing File', `Reading ${file.name}...`);
  
  extractText(file).then(text => {
    resumeText = text;
    if (text.length < 50) {
      showToast('warning', 'Low Text Content', 'The extracted text seems short. Make sure your resume is text-based, not scanned images.');
    } else {
      showToast('success', 'Resume Loaded', `Extracted ${text.length} characters successfully.`);
    }
    checkReady();
  }).catch(err => {
    showToast('error', 'Extraction Failed', err.message);
    filePreview.classList.remove('active');
    currentFile = null;
  });
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(2) + ' MB';
}

async function extractText(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  
  if (ext === 'pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(' ') + ' ';
    }
    return text.trim();
  } else if (ext === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }
  throw new Error('Unsupported file format');
}

// ============== Job Description ==============
const jdTextarea = document.getElementById('jdTextarea');
const jdCharCount = document.getElementById('jdCharCount');

jdTextarea.addEventListener('input', () => {
  jdCharCount.textContent = jdTextarea.value.length;
  checkReady();
});

document.getElementById('loadSample').addEventListener('click', () => {
  const sample = `Senior Full Stack Developer

About the Role:
We are seeking an experienced Senior Full Stack Developer to join our growing engineering team. You will be responsible for building scalable web applications using modern technologies.

Required Skills:
- 5+ years of experience in full stack development
- Strong proficiency in JavaScript, TypeScript, React, and Node.js
- Experience with Python and Django or Flask
- Deep understanding of SQL and PostgreSQL databases
- Experience with AWS, Docker, and Kubernetes
- Knowledge of REST API design and GraphQL
- Familiarity with CI/CD pipelines and Git
- Experience with Redis and microservices architecture
- Understanding of HTML5, CSS3, and Tailwind CSS

Soft Skills:
- Excellent communication and teamwork abilities
- Strong problem-solving and analytical skills
- Leadership and mentorship experience`;
  jdTextarea.value = sample;
  jdCharCount.textContent = sample.length;
  checkReady();
  showToast('info', 'Sample Loaded', 'A sample job description has been added.');
});

function checkReady() {
  const btn = document.getElementById('analyzeBtn');
  const ready = resumeText.length > 100 && jdTextarea.value.length > 100;
  btn.disabled = !ready;
  if (!ready && resumeText.length > 100 && jdTextarea.value.length <= 100) {
    btn.innerHTML = `<span class="btn-content"><i class="fas fa-keyboard"></i> Paste a job description to continue</span>`;
  } else if (!ready && jdTextarea.value.length > 100 && resumeText.length <= 100) {
    btn.innerHTML = `<span class="btn-content"><i class="fas fa-upload"></i> Upload your resume to continue</span>`;
  } else {
    btn.innerHTML = `<span class="btn-content"><i class="fas fa-wand-magic-sparkles"></i> Analyze My Resume</span>`;
  }
}

// ============== Analysis Logic ==============
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can',
  'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'them',
  'their', 'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every',
  'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'just', 'also', 'about', 'if', 'then', 'else', 'while'
]);

const TECH_SKILLS_DB = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
  'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt', 'node.js', 'express', 'django', 'flask', 'fastapi',
  'spring', 'laravel', 'rails', 'asp.net', 'html5', 'css3', 'sass', 'less', 'tailwind', 'bootstrap',
  'jquery', 'redux', 'graphql', 'rest', 'api', 'websocket', 'microservices', 'docker', 'kubernetes',
  'aws', 'azure', 'gcp', 'heroku', 'vercel', 'netlify', 'linux', 'unix', 'bash', 'powershell',
  'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'cassandra', 'dynamodb', 'sqlite',
  'git', 'github', 'gitlab', 'bitbucket', 'jenkins', 'circleci', 'github actions', 'terraform',
  'ansible', 'chef', 'puppet', 'vagrant', 'nginx', 'apache', 'webpack', 'vite', 'babel', 'eslint',
  'jest', 'mocha', 'cypress', 'selenium', 'puppeteer', 'figma', 'sketch', 'adobe xd', 'photoshop',
  'machine learning', 'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy', 'matplotlib'
];

const SOFT_SKILLS_DB = [
  'communication', 'leadership', 'teamwork', 'problem solving', 'analytical', 'critical thinking',
  'creativity', 'time management', 'organization', 'adaptability', 'flexibility', 'collaboration',
  'mentoring', 'mentorship', 'presentation', 'negotiation', 'conflict resolution', 'decision making',
  'attention to detail', 'multitasking', 'self-motivated', 'self-starter', 'initiative', 'ownership',
  'accountability', 'interpersonal', 'verbal communication', 'written communication', 'active listening',
  'empathy', 'patience', 'positive attitude', 'work ethic', 'reliability', 'punctuality', 'professionalism'
];

const SECTION_PATTERNS = {
  'Contact Information': /\b(email|phone|@|linkedin|github|address|tel:|mailto:)/i,
  'Professional Summary': /\b(summary|profile|objective|about me|career summary|professional summary)\b/i,
  'Skills': /\b(skills|technical skills|core competencies|technologies|tech stack)\b/i,
  'Work Experience': /\b(experience|employment|work history|professional experience|career)\b/i,
  'Education': /\b(education|degree|university|college|bachelor|master|phd|b\.sc|m\.sc|b\.tech|m\.tech)\b/i,
  'Projects': /\b(projects|portfolio|case studies|project experience)\b/i,
  'Certifications': /\b(certification|certificate|certified|license|licensed)\b/i,
  'Achievements': /\b(achievements|awards|honors|accomplishments|recognitions|publications)\b/i
};

function extractKeywords(text) {
  const words = text.toLowerCase()
    .replace(/[^\w\s+#.-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w) && !/^\d+$/.test(w));
  
  const freq = {};
  words.forEach(w => {
    freq[w] = (freq[w] || 0) + 1;
  });
  
  TECH_SKILLS_DB.forEach(skill => {
    if (text.toLowerCase().includes(skill)) {
      freq[skill] = (freq[skill] || 999);
    }
  });
  
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word]) => word);
}

function findSkills(text, skillDb) {
  const lower = text.toLowerCase();
  return skillDb.filter(skill => {
    const regex = new RegExp(`\\b${skill.replace(/[.+*?^$()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(lower);
  });
}

function detectSections(text) {
  const results = {};
  for (const [section, pattern] of Object.entries(SECTION_PATTERNS)) {
    results[section] = pattern.test(text);
  }
  return results;
}

function analyzeResume(resumeText, jdText) {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jdText.toLowerCase();
  
  const jdKeywords = extractKeywords(jdText);
  
  const matchedKeywords = [];
  const missingKeywords = [];
  jdKeywords.forEach(kw => {
    if (resumeLower.includes(kw)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });
  
  const jdTechSkills = findSkills(jdText, TECH_SKILLS_DB);
  const resumeTechSkills = findSkills(resumeText, TECH_SKILLS_DB);
  const matchedTech = jdTechSkills.filter(s => resumeTechSkills.includes(s));
  const missingTech = jdTechSkills.filter(s => !resumeTechSkills.includes(s));
  
  const jdSoftSkills = findSkills(jdText, SOFT_SKILLS_DB);
  const resumeSoftSkills = findSkills(resumeText, SOFT_SKILLS_DB);
  const matchedSoft = jdSoftSkills.filter(s => resumeSoftSkills.includes(s));
  const missingSoft = jdSoftSkills.filter(s => !resumeSoftSkills.includes(s));
  
  const sections = detectSections(resumeText);
  const foundSections = Object.values(sections).filter(v => v).length;
  const totalSections = Object.keys(sections).length;
  
  const keywordMatchPct = jdKeywords.length > 0 ? Math.round((matchedKeywords.length / jdKeywords.length) * 100) : 0;
  const techMatchPct = jdTechSkills.length > 0 ? Math.round((matchedTech.length / jdTechSkills.length) * 100) : 0;
  const softMatchPct = jdSoftSkills.length > 0 ? Math.round((matchedSoft.length / jdSoftSkills.length) * 100) : 0;
  const skillsMatchPct = (jdTechSkills.length + jdSoftSkills.length) > 0 
    ? Math.round(((matchedTech.length + matchedSoft.length) / (jdTechSkills.length + jdSoftSkills.length)) * 100)
    : 0;
  const sectionPct = Math.round((foundSections / totalSections) * 100);
  
  const atsScore = Math.round(
    keywordMatchPct * 0.35 +
    skillsMatchPct * 0.30 +
    sectionPct * 0.20 +
    Math.min(100, Math.max(0, (resumeText.length / 30))) * 0.15
  );
  
  const strengths = [];
  if (keywordMatchPct >= 70) strengths.push({ icon: 'tags', text: 'Strong keyword alignment with the job description' });
  if (techMatchPct >= 70) strengths.push({ icon: 'code', text: `Excellent technical skills coverage (${matchedTech.length}/${jdTechSkills.length})` });
  if (softMatchPct >= 70) strengths.push({ icon: 'users', text: 'Well-aligned soft skills for the role' });
  
  const improvements = [];
  if (missingKeywords.length > 5) improvements.push({ icon: 'tags', text: `Add ${missingKeywords.length} missing keywords from the job description` });
  if (missingTech.length > 0) improvements.push({ icon: 'code', text: `Consider highlighting these skills: ${missingTech.slice(0, 5).join(', ')}` });
  if (!sections['Professional Summary']) improvements.push({ icon: 'align-left', text: 'Add a professional summary at the top' });
  
  const recommendations = [];
  if (missingTech.length > 0) {
    recommendations.push({
      priority: 'high',
      icon: 'code',
      title: 'Add Missing Technical Skills',
      desc: `Your resume is missing ${missingTech.length} technical skills mentioned in the JD: ${missingTech.slice(0, 5).join(', ')}.`
    });
  }
  
  if (missingKeywords.length > 0) {
    recommendations.push({
      priority: 'high',
      icon: 'bullseye',
      title: 'Optimize for ATS Keywords',
      desc: `${missingKeywords.length} important keywords from the job description are missing. Integrate: ${missingKeywords.slice(0, 6).join(', ')}.`
    });
  }
  
  const actionPlan = [
    { num: 1, text: 'Add a targeted professional summary mentioning the role title and your top 3 qualifications' },
    { num: 2, text: `Integrate missing keywords naturally throughout your resume` },
    { num: 3, text: 'Rewrite bullet points using the "Accomplished X by doing Y, resulting in Z" formula' },
    { num: 4, text: 'Proofread for formatting consistency, then export as PDF with selectable text' }
  ];
  
  return {
    atsScore,
    keywordMatchPct,
    skillsMatchPct,
    techMatchPct,
    softMatchPct,
    sectionPct,
    matchedKeywords,
    missingKeywords,
    jdTechSkills,
    matchedTech,
    missingTech,
    jdSoftSkills,
    matchedSoft,
    missingSoft,
    sections,
    foundSections,
    totalSections,
    strengths,
    improvements,
    recommendations,
    actionPlan,
    resumeLength: resumeText.length
  };
}

// ============== Analyze Button ==============
document.getElementById('analyzeBtn').addEventListener('click', async () => {
  const overlay = document.getElementById('analyzingOverlay');
  overlay.classList.add('active');
  
  await new Promise(r => setTimeout(r, 1500));
  
  try {
    analysisResult = analyzeResume(resumeText, jdTextarea.value);
    overlay.classList.remove('active');
    renderResults(analysisResult);
    showToast('success', 'Analysis Complete', `Your ATS score is ${analysisResult.atsScore}/100`);
    document.getElementById('dashboard').style.display = 'block';
    setTimeout(() => {
      document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
    }, 200);
  } catch (err) {
    overlay.classList.remove('active');
    showToast('error', 'Analysis Failed', err.message);
  }
});

// ============== Render Results ==============
function renderResults(data) {
  animateScore('atsScore', data.atsScore);
  animateScore('keywordScore', data.keywordMatchPct);
  animateScore('skillsScore', data.skillsMatchPct);
  
  setTimeout(() => {
    setRingProgress('atsRing', data.atsScore);
    setRingProgress('keywordRing', data.keywordMatchPct);
    setRingProgress('skillsRing', data.skillsMatchPct);
  }, 100);
  
  document.getElementById('matchedCount').textContent = data.matchedKeywords.length;
  document.getElementById('totalCount').textContent = data.matchedKeywords.length + data.missingKeywords.length;
  document.getElementById('skillsMatched').textContent = data.matchedTech.length + data.matchedSoft.length;
  
  const matchedKw = document.getElementById('matchedKeywords');
  matchedKw.innerHTML = data.matchedKeywords.length 
    ? data.matchedKeywords.map(k => `<span class="keyword-tag keyword-matched"><i class="fas fa-check"></i> ${k}</span>`).join('')
    : '<p style="color:var(--text-muted);">No keywords matched.</p>';
  
  const missingKw = document.getElementById('missingKeywords');
  missingKw.innerHTML = data.missingKeywords.length
    ? data.missingKeywords.map(k => `<span class="keyword-tag keyword-missing"><i class="fas fa-plus"></i> ${k}</span>`).join('')
    : '<p style="color:var(--success);"><i class="fas fa-check-circle me-1"></i>Great job! All key keywords are present.</p>';
  
  renderSkillBars('technicalSkills', data.jdTechSkills, data.matchedTech, 'var(--accent-1)');
  renderSkillBars('softSkills', data.jdSoftSkills, data.matchedSoft, 'var(--accent-3)');
  
  const sectionStatus = document.getElementById('sectionStatus');
  sectionStatus.innerHTML = Object.entries(data.sections).map(([section, found]) => `
    <div class="section-status-item ${found ? 'found' : 'missing'}">
      <div class="section-status-icon">
        <i class="fas fa-${found ? 'check' : 'xmark'}"></i>
      </div>
      <span>${section}</span>
    </div>
  `).join('');
  
  document.getElementById('strengthsList').innerHTML = data.strengths.map(s => `
    <div class="list-item strength">
      <div class="list-item-icon"><i class="fas fa-${s.icon}"></i></div>
      <div class="list-item-text">${s.text}</div>
    </div>
  `).join('');
  
  document.getElementById('improvementsList').innerHTML = data.improvements.map(s => `
    <div class="list-item improvement">
      <div class="list-item-icon"><i class="fas fa-${s.icon}"></i></div>
      <div class="list-item-text">${s.text}</div>
    </div>
  `).join('');
  
  document.getElementById('recommendationsList').innerHTML = data.recommendations.map(r => `
    <div class="list-item">
      <div class="list-item-icon"><i class="fas fa-${r.icon}"></i></div>
      <div class="list-item-text"><strong>${r.title}</strong><br/>${r.desc}</div>
    </div>
  `).join('');
  
  document.getElementById('actionPlan').innerHTML = data.actionPlan.map(a => `
    <div class="list-item">
      <div class="list-item-icon" style="background:var(--gradient-1);color:white;font-weight:600;">${a.num}</div>
      <div class="list-item-text">${a.text}</div>
    </div>
  `).join('');
  
  renderAllCharts(data);
}

function renderSkillBars(containerId, jdSkills, matchedSkills, color) {
  const container = document.getElementById(containerId);
  if (jdSkills.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);">No specific skills detected in the job description.</p>';
    return;
  }
  container.innerHTML = jdSkills.map(skill => {
    const matched = matchedSkills.includes(skill);
    return `
      <div style="margin-bottom:1rem;">
        <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
          <span>${skill.charAt(0).toUpperCase() + skill.slice(1)}</span>
          <span style="color:${matched ? 'var(--success)' : 'var(--danger)'};">${matched ? 'Matched' : 'Missing'}</span>
        </div>
        <div style="height:8px;background:var(--bg-tertiary);border-radius:4px;overflow:hidden;">
          <div style="width:${matched ? 100 : 0}%;height:100%;background:${matched ? color : 'var(--danger)'};transition:width 0.5s ease;"></div>
        </div>
      </div>
    `;
  }).join('');
}

function animateScore(elementId, target) {
  const el = document.getElementById(elementId);
  let current = 0;
  const increment = target / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.round(current);
  }, 25);
}

function setRingProgress(ringId, percent) {
  const ring = document.getElementById(ringId);
  const circumference = 2 * Math.PI * 65;
  const offset = circumference - (percent / 100) * circumference;
  ring.style.strokeDashoffset = offset;
}

// ============== Charts ==============
function getThemeColors() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    text: isDark ? '#a8a8c0' : '#4a4a6a',
    grid: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
  };
}

function renderAllCharts(data) {
  Object.values(charts).forEach(c => c && c.destroy());
  charts = {};
  
  const colors = getThemeColors();
  
  const radarCtx = document.getElementById('radarChart');
  if (radarCtx) {
    charts.radar = new Chart(radarCtx, {
      type: 'radar',
      data: {
        labels: ['Keyword Match', 'Tech Skills', 'Soft Skills', 'Sections', 'Content Depth'],
        datasets: [{
          label: 'Your Resume',
          data: [data.keywordMatchPct, data.techMatchPct, data.softMatchPct, data.sectionPct, Math.min(100, Math.round(data.resumeLength / 20))],
          backgroundColor: 'rgba(124, 58, 237, 0.2)',
          borderColor: '#7c3aed',
          borderWidth: 2,
          pointBackgroundColor: '#7c3aed',
          pointBorderColor: '#fff',
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: { color: colors.text },
            grid: { color: colors.grid },
            angleLines: { color: colors.grid }
          }
        }
      }
    });
  }
  
  const doughnutCtx = document.getElementById('doughnutChart');
  if (doughnutCtx) {
    charts.doughnut = new Chart(doughnutCtx, {
      type: 'doughnut',
      data: {
        labels: ['Matched Keywords', 'Missing Keywords'],
        datasets: [{
          data: [data.matchedKeywords.length, data.missingKeywords.length],
          backgroundColor: ['#10b981', '#ef4444'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { position: 'bottom', labels: { color: colors.text, padding: 15 } }
        }
      }
    });
  }
}

// ============== Tabs ==============
document.querySelectorAll('.result-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.result-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    if (analysisResult) {
      setTimeout(() => renderAllCharts(analysisResult), 50);
    }
  });
});

checkReady();

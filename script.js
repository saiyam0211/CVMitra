// State management
let state = {
  personalInfo: {
      name: '',
      email: '',
      phone: '',
      summary: ''
  },
  experience: [],
  education: [],
  skills: [],
  template: 'modern'
};

// DOM Elements
const resumeForm = document.getElementById('resumeForm');
const experienceContainer = document.getElementById('experienceContainer');
const educationContainer = document.getElementById('educationContainer');
const skillsContainer = document.getElementById('skillsContainer');
const preview = document.getElementById('preview');
const mobileNavBtn = document.getElementById('mobileMenuBtn')

// Initialize application
function initializeApp() {
  loadSavedData();
  attachEventListeners();
  updateFormFromState();
}

// Load saved data from localStorage
function loadSavedData() {
  const savedData = localStorage.getItem('resumeData');
  if (savedData) {
      state = JSON.parse(savedData);
  }
}

// Attach event listeners
function attachEventListeners() {
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  document.getElementById('downloadPDF').addEventListener('click', downloadPDF);
  mobileNavBtn.addEventListener('click', toggleMobileNav)
  document.getElementById('addExperience').addEventListener('click', () => addExperience());
  document.getElementById('addEducation').addEventListener('click', () => addEducation());
  document.getElementById('addSkill').addEventListener('click', () => addSkill());
  document.getElementById('template').addEventListener('change', handleTemplateChange);
  
  // Personal info listeners
  document.getElementById('name').addEventListener('input', handlePersonalInfoInput);
  document.getElementById('email').addEventListener('input', handlePersonalInfoInput);
  document.getElementById('phone').addEventListener('input', handlePersonalInfoInput);
  document.getElementById('summary').addEventListener('input', handlePersonalInfoInput);
}

// Handle template change
function handleTemplateChange(e) {
  state.template = e.target.value;
  saveState();
  updatePreview();
}

// Handle personal info input
function handlePersonalInfoInput(e) {
  state.personalInfo[e.target.name] = e.target.value;
  saveState();
  updatePreview();
}

// Update form from state
function updateFormFromState() {
  // Update personal info fields
  document.getElementById('name').value = state.personalInfo.name || '';
  document.getElementById('email').value = state.personalInfo.email || '';
  document.getElementById('phone').value = state.personalInfo.phone || '';
  document.getElementById('summary').value = state.personalInfo.summary || '';
  document.getElementById('template').value = state.template || 'modern';

  // Clear existing containers
  experienceContainer.innerHTML = '';
  educationContainer.innerHTML = '';
  skillsContainer.innerHTML = '';

  // Render all sections
  state.experience.forEach(exp => addExperience(exp));
  state.education.forEach(edu => addEducation(edu));
  state.skills.forEach(skill => addSkill(skill, true));

  updatePreview();
}

// Experience section handlers
function addExperience(data = null) {
  const expDiv = document.createElement('div');
  expDiv.className = 'experience-item';
  const index = state.experience.length;
  
  expDiv.innerHTML = `
      <div class="form-group">
          <label>Company</label>
          <input type="text" class="exp-company" data-index="${index}" value="${data?.company || ''}">
      </div>
      <div class="form-group">
          <label>Position</label>
          <input type="text" class="exp-position" data-index="${index}" value="${data?.position || ''}">
      </div>
      <div class="form-group">
          <label>Duration</label>
          <input type="text" class="exp-duration" data-index="${index}" value="${data?.duration || ''}">
      </div>
      <div class="form-group">
          <label>Description</label>
          <textarea class="exp-description" data-index="${index}" rows="3">${data?.description || ''}</textarea>
      </div>
      <button type="button" class="btn-danger remove-experience" data-index="${index}">Remove</button>
  `;

  experienceContainer.appendChild(expDiv);

  if (!data) {
      state.experience.push({
          company: '',
          position: '',
          duration: '',
          description: ''
      });
      saveState();
      updatePreview();
  }

  attachExperienceListeners(expDiv);
}

function attachExperienceListeners(expDiv) {
  const inputs = expDiv.querySelectorAll('input, textarea');
  inputs.forEach(input => {
      input.addEventListener('input', handleExperienceInput);
  });

  expDiv.querySelector('.remove-experience').addEventListener('click', handleExperienceRemove);
}

function handleExperienceInput(e) {
  const index = parseInt(e.target.dataset.index);
  const field = e.target.className.split('-')[1];
  state.experience[index][field] = e.target.value;
  saveState();
  updatePreview();
}

function handleExperienceRemove(e) {
  const index = parseInt(e.target.dataset.index);
  state.experience.splice(index, 1);
  saveState();
  updateFormFromState();
}

// Education section handlers
function addEducation(data = null) {
  const eduDiv = document.createElement('div');
  eduDiv.className = 'education-item';
  const index = state.education.length;

  eduDiv.innerHTML = `
      <div class="form-group">
          <label>School</label>
          <input type="text" class="edu-school" data-index="${index}" value="${data?.school || ''}">
      </div>
      <div class="form-group">
          <label>Degree</label>
          <input type="text" class="edu-degree" data-index="${index}" value="${data?.degree || ''}">
      </div>
      <div class="form-group">
          <label>Year</label>
          <input type="text" class="edu-year" data-index="${index}" value="${data?.year || ''}">
      </div>
      <button type="button" class="btn-danger remove-education" data-index="${index}">Remove</button>
  `;

  educationContainer.appendChild(eduDiv);

  if (!data) {
      state.education.push({
          school: '',
          degree: '',
          year: ''
      });
      saveState();
      updatePreview();
  }

  attachEducationListeners(eduDiv);
}

function attachEducationListeners(eduDiv) {
  const inputs = eduDiv.querySelectorAll('input');
  inputs.forEach(input => {
      input.addEventListener('input', handleEducationInput);
  });

  eduDiv.querySelector('.remove-education').addEventListener('click', handleEducationRemove);
}

function handleEducationInput(e) {
  const index = parseInt(e.target.dataset.index);
  const field = e.target.className.split('-')[1];
  state.education[index][field] = e.target.value;
  saveState();
  updatePreview();
}

function handleEducationRemove(e) {
  const index = parseInt(e.target.dataset.index);
  state.education.splice(index, 1);
  saveState();
  updateFormFromState();
}

// Skills section handlers
function addSkill(skill = '', fromState = false) {
  const skillDiv = document.createElement('div');
  skillDiv.className = 'skill-item';
  const index = state.skills.length;

  skillDiv.innerHTML = `
      <input type="text" class="skill-input" data-index="${index}" value="${skill}">
      <button type="button" class="btn-danger remove-skill" data-index="${index}">×</button>
  `;

  skillsContainer.appendChild(skillDiv);

  // Only add to state if it's a new skill (not loaded from state)
  if (!fromState) {
      state.skills.push(skill);
      saveState();
      updatePreview();
  }

  attachSkillListeners(skillDiv);
}

function attachSkillListeners(skillDiv) {
  skillDiv.querySelector('.skill-input').addEventListener('input', handleSkillInput);
  skillDiv.querySelector('.remove-skill').addEventListener('click', handleSkillRemove);
}

function handleSkillInput(e) {
  const index = parseInt(e.target.dataset.index);
  state.skills[index] = e.target.value;
  saveState();
  updatePreview();
}

function handleSkillRemove(e) {
  const index = parseInt(e.target.dataset.index);
  state.skills.splice(index, 1);
  saveState();
  updateFormFromState();
}

// Theme toggle
function toggleTheme() {
  document.body.setAttribute('data-theme',
      document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
  );
}

// Save state to localStorage
function saveState() {
  localStorage.setItem('resumeData', JSON.stringify(state));
}

// Download PDF
async function downloadPDF() {
  const element = document.getElementById('preview');
  const opt = {
      margin: 1,
      filename: `${state.personalInfo.name.replace(/\s+/g, '_')}_resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  try {
      await html2pdf().set(opt).from(element).save();
  } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
  }
}

function toggleMobileNav() {
  mobileNavBtn.classList.toggle('active')
  
  if (mobileNavBtn.classList.contains('active')) {
    mobileNavBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  } else {
    mobileNavBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }
}

// Update preview based on template
function updatePreview() {
  let previewHTML = '';
  
  switch (state.template) {
      case 'modern':
          previewHTML = generateModernTemplate();
          break;
      case 'professional':
          previewHTML = generateProfessionalTemplate();
          break;
      case 'minimal':
          previewHTML = generateMinimalTemplate();
          break;
      case 'creative':
          previewHTML = generateCreativeTemplate();
          break;
  }

  preview.innerHTML = previewHTML;
}

// Template generators
function generateModernTemplate() {
  return `
      <div class="preview-header">
          <h1>${state.personalInfo.name}</h1>
          <p>${state.personalInfo.email} | ${state.personalInfo.phone}</p>
      </div>
      
      <div class="preview-summary">
          <h2>Professional Summary</h2>
          <p>${state.personalInfo.summary}</p>
      </div>

      <div class="preview-experience">
          <h2>Experience</h2>
          ${state.experience.map(exp => `
              <div class="preview-experience-item">
                  <h3>${exp.position} at ${exp.company}</h3>
                  <p>${exp.duration}</p>
                  <p>${exp.description}</p>
              </div>
          `).join('')}
      </div>

      <div class="preview-education">
          <h2>Education</h2>
          ${state.education.map(edu => `
              <div class="preview-education-item">
                  <h3>${edu.degree}</h3>
                  <p>${edu.school} - ${edu.year}</p>
              </div>
          `).join('')}
      </div>

      <div class="preview-skills">
          <h2>Skills</h2>
          <div class="preview-skills-list">
              ${state.skills.filter(skill => skill.trim()).join(' • ')}
          </div>
      </div>
  `;
}

function generateProfessionalTemplate() {
  return `
      <div class="preview-professional">
          <div class="preview-header">
              <h1>${state.personalInfo.name}</h1>
              <div class="contact-info">
                  <p><strong>Email:</strong> ${state.personalInfo.email}</p>
                  <p><strong>Phone:</strong> ${state.personalInfo.phone}</p>
              </div>
          </div>
          
          <div class="preview-section">
              <h2>Professional Summary</h2>
              <p>${state.personalInfo.summary}</p>
          </div>

          <div class="preview-section">
              <h2>Experience</h2>
              ${state.experience.map(exp => `
                  <div class="preview-item">
                      <h3>${exp.position}</h3>
                      <h4>${exp.company} | ${exp.duration}</h4>
                      <p>${exp.description}</p>
                  </div>
              `).join('')}
          </div>

          <div class="preview-section">
              <h2>Education</h2>
              ${state.education.map(edu => `
                  <div class="preview-item">
                      <h3>${edu.degree}</h3>
                      <h4>${edu.school} | ${edu.year}</h4>
                  </div>
              `).join('')}
          </div>

          <div class="preview-section">
              <h2>Skills</h2>
              <p>${state.skills.filter(skill => skill.trim()).join(' • ')}</p>
          </div>
      </div>
  `;
}

function generateMinimalTemplate() {
  return `
      <div class="preview-minimal">
          <div class="preview-header">
              <h1>${state.personalInfo.name}</h1>
              <p>${state.personalInfo.email} | ${state.personalInfo.phone}</p>
          </div>
          
          <hr>
          
          <div class="preview-summary">
              <p>${state.personalInfo.summary}</p>
          </div>

          <hr>

          <div class="preview-section">
              <h2>Experience</h2>
              ${state.experience.map(exp => `
                  <div class="preview-item">
                      <div class="item-header">
                          <h3>${exp.position} - ${exp.company}</h3>
                          <span>${exp.duration}</span>
                      </div>
                      <p>${exp.description}</p>
                  </div>
              `).join('')}
          </div>

          <hr>

          <div class="preview-section">
              <h2>Education</h2>
              ${state.education.map(edu => `
                  <div class="preview-item">
                      <div class="item-header">
                          <h3>${edu.degree} - ${edu.school}</h3>
                          <span>${edu.year}</span>
                      </div>
                  </div>
              `).join('')}
          </div>

          <hr>

          <div class="preview-section">
              <h2>Skills</h2>
              <p>${state.skills.filter(skill => skill.trim()).join(' • ')}</p>
          </div>
      </div>
  `;
}

function generateCreativeTemplate() {
  return `
      <div class="preview-creative">
          <div class="preview-header">
              <h1>${state.personalInfo.name}</h1>
              <div class="contact-info">
                  <p>${state.personalInfo.email}</p>
                  <p>${state.personalInfo.phone}</p>
              </div>
          </div>
          
          <div class="preview-section">
              <h2>About Me</h2>
              <p>${state.personalInfo.summary}</p>
          </div>

          <div class="preview-section">
              <h2>Work Experience</h2>
              ${state.experience.map(exp => `
                  <div class="preview-item">
                      <div class="item-header">
                          <h3>${exp.position}</h3>
                          <span class="company-name">${exp.company}</span>
                      </div>
                      <p class="duration">${exp.duration}</p>
                      <p>${exp.description}</p>
                  </div>
              `).join('')}
          </div>

          <div class="preview-section">
              <h2>Education</h2>
              ${state.education.map(edu => `
                  <div class="preview-item">
                      <h3>${edu.degree}</h3>
                      <p>${edu.school}, ${edu.year}</p>
                  </div>
              `).join('')}
          </div>

          <div class="preview-section">
              <h2>Skills & Expertise</h2>
              <div class="skills-list">
                  ${state.skills.filter(skill => skill.trim()).map(skill => `
                      <span class="skill-tag">${skill}</span>
                  `).join('')}
              </div>
          </div>
      </div>
  `;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', initializeApp);

// State management
let state = {
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: [],
  template: "modern",
};

// Load saved data from localStorage
const savedData = localStorage.getItem("resumeData");
if (savedData) {
  state = JSON.parse(savedData);
  updateFormFromState();
}

// Form elements
const resumeForm = document.getElementById("resumeForm");
const experienceContainer = document.getElementById(
  "experienceContainer"
);
const educationContainer = document.getElementById("educationContainer");
const skillsContainer = document.getElementById("skillsContainer");
const preview = document.getElementById("preview");

// Add event listeners
document
  .getElementById("themeToggle")
  .addEventListener("click", toggleTheme);
document
  .getElementById("downloadPDF")
  .addEventListener("click", downloadPDF);
document
  .getElementById("addExperience")
  .addEventListener("click", addExperience);
document
  .getElementById("addEducation")
  .addEventListener("click", addEducation);
document.getElementById("addSkill").addEventListener("click", addSkill);
document.getElementById("template").addEventListener("change", (e) => {
  state.template = e.target.value;
  updatePreview();
});

// Initialize form
function updateFormFromState() {
  document.getElementById("name").value = state.personalInfo.name;
  document.getElementById("email").value = state.personalInfo.email;
  document.getElementById("phone").value = state.personalInfo.phone;
  document.getElementById("summary").value = state.personalInfo.summary;
  document.getElementById("template").value = state.template;

  // Render experience items
  experienceContainer.innerHTML = "";
  state.experience.forEach((exp, index) => {
    addExperience(exp);
  });

  // Render education items
  educationContainer.innerHTML = "";
  state.education.forEach((edu, index) => {
    addEducation(edu);
  });

  // Render skills
  skillsContainer.innerHTML = "";
  state.skills.forEach((skill, index) => {
    addSkill(skill);
  });

  updatePreview();
}

// Form input handlers
function handlePersonalInfoInput(e) {
  state.personalInfo[e.target.name] = e.target.value;
  saveState();
  updatePreview();
}

function addExperience(data = null) {
  const expDiv = document.createElement("div");
  expDiv.className = "experience-item";
  expDiv.innerHTML = `
          <div class="form-group">
              <label>Company</label>
              <input type="text" class="exp-company" value="${
                data?.company || ""
              }">
          </div>
          <div class="form-group">
              <label>Position</label>
              <input type="text" class="exp-position" value="${
                data?.position || ""
              }">
          </div>
          <div class="form-group">
              <label>Duration</label>
              <input type="text" class="exp-duration" value="${
                data?.duration || ""
              }">
          </div>
          <div class="form-group">
              <label>Description</label>
              <textarea class="exp-description" rows="3">${
                data?.description || ""
              }</textarea>
          </div>
          <button type="button" class="btn-danger remove-experience">Remove</button>
      `;

  experienceContainer.appendChild(expDiv);
  attachExperienceListeners(expDiv);

  if (!data) {
    state.experience.push({
      company: "",
      position: "",
      duration: "",
      description: "",
    });
    saveState();
  }
}

function attachExperienceListeners(expDiv) {
  const inputs = expDiv.querySelectorAll("input, textarea");
  const index = Array.from(experienceContainer.children).indexOf(expDiv);

  inputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      const field = e.target.className.split("-")[1];
      state.experience[index][field] = e.target.value;
      saveState();
      updatePreview();
    });
  });

  expDiv
    .querySelector(".remove-experience")
    .addEventListener("click", () => {
      expDiv.remove();
      state.experience.splice(index, 1);
      saveState();
      updatePreview();
    });
}

function addEducation(data = null) {
  const eduDiv = document.createElement("div");
  eduDiv.className = "education-item";
  eduDiv.innerHTML = `
          <div class="form-group">
              <label>School</label>
              <input type="text" class="edu-school" value="${
                data?.school || ""
              }">
          </div>
          <div class="form-group">
              <label>Degree</label>
              <input type="text" class="edu-degree" value="${
                data?.degree || ""
              }">
          </div>
          <div class="form-group">
              <label>Year</label>
              <input type="text" class="edu-year" value="${
                data?.year || ""
              }">
          </div>
          <button type="button" class="btn-danger remove-education">Remove</button>
      `;

  educationContainer.appendChild(eduDiv);
  attachEducationListeners(eduDiv);

  if (!data) {
    state.education.push({
      school: "",
      degree: "",
      year: "",
    });
    saveState();
  }
}

function attachEducationListeners(eduDiv) {
  const inputs = eduDiv.querySelectorAll("input");
  const index = Array.from(educationContainer.children).indexOf(eduDiv);

  inputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      const field = e.target.className.split("-")[1];
      state.education[index][field] = e.target.value;
      saveState();
      updatePreview();
    });
  });

  eduDiv
    .querySelector(".remove-education")
    .addEventListener("click", () => {
      eduDiv.remove();
      state.education.splice(index, 1);
      saveState();
      updatePreview();
    });
}

function addSkill(skill = "") {
  const skillDiv = document.createElement("div");
  skillDiv.className = "skill-item";
  skillDiv.innerHTML = `
          <input type="text" class="skill-input" value="${skill}">
          <button type="button" class="btn-danger remove-skill">×</button>
      `;

  skillsContainer.appendChild(skillDiv);
  attachSkillListeners(skillDiv);

  if (!skill) {
    state.skills.push("");
    saveState();
  }
}

function attachSkillListeners(skillDiv) {
  const input = skillDiv.querySelector(".skill-input");
  const index = Array.from(skillsContainer.children).indexOf(skillDiv);

  input.addEventListener("input", (e) => {
    state.skills[index] = e.target.value;
    saveState();
    updatePreview();
  });

  skillDiv
    .querySelector(".remove-skill")
    .addEventListener("click", () => {
      skillDiv.remove();
      state.skills.splice(index, 1);
      saveState();
      updatePreview();
    });
}

// Theme toggle
function toggleTheme() {
  document.body.setAttribute(
    "data-theme",
    document.body.getAttribute("data-theme") === "dark" ? "light" : "dark"
  );
}

// Preview update
function updatePreview() {
  const template = state.template;
  let previewHTML = "";

  switch (template) {
    case "modern":
      previewHTML = `
                  <div class="preview-header">
                      <h1>${state.personalInfo.name}</h1>
                      <p>${state.personalInfo.email} | ${
        state.personalInfo.phone
      }</p>
                  </div>
                  
                  <div class="preview-summary">
                      <h2>Professional Summary</h2>
                      <p>${state.personalInfo.summary}</p>
                  </div>

                  <div class="preview-experience">
                      <h2>Experience</h2>
                      ${state.experience
                        .map(
                          (exp) => `
                          <div class="preview-experience-item">
                              <h3>${exp.position} at ${exp.company}</h3>
<p>${exp.description}</p>
                          </div>
                      `
                        )
                        .join("")}
                  </div>

                  <div class="preview-education">
                      <h2>Education</h2>
                      ${state.education
                        .map(
                          (edu) => `
                          <div class="preview-education-item">
                              <h3>${edu.degree}</h3>
                              <p>${edu.school} - ${edu.year}</p>
                          </div>
                      `
                        )
                        .join("")}
                  </div>

                  <div class="preview-skills">
                      <h2>Skills</h2>
                      <div class="preview-skills-list">
                          ${state.skills
                            .filter((skill) => skill.trim())
                            .join(" • ")}
                      </div>
                  </div>
              `;
      break;

    case "professional":
      previewHTML = `
                  <div class="preview-header" style="border-bottom: 2px solid #2563eb; padding-bottom: 1rem;">
                      <h1 style="color: #2563eb">${
                        state.personalInfo.name
                      }</h1>
                      <p>${state.personalInfo.email} | ${
        state.personalInfo.phone
      }</p>
                  </div>
                  
                  <div class="preview-summary">
                      <h2 style="color: #2563eb">Professional Summary</h2>
                      <p>${state.personalInfo.summary}</p>
                  </div>

                  <div class="preview-experience">
                      <h2 style="color: #2563eb">Professional Experience</h2>
                      ${state.experience
                        .map(
                          (exp) => `
                          <div class="preview-experience-item" style="margin-bottom: 1rem;">
                              <h3 style="margin-bottom: 0.25rem;">${exp.position}</h3>
                              <p style="font-weight: bold;">${exp.company} | ${exp.duration}</p>
                              <p>${exp.description}</p>
                          </div>
                      `
                        )
                        .join("")}
                  </div>

                  <div class="preview-education">
                      <h2 style="color: #2563eb">Education</h2>
                      ${state.education
                        .map(
                          (edu) => `
                          <div class="preview-education-item" style="margin-bottom: 1rem;">
                              <h3 style="margin-bottom: 0.25rem;">${edu.degree}</h3>
                              <p>${edu.school} - ${edu.year}</p>
                          </div>
                      `
                        )
                        .join("")}
                  </div>

                  <div class="preview-skills">
                      <h2 style="color: #2563eb">Skills</h2>
                      <p>${state.skills
                        .filter((skill) => skill.trim())
                        .join(" • ")}</p>
                  </div>
              `;
      break;

    case "minimal":
      previewHTML = `
                  <div class="preview-header" style="margin-bottom: 2rem;">
                      <h1>${state.personalInfo.name}</h1>
                      <p>${state.personalInfo.email} | ${
        state.personalInfo.phone
      }</p>
                  </div>
                  
                  <div class="preview-summary">
                      <p>${state.personalInfo.summary}</p>
                  </div>

                  <div class="preview-experience">
                      <h2>Experience</h2>
                      ${state.experience
                        .map(
                          (exp) => `
                          <div class="preview-experience-item" style="margin-bottom: 1rem;">
                              <p style="font-weight: bold;">${exp.position} • ${exp.company}</p>
                              <p style="font-style: italic;">${exp.duration}</p>
                              <p>${exp.description}</p>
                          </div>
                      `
                        )
                        .join("")}
                  </div>

                  <div class="preview-education">
                      <h2>Education</h2>
                      ${state.education
                        .map(
                          (edu) => `
                          <div class="preview-education-item" style="margin-bottom: 1rem;">
                              <p style="font-weight: bold;">${edu.degree}</p>
                              <p>${edu.school} • ${edu.year}</p>
                          </div>
                      `
                        )
                        .join("")}
                  </div>

                  <div class="preview-skills">
                      <h2>Skills</h2>
                      <p>${state.skills
                        .filter((skill) => skill.trim())
                        .join(" • ")}</p>
                  </div>
              `;
      break;
  }

  preview.innerHTML = previewHTML;
}

// Save state to localStorage
function saveState() {
  localStorage.setItem("resumeData", JSON.stringify(state));
}

// Download PDF
async function downloadPDF() {
  const element = document.getElementById("preview");
  const opt = {
    margin: 1,
    filename: `${state.personalInfo.name.replace(
      /\s+/g,
      "_"
    )}_resume.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Error generating PDF. Please try again.");
  }
}

// Add input listeners for personal info
document
  .getElementById("name")
  .addEventListener("input", handlePersonalInfoInput);
document
  .getElementById("email")
  .addEventListener("input", handlePersonalInfoInput);
document
  .getElementById("phone")
  .addEventListener("input", handlePersonalInfoInput);
document
  .getElementById("summary")
  .addEventListener("input", handlePersonalInfoInput);

// Initial preview update
updatePreview();

const maxProjects = 3;

window.onload = () => {
  const profile = JSON.parse(localStorage.getItem("profile"));
  if (profile) renderProfile(profile);
};

function saveProfile() {
  const name = document.getElementById("nameInput").value;
  const tagline = document.getElementById("taglineInput").value;
  const about = document.getElementById("aboutInput").value;
  const github = document.getElementById("githubInput").value;
  const linkedin = document.getElementById("linkedinInput").value;
  const email = document.getElementById("emailInput").value;
  const file = document.getElementById("imgInput").files[0];
  const projects = [];

  for (let i = 0; i < maxProjects; i++) {
    const title = document.getElementById(`projTitle${i}`)?.value;
    const desc = document.getElementById(`projDesc${i}`)?.value;
    const link = document.getElementById(`projLink${i}`)?.value;
    if (title || desc || link) {
      projects.push({ title, desc, link });
    }
  }

  const profile = {
    name, tagline, about, github, linkedin, email, projects
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      profile.avatar = e.target.result;
      localStorage.setItem("profile", JSON.stringify(profile));
      renderProfile(profile);
    };
    reader.readAsDataURL(file);
  } else {
    const saved = JSON.parse(localStorage.getItem("profile")) || {};
    profile.avatar = saved.avatar || "";
    localStorage.setItem("profile", JSON.stringify(profile));
    renderProfile(profile);
  }
}

function renderProfile(data) {
  document.getElementById("displayName").textContent = data.name || "";
  document.getElementById("displayTagline").textContent = data.tagline || "";
  document.getElementById("displayAbout").textContent = data.about || "";
  if (data.avatar) {
    document.getElementById("avatar").src = data.avatar;
  }

  const linksHTML = [];
  if (data.github) linksHTML.push(`<a href="${data.github}" target="_blank">GitHub</a>`);
  if (data.linkedin) linksHTML.push(`<a href="${data.linkedin}" target="_blank">LinkedIn</a>`);
  if (data.email) linksHTML.push(`<a href="mailto:${data.email}">Email</a>`);
  document.getElementById("socialLinks").innerHTML = linksHTML.join(" ");

  const projHTML = data.projects.map(p => `
    <div class="project-card">
      <a href="${p.link}" target="_blank">${p.title}</a>
      <p>${p.desc}</p>
    </div>
  `).join("");
  document.getElementById("projectCards").innerHTML = projHTML;

  document.getElementById("editMode").style.display = "none";
  document.getElementById("displayMode").style.display = "block";
}

function editProfile() {
  document.getElementById("editMode").style.display = "block";
  document.getElementById("displayMode").style.display = "none";
}

// Add empty project input set
function addProject() {
  const container = document.getElementById("projectInputs");
  const count = container.children.length / 3;
  if (count >= maxProjects) return;

  const index = count;
  container.insertAdjacentHTML("beforeend", `
    <input type="text" id="projTitle${index}" placeholder="Project ${index + 1} Title" />
    <input type="text" id="projDesc${index}" placeholder="Description" />
    <input type="text" id="projLink${index}" placeholder="Link (https://...)" />
  `);
}

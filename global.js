console.log("IT’S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// let navLinks = $$("nav a");

// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname,
// );

// if (currentLink) {
//   // or if (currentLink !== undefined)
//   currentLink.classList.add('current');
// }

// navigation menu
let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'resume/', title: 'Resume' },
  { url: 'meta/', title: 'Meta'},
  { url: 'https://github.com/salina-tang', title: 'GitHub' }
];

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/portfolio/";         // GitHub Pages repo name

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  if (!url.startsWith('http')) {
    url = BASE_PATH + url;
  }
  
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  nav.append(a);

  if (
    a.host === location.host &&
    (a.pathname === location.pathname ||
    (a.pathname === "/portfolio/" && location.pathname === "/portfolio/index.html"))
  ) {
    a.classList.add('current');
  }

  if (a.host !== location.host) {
    a.target = "_blank";
  }
}

// light-dark theme
document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">
		Theme:
		<select>
			<option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
		</select>
	</label>`,
);

const select = document.querySelector(".color-scheme select");

if ("colorScheme" in localStorage) {
  const scheme = localStorage.colorScheme;

  document.documentElement.style.setProperty("color-scheme", scheme);
  select.value = scheme;
}

select.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);
  document.documentElement.style.setProperty('color-scheme', event.target.value);
  localStorage.colorScheme = event.target.value;
});

// contacts email adjustment
const form = document.querySelector("form");

form?.addEventListener("submit", function (event) {
  event.preventDefault();

  let data = new FormData(form);
  let url = form.action + "?";

  for (let [name, value] of data) {
    value = encodeURIComponent(value);

    url += `${name}=${value}&`;

    console.log(name, value);
  }

  location.href = url;
});


//  fetching projects data
export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

// render projects function
export function renderProjects(project, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';

  for (let proj of project) {
    const article = document.createElement('article');

    article.innerHTML = `
      <${headingLevel}>${proj.title}</${headingLevel}>
      <img src="${proj.image}" alt="${proj.title}">
      <div class="project-text">
        <p>${proj.description}</p>
        <p class="project-year">${proj.year}</p>
      </div>
    `;

    containerElement.appendChild(article);
  }
}

// fetch Github API
export async function fetchGitHubData(username) {
  // return statement here
  return fetchJSON(`https://api.github.com/users/${username}`);
}
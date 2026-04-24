import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

// adding projects count
const title = document.querySelector('.projects-title');
title.textContent = `Projects (${projects.length})`;
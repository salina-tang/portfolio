import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';


const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

// adding projects count
const title = document.querySelector('.projects-title');
title.textContent = `Projects (${projects.length})`;

// creating pie chart
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

let projects2 = await fetchJSON('../lib/projects.json');

let query = '';
let searchInput = document.querySelector('.searchBar');
let selectedIndex = -1;

function renderPieChart(projectsGiven) {
    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );
    // re-calculate data
    let newData = newRolledData.map(([year, count]) => {
        return { value: count, label: year }; // TODO
    });
    // re-calculate slice generator, arc data, arc, etc.
    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let colors = d3.scaleOrdinal(d3.schemePastel1);

    let newArcs = newArcData.map((d) => arcGenerator(d));

    // TODO: clear up paths and legends
    d3.select('#projects-pie-plot').selectAll('path').remove();
    d3.select('.legend').selectAll('li').remove();

    selectedIndex = -1;

    // update paths and legends, refer to steps 1.4 and 2.2
    newArcs.forEach((arc, idx) => {
        d3
        .select('#projects-pie-plot')
        .append('path')
        .attr('d', arc)
        .attr('fill', colors(idx))
        .on('click', () => {
            selectedIndex = selectedIndex === idx ? -1 : idx;

            let selectedYear =
                selectedIndex === -1 ? null : newData[selectedIndex].label;

            let filteredProjects;
            
            if (selectedIndex === -1) {
                filteredProjects = projectsGiven;
            } else {
                filteredProjects = projectsGiven.filter(
                    (p) => String(p.year) === String(selectedYear)
                );
            }

            renderProjects(filteredProjects, projectsContainer, 'h2');

            renderPieChart(projectsGiven);
                });
        });

    newData.forEach((d, idx) => {
        d3
        .select('.legend')
        .append('li')
        .attr('class', 'legend-item')
        .attr('style', `--color:${colors(idx)}`)
        .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    });

    d3.select('#projects-pie-plot')
        .selectAll('path')
        .attr('class', (_, i) =>
            i === selectedIndex ? 'selected' : null
        );

    d3.select('.legend')
        .selectAll('li')
        .attr('class', (_, i) =>
            i === selectedIndex ? 'legend-item selected' : 'legend-item'
        );
}

// Call this function on page load
renderPieChart(projects2);

searchInput.addEventListener('change', (event) => {
    query = event.target.value;

    let filteredProjects = projects2.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });
    // re-render legends and pie chart when event triggers
    renderProjects(filteredProjects, projectsContainer, 'h2');
    selectedIndex = -1;
    renderPieChart(filteredProjects);
});
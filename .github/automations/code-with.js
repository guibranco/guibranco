const fs = require("fs");
const { ReadmeBox } = require('readme-box');
const simpleIcon = require("simple-icons");
const fileName = ".github/automations/code-with.json";
const generateImage = (tech) => {
  if (!simpleIcon["si" + tech.slug] && typeof tech.color === "undefined") {
    throw new Error(`Icon not found for ${tech.name}`);
  }
  
  if (!simpleIcon["si" + tech.slug] && typeof tech.color !== "undefined") {
    return `<img alt="${tech.name}" src="https://img.shields.io/badge/❔-${tech.text}-${tech.color}?style=flat-square" />`;
  }
  
  const icon = simpleIcon["si" + tech.slug];
  return `<img alt="${tech.name}" src="https://img.shields.io/badge/-${tech.text}-${icon.hex}?style=flat-square&logo=${icon.slug}&logoColor=white" />`;
};

/**
 * Generates an HTML table row for a given skill and its associated technologies.
 *
 * This function takes an object containing a skill and an array of technologies,
 * processes the technologies to generate corresponding HTML images, and returns
 * a formatted table row as a string.
 *
 * @param {Object} data - The data object containing skill and technologies.
 * @param {string} data.skill - The name of the skill to be displayed in the table header.
 * @param {Array<string>} data.technologies - An array of technology names associated with the skill.
 * 
 * @returns {string} A string representing an HTML table row with the skill and its technologies.
 *
 * @example
 * const row = generateRow({
 *   skill: 'JavaScript',
 *   technologies: ['React', 'Node.js', 'Express']
 * });
 * // Returns: <tr><th>JavaScript</th><td><img src="react.png" alt="React"><img src="node.png" alt="Node.js"><img src="express.png" alt="Express"></td></tr>
 */
const generateRow = (data) => {
  const techs = data.technologies.map((tech) => generateImage(tech));
  return `<tr><th>${data.skill}</th><td>${techs.join("\n")}</td></tr>`;
};

async function main() {
  const data = fs.readFileSync(fileName, "utf8");
  const json = JSON.parse(data);
  const rows = json.map((row) => generateRow(row));
  const html = `<table width="100%"><thead><th>Skill</th><th>Technologies</th></thead><tbody>${rows.join(
    "\n"
  )}</tbody></table>`;

  await ReadmeBox.updateSection(html, {
    owner: process.env.GITHUB_REPOSITORY.split("/")[0],
    repo: process.env.GITHUB_REPOSITORY.split("/")[1],
    token: process.env.GITHUB_TOKEN,
    branch: "main",
    section: "code-with-section",
    emptyCommits: false,
  });
}

main();

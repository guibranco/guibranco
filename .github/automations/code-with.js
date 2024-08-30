const fs = require("fs");
const { ReadmeBox } = require('readme-box');
const simpleIcon = require("simple-icons");
const fileName = ".github/automations/code-with.json";
/**
 * Generates an HTML image element for a technology badge.
 *
 * This function checks if a simple icon exists for the given technology. 
 * If the icon is not found and no color is specified, an error is thrown. 
 * If the icon is not found but a color is provided, a default badge with 
 * the specified color is generated. If the icon is found, a badge with 
 * the corresponding icon and its color is generated.
 *
 * @param {Object} tech - The technology object containing details for the badge.
 * @param {string} tech.slug - The slug used to identify the technology.
 * @param {string} tech.name - The name of the technology.
 * @param {string} tech.text - The text to display on the badge.
 * @param {string} [tech.color] - The optional color for the badge.
 *
 * @throws {Error} Throws an error if the icon is not found and no color is provided.
 *
 * @returns {string} An HTML string representing the image element for the badge.
 *
 * @example
 * const tech = {
 *   slug: 'javascript',
 *   name: 'JavaScript',
 *   text: 'JavaScript',
 *   color: 'yellow'
 * };
 * const badgeHtml = generateImage(tech);
 * // Returns: '<img alt="JavaScript" src="https://img.shields.io/badge/-JavaScript-yellow?style=flat-square&logo=javascript&logoColor=white" />'
 */
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

const generateRow = (data) => {
  const techs = data.technologies.map((tech) => generateImage(tech));
  return `<tr><th>${data.skill}</th><td>${techs.join("\n")}</td></tr>`;
};

/**
 * The main function that orchestrates the reading of a JSON file,
 * parsing its content, generating HTML table rows from the data,
 * and updating a section in a README file on GitHub.
 *
 * This function performs the following steps:
 * 1. Reads the content of a specified file synchronously.
 * 2. Parses the JSON content into an array of objects.
 * 3. Generates HTML table rows for each object in the array.
 * 4. Constructs an HTML table with the generated rows.
 * 5. Updates a specified section of a README file in a GitHub repository
 *    using the ReadmeBox utility.
 *
 * @async
 * @function main
 * @throws {Error} Throws an error if reading the file or parsing JSON fails.
 * @returns {Promise<void>} A promise that resolves when the README section is updated.
 *
 * @example
 * // To execute the main function
 * main().then(() => {
 *   console.log('README section updated successfully.');
 * }).catch((error) => {
 *   console.error('Error updating README section:', error);
 * });
 */
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

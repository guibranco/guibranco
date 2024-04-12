const fs = require("fs");
const { ReadmeBox } = require('readme-box');
const simpleIcon = require("simple-icons");
const fileName = ".github/automations/code-with.json";
const generateImage = (tech) => {
  if (simpleIcon["si" + tech.slug]) {
    const icon = simpleIcon["si" + tech.slug];
    return `<img alt="${tech.name}" src="https://img.shields.io/badge/-${tech.text}-${icon.hex}?style=flat-square&logo=${icon.slug}&logoColor=white" />`;
  }
  console.error(`Icon not found for ${tech.name}`);
  return tech.name;
};

const generateRow = (data) => {
  const techs = data.technologies.map((tech) => generateImage(tech));
  return `<tr><the style="font-size:0.8rem;">${data.skill}</th><td>${techs.join(" ")}</td></tr>`;
};

async function main() {
  const data = fs.readFileSync(fileName, "utf8");
  const json = JSON.parse(data);
  const rows = json.map((row) => generateRow(row));
  const html = `<table width="100%"><thead><th>Skill</th><th>Technologies</th></thead><tbody>${rows.join(
    ""
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

#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const [, , projectName] = process.argv;

if (!projectName) {
    console.error("Error: Please provide a project name.\nUsage: npx ne-starter my-project-name");
    process.exit(1);
}

const targetPath = path.join(process.cwd(), projectName);

if (fs.existsSync(targetPath)) {
    console.error(`Error: The folder "${projectName}" already exists.`);
    process.exit(1);
}

// Copy template files
fs.cpSync(__dirname, targetPath, { recursive: true });

// Ensure .gitignore is copied (it might be skipped by default)
const gitignorePath = path.join(__dirname, '.gitignore');
if (fs.existsSync(gitignorePath)) {
    fs.copyFileSync(gitignorePath, path.join(targetPath, '.gitignore'));
}

// Read the original package.json
const packageJson = JSON.parse(fs.readFileSync(path.join(targetPath, "package.json"), "utf8"));

// Update package.json fields while preserving dependencies
packageJson.name = projectName;
packageJson.version = "1.0.0";
packageJson.description = "A Node.js Express application created with ne-starter";
delete packageJson.bin;

// Write the modified package.json
fs.writeFileSync(
    path.join(targetPath, "package.json"),
    JSON.stringify(packageJson, null, 2)
);

// Remove the CLI file as it's not needed in the new project
fs.unlinkSync(path.join(targetPath, "index.js"));

console.log(`✅ Project "${projectName}" created successfully!`);
console.log(`👉 Next steps:\n  cd ${projectName}\n  npm install\n  npm start`);

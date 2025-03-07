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

// Remove package-related files (to avoid conflicts)
fs.unlinkSync(path.join(targetPath, "package.json"));
fs.unlinkSync(path.join(targetPath, "index.js"));

// Initialize new npm package
execSync("npm init -y", { cwd: targetPath, stdio: "inherit" });

console.log(`✅ Project "${projectName}" created successfully!`);
console.log(`👉 Next steps:\n  cd ${projectName}\n  npm install\n  npm start`);

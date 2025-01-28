const fs = require("fs");
const { execSync } = require("child_process");

function getChangedFiles() {
  const output = execSync("git diff --name-only HEAD~1").toString();
  return output.split("\n").filter(file => file.endsWith(".js"));
}

// Function to check for function names starting with "ranjan" and return line numbers
function findForbiddenFunctions(filePath) {
  const code = fs.readFileSync(filePath, "utf8");
  const lines = code.split("\n");
  let issues = [];

  const regex = /\bfunction\s+ranjan\w*\s*\(/g;  // Matches function ranjanSomething()

  lines.forEach((line, index) => {
    if (regex.test(line)) {
      issues.push({
        file: filePath,
        line: index + 1,  // Line numbers start from 1
        message: `🚨 **Forbidden function name found**: Please remove "ranjan" from function names.`,
      });
    }
  });

  return issues;
}

function main() {
  const changedFiles = getChangedFiles();
  let allIssues = [];

  for (const file of changedFiles) {
    const issues = findForbiddenFunctions(file);
    allIssues = allIssues.concat(issues);
  }

  if (allIssues.length > 0) {
    fs.writeFileSync("comment_output.json", JSON.stringify(allIssues, null, 2)); // ✅ Save JSON file
    console.log("Issues detected. Stored in comment_output.json");
    process.exit(1);  // Exit with an error code to fail the job
  } else {
    console.log("✅ No issues found.");
  }
}

main();

const fs = require("fs");
const path = require("path");

// Function to get changed files in the PR
async function getChangedFiles() {
  const { execSync } = require("child_process");
  const output = execSync("git diff --name-only HEAD~1").toString(); // More reliable way to get previous commit
  return output.split("\n").filter(file => file.endsWith(".js"));
}

// Function to check for function names starting with "ranjan"
function containsForbiddenFunction(filePath) {
  const code = fs.readFileSync(filePath, "utf8");
  const regex = /\bfunction\s+ranjan\w*\s*\(/g;  // Matches function ranjanSomething()
  return regex.test(code);
}

async function main() {
  const changedFiles = await getChangedFiles();
  let foundIssue = false;

  for (const file of changedFiles) {
    if (containsForbiddenFunction(file)) {
      console.log(`❌ Issue found in ${file}`);
      foundIssue = true;
    }
  }

  if (foundIssue) {
    console.log("::set-output name=needs_comment::true"); // Used by GitHub Actions
    process.exit(1);  // Fail the step so the workflow knows there's an issue
  } else {
    console.log("✅ No issues found.");
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

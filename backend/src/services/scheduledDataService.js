const path = require("path");
const { spawnSync } = require("child_process");

const RETENTION_DAYS = parseInt(process.env.DATA_RETENTION_DAYS || "4", 10);

function runPythonGenerator() {
  const scriptPath = path.resolve(__dirname, "../../generate_data.py");
  const pythonExecutable = process.env.PYTHON_BIN || "python3";

  const result = spawnSync(pythonExecutable, [scriptPath], {
    cwd: path.resolve(__dirname, "../.."),
    env: { ...process.env },
    encoding: "utf8",
  });

  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    throw new Error(output || "Python generator failed");
  }

  return result.stdout.trim();
}

async function refreshData() {
  const output = runPythonGenerator();
  return { message: "Data refresh completed", output };
}

module.exports = { refreshData, RETENTION_DAYS };
/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  collectCoverage: true,
  // coverageReporters: ["json", "html", "text"],
  coverageReporters: ["json", "text"],
};

// const _id = require("mongodb").ObjectId;

module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "airbnb-base", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  // This rule is set to error for all console methods except for console.error
  rules: {
    "no-console": ["error", { allow: ["error"] }],
    "no-underscore-dangle": ["error", { allow: ["_id", "__v"] }],
  },
};

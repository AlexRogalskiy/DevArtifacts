module.exports = {
  extends: "airbnb-base",
  parser: "babel-eslint",
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  rules: {
    semi: ["error", "never"],
  },
}

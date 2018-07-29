module.exports = {
  "extends": "airbnb",
  "globals": {
    "document": true,
    "jQuery": true,
    "window": true,
    "$": true
  },
  "installedESLint": true,
  "plugins": [
      "react",
      "jsx-a11y",
      "import"
  ],
  "rules": {
    "global-require": 1,
    "no-underscore-dangle": [
      2, {
        "allowAfterThis": true
      }
    ]
  }
};
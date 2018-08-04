# Path Missing

#### Why This Error Occurred

When running the `micro` command, you need to pass a path to a file or directory that contains your microservice. If you don't define one, it will detect the entry file to your code using the `main` property inside the `package.json` file in the directory where the command is run.

#### Possible Ways to Fix It

- Enter the path to your microservice in the `main` property inside `package.json`
- Specify the path of your entry file when running the command: `micro <path>`

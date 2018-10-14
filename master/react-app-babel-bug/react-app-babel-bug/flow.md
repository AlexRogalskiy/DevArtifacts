# YARSK

## Code

### Formatting rules
Use of `linter-eslint` atom plugin is strictly encouraged.

Rules:
- 4 spaces soft tab
- enforced trailing semicolon

### Coding rules
- async/await over promises chaining
- class properties over constructor initialisation
- inline arrow functions over plain functions

### Bundles
App bundles (i.e: public website, user private area, admin cms...) are defined as `bundles` in the `package.json`.

### Credentials & Configuration variables
App credentials and configuration variables are defined in the `package.json`.
Each entry (i.e: database connections, facebook, twitter and google api keys, hostnames and ports, ssl certificate and key paths...) is defined has a `dictionary` with available environments as subkeys defining per-environment data.

## Repository

### Branching strategy
- master: main development branch with tags referencing stable (production) releases
- feature-x: specific feature "x" branch
- hotfix-x: specific hotfix "x" branch
- any "feature" or "hotfix" branch must have one or more associated issues
- any "feature" or "hotfix" branch merging into "master" must reference the associated issues (i.e "close #123, close #456") in the commit message

### Continuous Integration strategy
- building and deploying is "tag-driven": i.e `$ git tag -a <tag-name> -m <tag-description>`
- IF commit on "master" is tagged AND tag message does not contain the word "manual"
- THEN deploy to production environment
- OTHERWISE deploy to staging environment

#### Travis-CI SSH keys setup
- generate a dedicated SSH key for Travis-CI (easier to isolate and to revoke)
- encrypt the private key to make it readable only by Travis CI (so we can stage & commit it safely)
- copy the public key onto the remote SSH host
- delete the private key and do what you please with public key
- stage & commit the encrypted key
```
ssh-keygen -t rsa -b 4096 -C 'build@travis-ci.com' -f travis-ci
ssh-copy-id -i travis-ci <user>@<hostname>
travis encrypt-file travis-ci
rm -f travis-ci
git add travis-ci.enc
```
In our `.travis.yml`:
```
- openssl aes-256-cbc -K $encrypted_<...>_key -iv $encrypted_<...>_iv -in deploy_rsa.enc -out /tmp/deploy_rsa -d
- eval "$(ssh-agent -s)"
- chmod 600 /tmp/deploy_rsa
- ssh-add /tmp/deploy_rsa
```

#### GIT Cheat Sheet
- `git status`: show staged and unstaged files where staged files will be included into next commit while unstaged files will not
- `git add <file1> <file2>`: stage files
- `git add -A`: stage all files
- `git commit -am "message"`: commit the staged files (aka save the work done) and attach a message to the commit; GIT will assign a unique hash to this commit that can be used to 1) reference it 2) "checkout" it 3) compare it to other commits
- `git branch`: show branches
- `git checkout -b <branch>`: create a new branch named <branch>
- `git branch -D <branch>`: delete the branch named <branch>
- `git merge <branch>`: merge branch named <branch> into current branch
- `git stash`: cut all the staged work and save it to reapply everything when needed with `git apply`
- `git push <remote-repo> <branch>`: push the local commits from local <branch> to <remote-repo>:<branch>
- `git pull <remote-repo> <branch>`: pull and merge the remote commits from <remote-repo>:<branch> into local <branch>
- `git pull --rebase <remote-repo> <branch>`: same as before but apply my commits on top of the remote commits, MANDATORY when different members are working on the same branch
- `git log --graph --oneline --shortstat`: pretty print commits graph

## Stack
Developers has to keep their local software version consistent with the following:
- GIT v2+
- NodeJS v8.6+
- Postgres v10+
- Redis v4+
- global NPM dependencies: `npm install -g pm2 yarn`

## SEO and SSR
Any bundle with `"prerender"=true` is server-side rendered.
Try out with:
```
//locally
curl http://localhost:8080  
curl http://localhost:8080 --user-agent "Googlebot/2.1"
```
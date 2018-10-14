#!/usr/bin/env node

const prompt = require('prompt')
const exec = require('child_process').exec
const init = (from, into, pass) => {
  const user = into.split('/')[0]
  const dir = into.split('/')[1]
  const repo = from.includes('/') ? from : `${user}/${from}`
  const cmd = [
    `curl -u '${user}:${pass}' https://api.github.com/user/repos -d '{ "name":"${dir}" }'`,
    `git clone https://github.com/${repo}.git ${dir}`,
    `cd ${dir}`,
    `rm -rf .git`,
    `git init`,
    `git remote add origin git@github.com:${user}/${dir}.git`,
    `git add .`,
    `git commit -m "Gitinit ${from}"`,
    `git push origin master`,
  ].join(' && ')
  exec(cmd, (error, stdout, stderr) => {
    if(!error) console.log(`Initialized ${user}/${dir} from ${repo}`)
    else console.log(error)
  })
}

prompt.start()
prompt.get({
  properties: {
    into: { hidden: false },
    pass: { hidden: true },
  }
}, (err, inp) => {
  init(process.argv[2], inp.into, inp.pass)
})

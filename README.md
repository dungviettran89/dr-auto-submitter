# dr-auto-submitter

A node based DeepRacer league submitter, this will help you auto sumit your model every 10 seconds

# Usage

Simply install Chrome, Node and execute one command.
```
$npx dr-auto-submit -h
npx: installed 56 in 5.137s
Usage: dr-auto-submit -a <accountId> -u <username> -p <password> -s <model>:<raceArn> -s <model>:<raceArn>

Options:
  -a, --account <accountId>       Account Id to use for autosubmission. Sample: -a 6817631413
  -u, --username <username>       Username used for submission. Sample: -u Aihsadhahl
  -p, --password <password>       Password used to login to console. Sample: -p iuasdadgad12
  -s, --submit <model>:<raceArn>  Model and race to submit to, you can provide multiple submissions. -s awesome-model:arn%3Aaws%3Adeepracer%3A%3A%3Aleaderboard%2F55234c74-2c48-466d-9e66-242ddf05e04d (default: [])
  -e, --executable                Location of your chrome binary file. Default /usr/bin/chromium-browser
  -d, --debug                     Enable debug
  --no-headless                   Disable headless mode
  -h, --help                      Read more information
```

# Guide

1. Obtain valid a sub account with all Deep Racer permission. Follow instruction [here](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_create.html) to create a sub account.
A valid account will consist of 3 information: account id, username and password.
2. Train and make sure your model is in valid state to submit. 
3. Open your league leader board and copy race arn. League arn is the value started with arn after `#/league`
`https://console.aws.amazon.com/deepracer/home?region=us-east-1#league/arn%3Aaws%3Adeepracer%3A%3A%3Aleaderboard%2F55234c74-2c48-466d-9e66-242ddf05e04d`
will have arn: `arn%3Aaws%3Adeepracer%3A%3A%3Aleaderboard%2F55234c74-2c48-466d-9e66-242ddf05e04d`
4. Make sure Chrome and Node are installed in your system.
5. Execute commandline `npx dr-auto-submit -a <account> -u <username> -p <password> -s <model1>:<arn1> -s <model2>:<arn2>` 

## Installation on Linux
Install Chromium
```shell script
apt-get update && apt-get install -y chromium-browser
```
Install NodeJS on your server following [instruction](https://github.com/nodesource/distributions
)
```shell script
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
```
Start submission
```shell script
npx dr-auto-submit -a <account> -u <username> -p <password> -s <model1>:<arn1> -s <model2>:<arn2>
```
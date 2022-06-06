#!/usr/bin/env node

import {program} from "commander";
import {Submitter} from "./submitter";

(async () => {
    program
        .name('dr-auto-submit')
        .usage('-a <accountId> -u <username> -p <password> -s <mode1l>:<raceHash1> -s <model2>:<raceHash2>')
        .requiredOption('-a, --account <accountId>', 'Account Id to use for autosubmission. Sample: -a 6817631413')
        .requiredOption('-u, --username <username>', 'Username used for submission. Sample: -u Aihsadhahl')
        .requiredOption('-p, --password <password>', 'Password used to login to console. Sample: -p iuasdadgad12')
        .requiredOption('-s, --submit <model>:<raceHash>', 'Model and race to submit to, you can provide multiple submissions. -s awesome-model:races/arn%3Aaws%3Adeepracer%3A%3A%3Aleaderboard%2F55234c74-2c48-466d-9e66-242ddf05e04d', (v, p) => p.concat(v), [])
        .option('-e, --executable', `Location of your chrome binary file. `)
        .option('-d, --debug', 'Enable debug')
        .option('--no-headless', 'Disable headless mode')
        .helpOption('-h, --help', 'Read more information');
    program.parse(process.argv);
    let options: any = program.opts();
    let {account, username, password, submit, headless, debug, executable} = options;
    if (debug) {
        console.log('Options:', options);
    }
    let submissions: { model: string, hash: string }[] = []
    for (let i = 0; i < submit.length; i++) {
        let s = submit[i];
        let a: string[] = s.split(':')
        if (a.length != 2) {
            console.log("Invalid submission: ", a.join(':'))
            program.outputHelp()
            return;
        }
        submissions.push({model: a[0], hash: a[1]})
    }
    if (submissions.length == 0) {
        console.log(`Please provide at least 1 valid submission.`);
        return;
    }
    await new Submitter({account, username, password, submissions, headless, debug, executable}).submit()
})();
import puppeteer, {Browser, Page} from "puppeteer";

export class Submitter {
    account: string;
    username: string;
    password: string;
    submissions: { model: string, hash: string }[];
    headless: boolean;
    debug: string;
    executable: string;
    browser: Browser;
    page: Page;

    rewardDismissed: boolean;

    constructor(init: Partial<Submitter>) {
        Object.assign(this, init);
    }

    async submit() {
        try {
            await this.initialize();
            while (true) {
                await this.validateAuthentication();
                for (let i = 0; i < this.submissions.length; i++) {
                    await this.submitModel(this.submissions[i])
                }
                await this.wait(10000)
            }
        } catch (e) {
            console.log(`Cannot start puppeteer with error`, e)
        }
    }

    private async initialize() {
        this.browser = await puppeteer.launch({
            defaultViewport: null,
            args: [
                `--no-zygote`,
                `--single-process`,
                `--no-sandbox`,
                `--disable-setuid-sandbox`,
                '--ignore-certificate-errors',
                '--enable-features=NetworkService',
                '--no-gpu',
                `--window-size=1280,720`
            ],
            executablePath: this.executable,
            headless: this.headless,
            ignoreHTTPSErrors: true
        });
        this.page = await this.browser.pages().then(p => p[0]);
    }

    private async validateAuthentication() {
        try {
            await this.page.goto(`https://console.aws.amazon.com/console/home?region=us-east-1`, {waitUntil: 'networkidle2'});
            this.logDebug('Loaded ', `https://console.aws.amazon.com/console/home?region=us-east-1`);
            if (!await this.page.$(`div.home-content`)) {
                console.log('User is not logged in. Performing authentication')
                await this.page.goto(`https://${this.account}.signin.aws.amazon.com/console`, {waitUntil: 'networkidle2'});
                await this.page.$eval('#account', el => (el as any).value = '');
                await this.page.$('#account').then(e => e.type(this.account, {delay: 50}))
                await this.page.$('#username').then(e => e.type(this.username, {delay: 50}))
                await this.page.$('#password').then(e => e.type(this.password, {delay: 50}))
                await this.page.$('#signin_button').then(e => e.click())
                this.logDebug('Clicked on sign in button.');
                await this.wait(5000);
                if (!await this.page.$(`div.home-content`)) {
                    console.log(`Cannot login. Invalid username or password.`)
                    process.exit(1);
                }
                console.log(`Logged in.`)
            }
        } catch (e) {
            console.log(`Cannot login. Wrong account Id.`)
            this.logDebug(`Failed to login to account ${this.account} and username ${this.username}`, e);
            process.exit(1);
        }
    }

    private wait(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    private logDebug(message: string, ...args: any[]) {
        if (this.debug) console.log(message, ...args)
    }

    private async submitModel({model, hash}: { model: string; hash: string }) {
        try {
            let url = `https://console.aws.amazon.com/deepracer/home?region=us-east-1#${hash}`
            this.logDebug(`Loaded ${url}`)
            if (!this.rewardDismissed) {
                try {
                    await this.page.goto('https://us-east-1.console.aws.amazon.com/deepracer/home?region=us-east-1#racerProfile', {waitUntil: 'networkidle2'});
                    await this.page.waitForSelector('awsui-button.awsui-modal-dismiss-control', {timeout: 300000}).then(e => e.click())
                    this.logDebug(`Dismissed reward modal`);
                } catch (e) {
                    console.log(`Cannot dismiss reward modal. Maybe it is already dismissed.`,e)
                } finally {
                    this.rewardDismissed = true;
                }
            }
            await this.page.goto(url, {waitUntil: 'networkidle2'});
            await this.page.waitForSelector(`div.submitModelButton awsui-button`, {timeout: 300000}).then(e => e.click());
            this.logDebug(`Clicked Race button`)
            await this.page.waitForSelector('awsui-select', {timeout: 5000}).then(e => e.click())
            this.logDebug(`Expanded select`)
            await this.page.waitForSelector(`div[title=${model}]`).then(e => e.click())
            this.logDebug(`Selected ${model}`)
            await this.wait(1000)
            await this.page.waitForSelector(`button.awsui-button-variant-primary`).then(e => e.click())
            this.logDebug(`Submitted ${model}`)
            await this.wait(1000)
            console.log(`Submitted ${model} to ${hash}`);
        } catch (e) {
            console.log(`Skipped submission of ${model} due to model not found or evaluation in progress`)
            this.logDebug(`Failed to submit ${model}`, e);
        }
        await this.wait(5000);
    }
}
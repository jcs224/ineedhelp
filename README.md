# I Need Help

## About

I Need Help is a web app that helps connect people that can't communicate with social media or texting a way to get help if they need it. In particular, elderly people or others who only have landlines or voice-only phones.

## Setup

### Requirements

- [Node](https://nodejs.org/en/) (8.0 or greater)
- [Yarn](https://yarnpkg.com/)
- A Twilio account — [Sign up](https://www.twilio.com/try-twilio)

Here are the Twilio values you'll need:

| Config&nbsp;Value | Description                                                                                                                                                  |
| :---------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Account&nbsp;Sid  | Your primary Twilio account identifier - find this [in the Console](https://www.twilio.com/console).                                                         |
| Auth&nbsp;Token   | Used to authenticate - [just like the above, you'll find this here](https://www.twilio.com/console).                                                         |
| Two Phone&nbsp;numbers | Two Twilio phone numbers in [E.164 format](https://en.wikipedia.org/wiki/E.164) - you can [get them here](https://www.twilio.com/console/phone-numbers/incoming) |
| Proxy service | [Create a new proxy service](https://www.twilio.com/console/proxy) and take note of the SID

After you've created the proxy service, take one of those phone numbers and [add one of your newly-purchased phone numbers to it](https://www.twilio.com/docs/proxy/quickstart?code-sample=code-add-a-phone-number).

### Local development

#### Clone this repo
```
git clone https://github.com/jcs224/ineedhelp.git
cd ineedhelp
```

#### Install dependencies
```
yarn install
```

#### Change values in `.env` file

- `TWILIO_ACCOUNT_SID`: Your Twilio project's SID
- `TWILIO_AUTH_TOKEN`: Your Twilio project's auth token
- `TWILIO_PROXY_SERVICE_SID`: The proxy service SID
- `NUMBER_TO_CALL_ACTUAL`: The `E.164` representation of the phone number **not** used for the proxy service
- `NUMBER_TO_CALL_DISPLAY`: A human-friendly representation of **NUMBER_TO_CALL_ACTUAL**. This will be what is displayed on the site for people to call.


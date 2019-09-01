## Currencies rate bot
Subscribe [to telegram bot](https://t.me/DailyCurrencyRatesBot) 
to receive daily ruble rate report at 9 AM.

Example:
```json
{
  "USD": {
    "latest": 66.71,
    "minimum": 65.98,
    "maximum": 66.85
  },
  "EUR": {
    "latest": 73.45,
    "minimum": 72.63,
    "maximum": 73.96
  },
  "CZK": {
    "latest": 2.83,
    "minimum": 2.78,
    "maximum": 2.85
  }
}
```

## How it works
### Data
Every hour server requests rate from https://openexchangerates.org/.  
### Report
Every day at 9 AM server send currencies rate report 
to them who sent subscribe command to bot.
### Cache
Subscribers and currencies rates stored in local cache file under `.cache` folder.
### Tokens
To make requests server uses tokens 
to `openexchangerates` as `RATES_TOKEN` environment variable 
and to `telegram` as `TELEGRAM_TOKEN` environment variable.

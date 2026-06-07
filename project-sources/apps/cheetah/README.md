# Cheetah / Leo Ledger

Cheetah is a local-first personal finance prototype. The product interface is named Leo Ledger and runs entirely in the browser.

## Features

- Transaction, transfer, and account tracking
- Editable multi-level categories
- Monthly budgets and savings goals
- Planned and recurring payments
- Income allocation and projected balance
- Spending, cash-flow, and trend insights
- JSON backup/restore and CSV export
- Local browser persistence with no account or server

## Source

- `index.html` contains the standalone shell and visual system.
- `LeoLedger.jsx` is the editable React source.
- `LeoLedger.js` is the browser-ready compiled bundle.
- `tests/` contains the original smoke-test utilities.

Run `npm run sync:static` from the portfolio root after changing the deployable files.

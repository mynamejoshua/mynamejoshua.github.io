# Frontend:
the frontend has three main sections.  
- authentication pages
- account managment pages
- action pages (deposit, withdraw, transfer) 
## Authentication Pages
the *landing*, *registration*, and *sign in* pages
- **landing:** where the user first goes
    - sign in
    - register
- **sign in:** where the user can sign in
- **register:** where the user can register
## Acount Managment Pages
the actual account management. 
- **home:** displays account balances, links to where the user can choose what actions to do on the selected account
    - deposit
    - withdraw
    - transfer
    - view account history
- **account history page:** displays the history of each transaction
## Action Pages
the pages where actions are handled
- **deposit page:** deposit money into previously selected account (session variables?)
- **withdraw page:** withdraw money from previously selected account (allow negative balance?)
- **transfer page:** select an account to draw from, and an account to transfer to. input a number to transfer. validation is done on backend 


# Backend: 
the backend is broke into two sections, *gets* and *posts*
## Gets: 
- `/returningUser` checks session if user is logged in
- `/allBalances` all account balances (for home page)
- `/logout` logs user out
- `/history` gets the account history

## Posts:
- `/register` 
``` js
{
    username: <req.body.userName>,
    salt: <req.body.userName>,
    passwordhash: sha256(req.body.password + salt),
}
```

- `/deposit` I wonder if passing the account name is unnesisary if we use session variables to keep track of the currently selected account?
```js
{
    moneytoadd: <number>,
    account: <account_name>
}
// log transaction in history
``` 
- `/withdraw` handle overdraft?
```js
{
    moneytoremove: <number>,
    account: <account_name>
}
// log transaction in history
``` 
- `/transfer` validate that the source has enough to move
```js
{
    moneytomove: <number>,
    accountsource: <account_name>,
    accountdest: <account_name>
}
// log transaction in history
```

## Database:
Users
- username (string)
- salt (string)
- password hash (string)
- account 1 balance (long)
- account 2 balance (long)
- account 3 balance (long)
- history (string list) [maybe a different database?]
- history ([timestamp, action(withdraw, deposit, transfer), value changed, new balance])

Sessions
- auto

# Issues
- How do we do mongo? how do we authroize all of our ip's?
- How do we host on github? who owns the project? how do we all have access to the project?

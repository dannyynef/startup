# CS 260 Notes

This file represents what I have learned about web programming.

- [My startup](https://startup.cs260.click)
- [My simon](https://simon.cs260.click)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## AWS
I love web programming
Interesting things I have learned about AWS

## HTML

Interesting things I have learned about HTML

## React

Interesting things I have learned about React

## MongoDB connection

- The backend loads its Atlas credentials from `service/dbConfig.json`, which is ignored by Git.
- The `connect4` database keeps startup data separate from Simon data in the same Atlas cluster.
- The backend connects and pings MongoDB before accepting HTTP requests. A failed connection stops startup without logging credentials.
- Account and statistics storage will be moved to MongoDB in the following steps.

## MongoDB registration

- Registration checks the MongoDB `user` collection for an existing email and saves new accounts with BCrypt password hashes, profile fields, and initial statistics.
- Emails are trimmed and lowercased. A unique email index prevents duplicate accounts, including simultaneous registration attempts.
- Login and sessions still use the temporary in-memory array until the next step. Registered accounts are saved in MongoDB, but logging in after a restart will work once database authentication is added.

## MongoDB authentication

- Login now reads saved accounts from MongoDB and verifies BCrypt password hashes. Email normalization matches registration.
- Registration and login save a new UUID token in MongoDB before sending the secure, HTTP-only cookie. Session checks and protected endpoints retrieve the account by that token.
- The in-memory user array is removed. Accounts and authentication tokens can now be retrieved after a backend restart.
- Logout removes the stored token and clears the cookie. This was moved forward from the logout step so that switching token lookups to MongoDB does not leave logged-out tokens valid.
- Profile edits and game statistics still need their database writes in the later steps.

## MongoDB logout verification

- Run `npm run test:integration` from `service` to test logout against the Atlas database configured in `dbConfig.json`.
- The test starts a separate backend on an available port and creates a temporary account. It checks that logout removes the token from MongoDB, clears the cookie, and makes the old token fail on session and statistics endpoints.
- Repeated logout succeeds, and a fresh login creates a different token that can access protected endpoints. The old token remains invalid.
- The integration test passed against Atlas. It removes its temporary account and stops its backend afterward.

## MongoDB player profiles

- Username edits now update the authenticated account in MongoDB before the server confirms the change. The client cannot choose another account by sending an email.
- Username validation still requires 1 to 40 characters after trimming. The database update changes only `displayName`, preserving credentials and statistics.
- The Atlas integration check now verifies the saved username directly in MongoDB, through a fresh profile request, and after logging out and logging back in. It also checks invalid and unauthenticated edits.

## MongoDB game statistics

- Game results now update the authenticated user's statistics in MongoDB. Wins increment the win streak; losses and draws reset it to zero.
- Each result uses one atomic `findOneAndUpdate` operation with `$inc` and, when needed, `$set`. Concurrent submissions cannot overwrite each other's counters.
- The endpoint returns the saved statistics, and profile statistics are read from the authenticated MongoDB account. Client-supplied emails cannot choose which account gets updated.
- The Atlas integration test checks all three outcomes, win streaks, invalid and unauthenticated submissions, ten simultaneous wins, and statistics after a fresh login.

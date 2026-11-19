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

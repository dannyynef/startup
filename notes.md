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

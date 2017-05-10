Key/Value with Etag and If-None-Match
=====================================

[See assignment](https://gist.github.com/jgorset/64b9c525a2f6ed2373a12fc22570054d)

Install and Run
-------------

* clone this repo
* run `npm install` to install deps
* run `make` or `node app.js` (if you're on Windows)

Questions
---------

* is it ok that Etag in my case doesn't follow the format described in the assignment?

* should I validate incoming JSON (during POST request)? All fields are required there
but currently I have no validation at all.

* should I implement key/value storage by my own or I can use third party lib?
Currently I use [LokiJS](https://github.com/techfort/LokiJS) to store data. It just supports some
queries similar to SQL's where. But it should be pretty easy to change.

* what if POST request is going to create `key` and `value` that are already exist.
I think it's ok to override key in this case but what if value is the same? Should I override in this case?
Currently new `Etag` is generated for each override. But value isn't changed so it will be strange (from client standpoint)
to get value that client already know about.

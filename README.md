# TextSync Example Server

This project aims to demonstrate how to implement a
[TextSync](https://pusher.com/textsync) authorization endpoint using the
[textsync-server-node](https://github.com/pusher/textsync-server-node) library.

## Some Assembly Required
**BEFORE you run this project** you'll need an `instanceLocator` and `key` for
TextSync.

## Deploy to Heroku

You'll need to insert your `instanceLocator` and `key` when deploying your app.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/pusher/textsync-server-node-example)

## Run It Locally

Make a copy of the `.env.example` file.

```
cp .env.example .env
```

Add your `instanceLocator` and `key` to the newly created `.env` file.

When you have a `.env` file containing a valid `INSTANCE_LOCATOR` and `KEY`
you're ready to run.

```
yarn
yarn start
```

That's it. You can test everything works by sending a `POST` request to
`http://localhost:3030/textsync/tokens`

```
curl -X POST http://localhost:3030/textsync/tokens
```



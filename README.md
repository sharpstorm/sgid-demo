## SGID Demo

This is a simple demo of the [SGID](https://id.gov.sg/) login flow.

## Setup

You will need your own SGID credentials. Create a new application on the SGID developer portal with the callback URL as `http://localhost:3000/callback`.

Fill in the `.env.sample` file with the credentials from the SGID developer portal and rename it to `.env`.

You may optionally set `PORT` in the `.env` file to change the port the server. Do note that this also changes the callback URL configured on the developer portal.

## Run

To start the server in watch mode: `npm run dev`
To start the server without watch: `npm run start`

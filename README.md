# boardgame-record

## How to Run

(PostgreSQL setting is required)

In the root directory, type

- `$ npm i`

and

- `$ npm run dev`
  to run in dev mode or,

- `$ npm run build`
- `$ npm run start`
  in production mode. (This require another preparation)

## commit convention

`@-###: [brief explanation]`

- `@`: commit scope (frontend: 'f', backend: 'b', entire project: 'e', etc.)
- `###`: representing word (add, init, del, mod, etc.)

## Database Migration

First, you should modify /backend/src/config/typeorm.config.ts.
Fill empty spaces properly with your .env file.
Then, in /backend directory, run

- `$ npm run migration:run`

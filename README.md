<img alt="Scion. History lives on the server. Clients fetch only what they need." src="docs/images/banner-dark.svg" width="100%">

# Scion, small

A small, runnable copy of the source control design Anthropic describes in
[Redesigning source control](https://www.anthropic.com/engineering/redesigning-source-control).

Git gives every clone the whole repository. Scion turns that around: history
lives on a server, clients are always online, and a checkout fetches only the
folders and files it asks for. File contents are stored once, by hash, and
never change, so any cache anywhere can serve them.

This is a learning project. It is not a git replacement and is not affiliated
with Anthropic.

---

## Contents

- [How it works](#how-it-works)
- [What a changeset is](#what-a-changeset-is)
- [What happens on commit](#what-happens-on-commit)
- [What happens on checkout](#what-happens-on-checkout)
- [How folder listings are made](#how-folder-listings-are-made)
- [Two commits racing for one branch](#two-commits-racing-for-one-branch)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Using scion](#using-scion)
- [Settings](#settings)
- [Server routes](#server-routes)
- [Tests](#tests)
- [Limits](#limits)

---

## How it works

There are two paths through the system.

- **Control plane**, in grey: commits, branches, history and diffs go straight
  to the server.
- **Object plane**, in orange: folder listings and file contents go through
  caches first. Each layer asks the next one only when it misses.

<img alt="Scion architecture: clients send commits, branches, history and diffs straight to scion-server. Trees and blobs come from the local disk, then scion-cache, then scion-server, which alone reads and writes Supabase Postgres and MinIO." src="docs/images/architecture.svg" width="100%">

| Part | Runs | Job |
|---|---|---|
| `scion` | on your machine | checks out, finds changes, commits |
| local disk | on your machine | keeps every blob it has seen, shared by every checkout |
| `scion-cache` | one per region | keeps trees and blobs in memory, reports its hit rate |
| `scion-server` | central | the only part that reads or writes Postgres and MinIO |
| Supabase Postgres | central | changesets, file changes, branches, saved folder listings |
| MinIO | central | compressed file contents, named by their SHA-256 |

---

## What a changeset is

A git commit points at a snapshot of every file. A Scion changeset only lists
**what changed against its parent**. The contents live in MinIO; the database
keeps only hashes.

<img alt="A changeset row in Postgres holds its id, author, date, message, parent and the files it changed with their blob hashes. A branch points at it. The server derives folder listings. Blob hashes point at compressed contents in MinIO." src="docs/images/changeset-shape.svg" width="100%">

- `changesets`, `file_changes`, `branches` and `trees` are Postgres tables.
- Blobs are objects in MinIO, not rows in a table.
- `trees` is never written by a client. The server works it out and saves it.

---

## What happens on commit

Commits are made **on the server**. The client uploads the changed files,
asks for a changeset, then asks to move the branch.

<img alt="The client hashes files, uploads changed blobs, creates a changeset on the server in one transaction, then moves the branch by compare and swap, which answers moved or conflict." src="docs/images/commit-flow.svg" width="100%">

---

## What happens on checkout

A checkout walks folders from the top and only goes into the ones you asked
for. Every blob is checked against its hash before it is written.

<img alt="The client asks the server where main points, gets folder listings from the cache, which asks the server on a miss, then gets each blob from local disk or the cache and checks its hash." src="docs/images/checkout-flow.svg" width="100%">

---

## How folder listings are made

A folder listing at a changeset never changes, so the server works it out
once and saves it.

<img alt="A request for a folder checks the trees table first. If the listing is saved it is returned. If not, the server walks parents back, replays file changes oldest first, keeps what sits directly inside the folder, saves it and returns it." src="docs/images/folder-listing.svg" width="100%">

---

## Two commits racing for one branch

Moving a branch is a single compare and swap on one row. There is no lock.
Whoever arrives second is told the branch moved.

<img alt="Agent A moves main from c1 to a2 and succeeds. Agent B then tries to move main from c1 to b2 and gets a conflict, because main is now at a2." src="docs/images/branch-race.svg" width="100%">

---

## Tech stack

| Tool | Used for |
|---|---|
| [TypeScript](https://www.typescriptlang.org/) on Node 22+ | everything, run with [tsx](https://tsx.is/) |
| [Fastify](https://fastify.dev/) | the server and the cache |
| [Supabase](https://supabase.com/) Postgres | changesets, file changes, branches, saved trees |
| [postgres](https://github.com/porsager/postgres) | talking to Postgres with real transactions |
| [MinIO](https://min.io/) | S3 compatible storage for file contents |
| [AWS SDK for S3](https://github.com/aws/aws-sdk-js-v3) | talking to MinIO, or real S3 later |
| [lru-cache](https://github.com/isaacs/node-lru-cache) | the cache's memory, limited by size in bytes |
| [commander](https://github.com/tj/commander.js) | the `scion` command |
| [Vitest](https://vitest.dev/) | tests |

---

## Getting started

You need **Node 22 or newer** and **Docker Desktop**. The Supabase CLI comes
with `npm install`.

```bash
npm install
cp .env.example .env

npm run storage:start
npm run database:start
npm run database:reset

npm run server
npm run cache

npm link
```

`storage:start` runs MinIO. `database:start` runs Supabase in Docker and
`database:reset` creates the four tables. Run `server` and `cache` in their
own terminals. `npm link` puts `scion` on your path.

To use a hosted Supabase project instead, set `DATABASE_URL` in `.env` to its
direct connection string and run `npx supabase db push`.

---

## Using scion

Start a branch in an empty folder and commit to it:

```bash
mkdir first && cd first
scion new main
echo "hello" > README.md
scion commit -m "add the readme"
scion log
```

Check it out somewhere else, all of it or only some folders:

```bash
mkdir second && cd second
scion checkout main
scion checkout main src docs
scion status
```

| Command | What it does |
|---|---|
| `scion new <branch>` | start a branch here; it is created on the first commit |
| `scion checkout <branch> [paths...]` | download the branch, only the folders named |
| `scion status` | list files changed since checkout |
| `scion commit -m <message>` | upload changed files and land them on the branch |
| `scion log [-n 20]` | show history from the checked out changeset |
| `scion diff <from> <to>` | list files that differ between two changesets |

---

## Settings

Every setting has a default that works with the local setup above.

| Variable | Default | Meaning |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` | Supabase Postgres |
| `STORAGE_ENDPOINT` | `http://127.0.0.1:9000` | MinIO |
| `STORAGE_ACCESS_KEY` | `minioadmin` | MinIO user |
| `STORAGE_SECRET_KEY` | `minioadmin` | MinIO password |
| `STORAGE_BUCKET` | `scion-blobs` | bucket, made on server start if missing |
| `LISTEN_HOST` | `127.0.0.1` | where the server and cache listen |
| `SERVER_PORT` | `4000` | server port |
| `CACHE_PORT` | `4001` | cache port |
| `SERVER_URL` | `http://127.0.0.1:4000` | where the cache and client find the server |
| `CACHE_URL` | `http://127.0.0.1:4001` | where the client finds the cache |
| `CACHE_SIZE_IN_BYTES` | `536870912` | cache memory limit, 512 MB |
| `OBJECT_FOLDER` | `~/.scion/objects` | the client's blob store on disk |
| `SCION_AUTHOR` | your user name | author written on commits |

---

## Server routes

| Method | Route | Returns |
|---|---|---|
| `POST` | `/blobs` | `{ blobHash }` for an `application/octet-stream` body |
| `GET` | `/blobs/:blobHash` | the file contents |
| `POST` | `/changesets` | the new changeset |
| `GET` | `/changesets/:changesetId` | one changeset with its file changes |
| `GET` | `/changesets/:changesetId/history?limit=20` | that changeset and its parents |
| `GET` | `/changesets/:changesetId/tree?path=src` | what sits directly inside a folder |
| `GET` | `/diffs/:from/:to` | files added, removed or modified |
| `GET` | `/branches/:branchName` | where a branch points |
| `POST` | `/branches/:branchName/move` | `{ result: "moved" }` or `{ result: "conflict" }` |

The cache answers `GET /blobs/:blobHash` and `GET /changesets/:id/tree` the
same way, plus `GET /statistics` for its hit rate.

---

## Tests

```bash
npm run check
npm test
```

`check` type-checks everything. `test` runs the unit tests for hashing,
compression, path safety, changeset ids, history replay, folder listings and
diffs.

---

## Limits

- The first listing of a changeset replays its whole history. Later ones are
  a single row.
- When a branch has moved, the client stops and says so. The real Scion
  rebases on the server.
- There are no accounts or permissions yet, so everything listens on
  `127.0.0.1` by default.
- The client keeps blobs on disk but asks the cache for folder listings every
  time.

The next steps are listed in [PLAN.md](PLAN.md#next).

# Scion, small

A small copy of the source control system Anthropic describes in
"Redesigning source control". Clients stay online and fetch only what they
need. The server owns history. File contents are stored once, by hash, and
never change, so any cache can serve them.

## The parts

    client ──control plane──────────────► server ──► Postgres (Supabase)
       │                                    ▲         changesets, file changes,
       │ object plane                       │ misses  branches, trees
       ▼                                    │
    local disk ──misses──► cache ───────────┘    ──► MinIO
    (per machine)          (per region)              file contents by hash

| Part     | Where                | Job                                             |
|----------|----------------------|-------------------------------------------------|
| server   | `src/server/`        | the only part that touches Postgres and MinIO   |
| cache    | `src/cache/`         | trees and blobs in memory, asks server on a miss |
| client   | `src/client/`        | the `scion` command                              |
| storage  | MinIO                | compressed blobs at `blobs/<first two>/<hash>`   |
| database | Supabase Postgres    | `changesets`, `file_changes`, `branches`, `trees` |

## The data

A changeset lists only the files it changed against its parent. A full folder
listing is worked out by replaying history and saved in `trees`, so the second
request for the same folder is a single row.

A branch moves with compare and swap: it only moves if it still points where
the client last saw it.

## Running it

    npm install
    cp .env.example .env
    npm run storage:start
    npm run database:start
    npm run database:reset
    npm run server
    npm run cache
    npm link

Then in any empty folder:

    scion new main
    echo hello > README.md
    scion commit -m "add the readme"
    scion log

And in another folder:

    scion checkout main
    scion checkout main src

## Steps

1. Setup and the database tables
2. Types
3. Configuration and the database connection
4. Blobs
5. Changesets and branches
6. Trees and diffs
7. Server
8. Cache
9. Client
10. Tests

## Next

- Work out a changeset's files from its parent's files, not the whole history
- Rebase on the server when a branch moved, instead of asking the client
- Keep trees on the client's disk as well as blobs
- Check that a branch move only goes forward through history
- Per folder permissions
- Import an existing git history

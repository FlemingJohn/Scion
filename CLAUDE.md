# How the code gets written

Rules for this project. They are about shape and naming, not about what the
project does. Anything specific to the work itself belongs in `PLAN.md`.

---

## How to write it

**Small files.** One job each. If a file does two things, it is two files.

**No large blocks.** A function that runs past about thirty lines is doing too
much and wants splitting. A file past about two hundred lines is the same
problem, larger.

**No comments. None.** Not above a function, not at the end of a line, not to
mark a section, not to explain a decision. If a line needs explaining, the
names are wrong. Fix the names instead. The only exception is a line a language
or tool demands at the top of a file.

**The flow has to be readable.** Someone should be able to open a file, read it
top to bottom, and follow what happens without jumping around. Put the main
path first and the helpers below it.

**Reuse before writing.** Check the existing pieces before making a new one.
Two buttons that look the same should be one button.

---

## Naming

Plain words that say what the thing does. No cleverness, no poetry, no
shorthand.

    good                          bad
    ─────────────────────────────────────────────────────
    getItemById                   fetchTheThing
    getTotal                      whatItAllComesTo
    startRequest                  beginTheJourney
    canEdit                       permissionAllows
    itemCount                     howManyThings
    isReady                       allSystemsGo
    hasFinished                   theEndHasCome

Verbs for things that do. `get`, `set`, `make`, `start`, `end`, `draw`,
`update`, `handle`.

`is` or `has` or `can` for things that answer yes or no. `isReady`,
`hasLoaded`, `canEdit`.

Nouns for things that are. `item`, `total`, `status`, `results`.

No abbreviations. `randomness` not `rnd`. `probability` not `prob`. `value`
not `val`. `configuration` not `config`. `button` not `btn`. The one exception
is names the outside world already uses, like `id` or `url`.

Never name something after what it looks like. `bars.ts` and `boxes.ts` tell
you nothing. Name it for what it holds or does.

---

## One thing per file

This is the rule the rest of the structure hangs off. Every type, every
interface, every component, every hook is alone in its own file, and the file
is named after it.

    src/types/Item.ts             one interface
    src/types/ItemStatus.ts       one type
    src/types/RequestState.ts     one type
    src/components/ItemCard.tsx   one component
    src/components/StatusChip.tsx one component
    src/hooks/useItems.ts         one hook
    src/hooks/useSelection.ts     one hook

Never two interfaces in a file. Never a type sitting beside the component that
uses it. Never a folder-wide `types.ts` holding a pile of them. If a file
declares two things, it is two files.

The file name matches the thing exactly, in the same case the thing uses.
`Item.ts` exports `Item`. `useItems.ts` exports `useItems`.

---

## Where things go

    src/types/        one type or interface per file
    src/components/   one component per file
    src/hooks/        one hook per file
    src/styles/       colours, type, layout
    src/lib/          logic with no screen attached

Beyond those, make a folder per area of the work and name it for the area.
A folder should say what part of the product lives in it, and the same
one-thing-per-file rule applies inside it.

**Styles are shared.** Colours, spacing and type come from the tokens in
`src/styles/theme.css`. Never write a colour by hand in a component. If a
colour is not in the tokens, it does not belong in the product.

---

## Git

**One file per commit.** If a change touches four files, that is four commits.

**Subject line only.** No body, no description, no footer, no trailing lines of
any kind.

**Never add a co-author line, a session link, or a "generated with" note.**

Start with the kind of change, then a plain verb:

    feat: add the item type
    feat: draw the status chip
    fix: correct the rounding
    fix: stop the total going negative
    style: move colours to tokens
    refactor: split the list builder
    docs: write the plan
    chore: add folders

Kinds: `feat`, `fix`, `style`, `refactor`, `docs`, `test`, `chore`.

Plain verbs after the colon. `add`, `draw`, `fix`, `move`, `split`, `remove`,
`rename`, `write`. Lower case, no full stop.

---

## What the code should feel like

Open a folder and you should see the steps of that part of the work, in order,
each one readable on its own.

Open a screen and you should see what it shows and what happens when you press
things. Nothing else.

If you cannot tell what a file does from its name and its first ten lines,
it needs breaking up.

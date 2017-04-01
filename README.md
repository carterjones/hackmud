# ｈａｃｋｍｕｄ

In this repository I put some scripts I developed for the game hackmud.
Maybe they are useful maybe not, you are free to test, change or fork.

## Diretories

### include

Here are some functions that are useful in a lot of scripts.
To make them reusable they are separated into extra files.
I tried to use some prefixes to do extra grouping.

Prefix | Meaning
--- | ---
fmt_ | formatting of values or objects, useful for displaying
nfo_ | get additional info for a value (e.g. level of script)

### tools

Scripts that beautifies your game experience.

Name | Usage
--- | ---
access_log.js | parses your access log and displays it slightly different
bank_statement.js | parses your transactions and displays a bank statement
call.js | calls the given scriptor with the given arguments and displays some additional info
market_browse.js | parses the available upgrades on the market and displays the cheapest item ob each type and rarity
qr_decode.js | decodes a QR code

### hacking

Scripts for hacking usage, e.g. lockpicks, locscraping.

### poc

Proof of concepts, here are some special tools that are not really useful but
to test some functions.

### example

Some examples like `hello_world` and a mockup for a lib

## Usage

```bash
$ npm install
$ npm run-script build
```

This builds, lints and shrinks the scripts and place the results in `release` directory.
You can copy the file directly to your scripts folder.
Depending on your operating system this is `%APPDATA%\hackmud\<username>\scripts\` (Windows) or `$HOME/.config/hackmud/<username>/scripts/` (Linux & Mac).
The upload them with `#up <scriptname>`.

### Static build

```bash
$ npm run-script build -- static
```

This includes all library functions, no lib is generated.

### Dynamic build

```bash
$ npm run-script build -- dynamic --user=<username> [--lib=<include> --lib=<include> ...]
```

This generates a lib with the defined includes, wich is used by the other generated scripts.

## Todo

* Automatically determine include per library (create library)
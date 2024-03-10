# Depot
Manage modpacks with Strapi. Depot is made for use with [my fork of SKCraft Launcher](https://github.com/Dasfaust/Launcher).

## Features
- Automatic package listing generation
- Easy content management. No more juggling JSON files around!
- Per-instance icon support
- Per-instance server status reporting
- Per-instance news page generation with Discord integration
- Per-instance pre-release support

## Planned
- One click deployment with Modpack Creator
- Integration with GitHub releases

## How it works
Depot consists of 2 individual projects: a Strapi project and plugin, and the Depot News API. Everything resides in seperate Docker containers.

Strapi manages all of the content for the launcher and Depot News. The Launcher plugin will take an instance's .json file and generate the appropriate package listing. It hosts launcher JARs, but the actual modpack files reside in a ./repo folder that you can serve with a web server of your choice.

Depot News is a Discord.js bot; it grabs instance descriptions from Strapi and latest posts from a configured Discord channel and serves it in HTML for the launcher.

A web server will container tie everything together under one domain name. There is an example config file for NGINX [here](depot.conf).

To keep the protocol compatible with the mainline SKCraft Launcher, extra features are placed behind an additional protocol version request.

## Installation, usage, and setup
I will create a guide at a later date!
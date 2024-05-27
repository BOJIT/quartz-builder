#!/usr/bin/env node

// Thin wrapper around quartz CLI to provide some customisations

/*
 * DEPRECATED Commands
 * - update: quartz updates are handled by pointing at a newer docker image from Docker Hub
 * - create: a single markdown file is a valid vault here! Managing updates is a bit overkill
 * - restore: We may not have full repo access from within the Docker volume. Cannot stash/pop
 */

import fs from "fs"
import path from "path"
import process from "process"
import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import {
  handleBuild,
  handleSync,
} from "../quartz/cli/handlers.js"
import { BuildArgv, SyncArgv } from "../quartz/cli/args.js"
import { version } from "../quartz/cli/constants.js"


function watchConfigFile(f) {
    if(!fs.existsSync(f)) return null

    // Copy initial config over base path
    fs.cpSync(f, path.join(process.cwd(), path.basename(f)))

    // Set up a file-watcher for future changes
    return fs.watch(f, (eventType, filename) => {
        console.log("Config file changed! ", f)
        if(eventType === "change")
            fs.cpSync(f, path.join(process.cwd(), path.basename(f)))
    })
}

yargs(hideBin(process.argv))
  .scriptName("quartz-builder")
  .version(version)
  .usage("$0 <cmd> [args]")
  .command("sync", "Sync your Quartz to and from GitHub.", SyncArgv, async (argv) => {
    // NOTE this will only still work if your "/in" volume includes the .git directory
    await handleSync(argv)
  })
  .command("build", "Build Quartz into a bundle of static HTML files", BuildArgv, async (argv) => {
    // If config files exist in `.obsidian/quartz`, use them instead!
    let watchers = []
    watchers.push(watchConfigFile("/in/.obsidian/quartz/quartz.config.ts"))
    watchers.push(watchConfigFile("/in/.obsidian/quartz/quartz.layout.ts"))

    await handleBuild(argv)

    // Copy build artefacts to /out. Quartz may sometimes override the existing symlink
    fs.cpSync(path.join(process.cwd(), "public"), "/out", {recursive: true})

    // Stop file watchers on termination
    watchers.forEach((w) => w?.close())
  })
  .showHelpOnFail(false)
  .help()
  .strict()
  .demandCommand().argv

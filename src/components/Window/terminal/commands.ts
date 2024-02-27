import { Command } from "./command-prompt";
import { FakeUnix } from "./fakeunix";

export const globalCommandsArray: Command[] = [
    {
        commandName: "ls",
        possibleArguments: [],
        execute: (system: FakeUnix, args: any | null) => {
            const dirs = argsToAbsolutePath(args, system)
            return system.getFileSystem().getContentOfPath(dirs).join(" ");
        }
    },
    {
        commandName: "cd",
        possibleArguments: [],
        execute: (system: FakeUnix, args: any | null) => {
            const dirs = argsToAbsolutePath(args, system)
            const dir = system.getFileSystem().getDirectoryFromArray(dirs)
            system.getFileSystem().setCurrentDirectory(dir)
            return dirs.join("/")
        }
    },
    {
        commandName: "whoami",
        possibleArguments: [],
        execute: (system: FakeUnix, args: any | null) => {
            return system.getCurrentUser();
        }
    },
    {
        commandName: "pwd",
        possibleArguments: [],
        execute: (system: FakeUnix, args: any | null) => {
            return "/" + system
                .getFileSystem()
                .getCurrentDirectory()
                .join("/")
        }
    },
    {
        commandName: "echo",
        possibleArguments: [],
        execute: (system: FakeUnix, args: any | null) => {
            return args.join(" ")
        }
    },
    {
        commandName: "date",
        possibleArguments: [],
        execute: (system: FakeUnix, args: any | null) => {
            return new Date().toISOString().slice(0, -5)
        }
    },

    {
        commandName: "help",
        possibleArguments: [],
        execute: (system: FakeUnix, args: any | null) => {
            let commands = ""

            system.getCommands().forEach((_, key) => {
                commands += key + " "
            })

            return commands.split(" ").sort().join(" ").trim()
        }
    }

]



function argsToAbsolutePath(args: any | null, system: FakeUnix): string[] {
    const currentdir = system.getFileSystem().getCurrentDirectory();
    if (args[0]) {
        let dirs = (args[0].split("/") as string[]);
        let start = dirs.shift();

        //check of . and ..
        if (start == ".") {
            dirs = currentdir.concat(dirs)
        } else if (start == "..") {
            currentdir.pop()

            //Edgecase for ../ where it would be ["dir", ""]
            if (dirs[0]) {
                dirs = currentdir.concat(dirs)
            } else {
                dirs = currentdir
            }
        }

        return dirs
    }

    return currentdir

}

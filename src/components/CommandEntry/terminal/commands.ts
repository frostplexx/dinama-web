import { Command, CommmandResponse } from "./command-prompt";
import { FakeUnix } from "./fakeunix";

export const globalCommandsArray: Command[] = [
    {
        commandName: "ls",
        possibleArguments: [],
        execute: (system: FakeUnix, args: any | null) => {
            const dirs = argsToAbsolutePath(args, system)
            return {
                result: system.getFileSystem().getContentOfPath(dirs).join(" "),
                position: system.getFileSystem().getCurrentDirectory().join("/"),
            } as CommmandResponse
        }
    },
    {
        commandName: "cd",
        possibleArguments: [],
        execute: (system: FakeUnix, args: any | null) => {
            const dirs = argsToAbsolutePath(args, system)
            const dir = system.getFileSystem().getDirectoryFromArray(dirs)
            system.getFileSystem().setCurrentDirectory(dir)
            return {
                result: null,
                position: dirs.join("/")
            }
        }
    },
    {
        commandName: "whoami",
        possibleArguments: [],
        execute: (system: FakeUnix, args: any | null) => {
            return {
                result: system.getCurrentUser(),
                position: system.getFileSystem().getCurrentDirectory().join("/")
            }
        }
    },
    {
        commandName: "pwd",
        possibleArguments: [],
        execute: (system: FakeUnix, args: any | null) => {
            const path = system.getFileSystem().getCurrentDirectory().join("/")
            return {
                result: "/" + path,
                position: path
            }
        }
    },
    {
        commandName: "echo",
        possibleArguments: [],
        execute: (system: FakeUnix, args: any | null) => {
            return {
                result: args.join(" "),
                position: system.getFileSystem().getCurrentDirectory().join("/")
            }
        }
    },
    {
        commandName: "date",
        possibleArguments: [],
        execute: (system: FakeUnix, args: any | null) => {
            return {
                result: new Date().toISOString().slice(0, -5),
                position: system.getFileSystem().getCurrentDirectory().join("/")
            }
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

            return {
                result: commands.split(" ").sort().join(" ").trim(),
                position: system.getFileSystem().getCurrentDirectory().join("/")
            }
        }
    },
<<<<<<<< HEAD:src/terminal/commands.ts
========
    {
        commandName: "cat",
        possibleArguments: [],
        execute: (system: FakeUnix, args: any | null) => {
            const path = argsToAbsolutePath(args, system)
            const lastEl = path.pop()
            const dir = system.getFileSystem().getDirectoryFromArray(path)
            try {
                const file = dir.filesMap.get(lastEl)
                return file.content
            } catch {
                return "could not find file on system"
            }
        }
    }
>>>>>>>> refactor:src/components/CommandEntry/terminal/commands.ts

]



function argsToAbsolutePath(args: any | null, system: FakeUnix): string[] {
    const currentdir = system.getFileSystem().getCurrentDirectory();
    if (args[0]) {
        let dirs = (args[0].split("/") as string[]);
        let start = dirs.shift();

        if (dirs.length == 0) {
            currentdir.push(args[0] as string)
            return currentdir
        }

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

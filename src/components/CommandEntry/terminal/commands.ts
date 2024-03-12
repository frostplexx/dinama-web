import { randomInt } from "crypto";
import { Command } from "./command-prompt";
import { FakeUnix } from "./fakeunix";
import os from 'os';

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
        commandName: "mkdir",
        possibleArguments: [],
        execute: (system: FakeUnix, args: any | null) => {
            const dirs = argsToAbsolutePath(args, system)
            console.log(dirs)
            const newfolder = dirs.pop()
            const dir = system.getFileSystem().getDirectoryFromArray(dirs)
            if (dir) {
                dir.addDirectory(newfolder as string)
                system.saveState()
            }
            return ""
        }
    },
    {
        commandName: "touch",
        possibleArguments: [],
        execute: (system: FakeUnix, args: any | null) => {
            const dirs = argsToAbsolutePath(args, system)
            const newfile = dirs.pop()
            const dir = system.getFileSystem().getDirectoryFromArray(dirs)
            if (dir) {
                dir.addFile(newfile as string, "")
                system.saveState()
            }
            return ""
        }
    },
    {
        commandName: "rm",
        possibleArguments: [],
        execute: (system: FakeUnix, args: any | null) => {
            if (args[0] == "-rf" && args[1] == "/") {
                return "I'm sorry Dave, I'm afraid I can't do that."
            }
            const dirs = argsToAbsolutePath(args, system)
            const lastEl = dirs.pop()
            const dir = system.getFileSystem().getDirectoryFromArray(dirs)
            if (dir) {
                dir.removeFile(lastEl as string)
                system.saveState()
            }
            return ""
        }
    },
    {
        commandName: "rmdir",
        possibleArguments: [],
        execute: (system: FakeUnix, args: any | null) => {
            const dirs = argsToAbsolutePath(args, system)
            const lastEl = dirs.pop()
            const dir = system.getFileSystem().getDirectoryFromArray(dirs)
            if (dir) {
                dir.removeDirectory(lastEl as string)
                system.saveState()
            }
            return ""
        }
    },
    {
        commandName: "cd",
        possibleArguments: [],
        execute: (system: FakeUnix, args: any | null) => {
            const dirs = argsToAbsolutePath(args, system)
            const dir = system.getFileSystem().getDirectoryFromArray(dirs)
            if (dir) {
                system.getFileSystem().setCurrentDirectory(dir)
                system.saveState()
            }
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

            console.log(args)

            if (args.join(" ").includes(">")) {
                const text = args.join(" ").split(">")[0].trim().replaceAll("\"", "")
                const target = args.join(" ").split(">")[1].trim()
                const dirs_array = argsToAbsolutePath([target], system)
                const lastEl = dirs_array.pop()
                const dir = system.getFileSystem().getDirectoryFromArray(dirs_array)
                if (!dir) {
                    return "could not find directory in system"
                }

                const file = dir?.filesMap.get(lastEl as string)

                if (file) {
                    file.content = text
                    system.saveState()
                    return ""
                } else {
                    const new_file = dir.addFile(lastEl as string, text)
                    if (new_file) {
                        new_file.content = text
                    } else {
                        return "could not create file"
                    }
                    system.saveState()
                }

                console.log(file)


            } else {
                if (args[0] == "$RANDOM") {
                    return randomInt(0, 1000).toString()
                }

                if (args[0] == "$USER") {
                    return system.getCurrentUser()
                }

                if (args[0] == "$HOME") {
                    return "/" + system
                        .getFileSystem()
                        .getCurrentDirectory()
                        .join("/")
                }

                if (args[0] == "$PWD") {
                    return "/" + system
                        .getFileSystem()
                        .getCurrentDirectory()
                        .join("/")
                }

                if (args[0] == "$HOSTNAME") {
                    return os.hostname()
                }
            }


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
    },
    {
        commandName: "cat",
        possibleArguments: [],
        execute: (system: FakeUnix, args: any | null) => {
            const path = argsToAbsolutePath(args, system)
            const lastEl = path.pop()
            const dir = system.getFileSystem().getDirectoryFromArray(path)
            try {
                if (dir && lastEl) {
                    const file = dir.filesMap.get(lastEl)
                    if (file) return file.content
                } else {
                    return "could not find directory in system"
                }
            } catch {
                return "could not find file on system"
            }
        }
    },
    {
        commandName: "neofetch",
        possibleArguments: [],
        execute: (system: FakeUnix, args: any | null) => {
            return `daniel@portfolio
---------------
OS: ${os.type()}
Host: ${os.hostname()}
Uptime: ${secondsToString(os.uptime() == 0 ? (Math.random() * 10000).toFixed(0) : os.uptime())}
CPU: ${os.cpus()[0] == undefined ? "Intel 8086" : os.cpus()[0].model}
`

        }
    },
]


function secondsToString(seconds) {
    var numyears = Math.floor(seconds / 31536000);
    var numdays = Math.floor((seconds % 31536000) / 86400);
    var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
    return numyears + " years " + numdays + " days " + numhours + " hours " + numminutes + " minutes " + numseconds + " seconds";

}



function argsToAbsolutePath(args: any | null, system: FakeUnix): string[] {
    try {

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
    } catch {
        return []
    }

}

import { FakeUnix } from "./fakeunix";
import { FakeDirectory, FakeFileSystem } from "./filesystem";


export const fakeUnix = FakeUnix.Instance("daniel", loadDefaultFilesystem())

interface ParseResponse {
    response: string;
    location: string;
}

<<<<<<<< HEAD:src/terminal/command-prompt.ts
export function parseCommand(commandString: string): CommmandResponse {
========
export function parseCommand(commandString: string): ParseResponse {
>>>>>>>> refactor:src/components/CommandEntry/terminal/command-prompt.ts
    let tokens = commandString.split(" ");
    let commandName = tokens[0];
    let args = tokens.slice(1); // Capture any arguments passed to the command

    const command = fakeUnix.getCommands().get(commandName)
    var commandResponse = ""
    if (command) {
<<<<<<<< HEAD:src/terminal/command-prompt.ts
        return command.execute(fakeUnix, args)
========
        commandResponse = command.execute(fakeUnix, args)
        // console.log(command.execute(fakeUnix, args))
>>>>>>>> refactor:src/components/CommandEntry/terminal/command-prompt.ts
    } else {
        return {
            result: "command not found: " + commandName,
            position: fakeUnix.getFileSystem().getCurrentDirectory().join("/")
        } as CommmandResponse
    }
<<<<<<<< HEAD:src/terminal/command-prompt.ts
========
    console.log(fakeUnix.getFileSystem().getCurrentDirectory().join("/"))
    return {
        response: commandResponse,
        location: fakeUnix.getFileSystem().getCurrentDirectory().join("/")
    }
>>>>>>>> refactor:src/components/CommandEntry/terminal/command-prompt.ts
}

function loadDefaultFilesystem(): FakeFileSystem {

    var dev = new FakeDirectory("dev");
    var home = new FakeDirectory("home");
    var media = new FakeDirectory("media");
    var opt = new FakeDirectory("opt");
    var root = new FakeDirectory("root");
    var sys = new FakeDirectory("sys");
    var usr = new FakeDirectory("usr");
    var etc = new FakeDirectory("etc");
    var lib = new FakeDirectory("lib");
    var mnt = new FakeDirectory("mnt");
    var proc = new FakeDirectory("proc");
    var run = new FakeDirectory("run");
    var tmp = new FakeDirectory("tmp");
    var var_dir = new FakeDirectory("var")
    var bin = new FakeDirectory("bin")


    return new FakeFileSystem([dev, home, media, opt, root, sys, usr, etc, lib, mnt, proc, run, tmp, var_dir, bin], "daniel")
}

export interface Command {
    commandName: string;
    possibleArguments: string[];
<<<<<<<< HEAD:src/terminal/command-prompt.ts
    execute: (system: FakeUnix, args: any | null) => CommmandResponse;
========
    execute: (system: FakeUnix, args: any | null) => string;
>>>>>>>> refactor:src/components/CommandEntry/terminal/command-prompt.ts
}

export interface CommmandResponse {
    result: string | null;
    position: string;
}

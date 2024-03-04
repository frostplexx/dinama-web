import { FakeUnix } from "./fakeunix";
import { FakeDirectory, FakeFileSystem } from "./filesystem";


export const fakeUnix = FakeUnix.Instance("daniel", loadDefaultFilesystem())

interface ParseResponse {
    response: string;
    location: string;
}

export function parseCommand(commandString: string): ParseResponse {
    let tokens = commandString.split(" ");
    let commandName = tokens[0];
    let args = tokens.slice(1); // Capture any arguments passed to the command

    const command = fakeUnix.getCommands().get(commandName)
    var commandResponse = ""
    if (command) {
        commandResponse = command.execute(fakeUnix, args)
        // console.log(command.execute(fakeUnix, args))
    } else {
        console.log("command not found: " + commandName)
    }
    console.log(fakeUnix.getFileSystem().getCurrentDirectory().join("/"))
    return {
        response: commandResponse,
        location: fakeUnix.getFileSystem().getCurrentDirectory().join("/")
    }
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
    execute: (system: FakeUnix, args: any | null) => string;
}


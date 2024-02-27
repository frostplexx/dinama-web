import { FakeUnix } from "./fakeunix";
import { FakeDirectory, FakeFileSystem } from "./filesystem";


export const fakeUnix = FakeUnix.Instance("daniel", loadDefaultFilesystem())


export function parseCommand(commandString: string): CommmandResponse {
    let tokens = commandString.split(" ");
    let commandName = tokens[0];
    let args = tokens.slice(1); // Capture any arguments passed to the command

    console.log(commandName)
    const command = fakeUnix.getCommands().get(commandName)
    if (command) {
        return command.execute(fakeUnix, args)
    } else {
        return {
            result: "command not found: " + commandName,
            position: fakeUnix.getFileSystem().getCurrentDirectory().join("/")
        } as CommmandResponse
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


    return new FakeFileSystem([dev, home, media, opt, root, sys, usr, etc, lib, mnt, proc, run, tmp, var_dir, bin])
}

export interface Command {
    commandName: string;
    possibleArguments: string[];
    execute: (system: FakeUnix, args: any | null) => CommmandResponse;
}

export interface CommmandResponse {
    result: string | null;
    position: string;
}

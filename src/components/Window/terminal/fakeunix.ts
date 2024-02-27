import { Command } from "./command-prompt"
import { globalCommandsArray } from "./commands"
import { FakeFileSystem } from "./filesystem"

export class FakeUnix {
    private filesystem: FakeFileSystem
    private currentUser: string
    private commands: Map<string, Command>
    private static _instance: FakeUnix


    constructor(currentUser: string, fileSystem: FakeFileSystem) {
        this.currentUser = currentUser
        this.filesystem = fileSystem
        this.commands = this.loadCommands()
    }

    public static Instance(currentUser: string, fileSystem: FakeFileSystem) {
        return this._instance || (this._instance = new this(currentUser, fileSystem))
    }


    private loadCommands(): Map<string, Command> {
        const commandsMap = new Map<string, Command>();
        globalCommandsArray.forEach(command => {
            commandsMap.set(command.commandName, command);
        });
        return commandsMap;
    }


    public getFileSystem(): FakeFileSystem {
        return this.filesystem
    }

    public getCommands(): Map<string, Command> {
        return this.commands;
    }

    public getCurrentUser(): string {
        return this.currentUser
    }

}

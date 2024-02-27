import { Command } from "../command-prompt";
import { FakeUnix } from "../filesystem";

class Command_ls extends Command {
    constructor(system: FakeUnix) {
        super("ls", [""], system)
    }

    execute() {
        console.log(this.system.getFileSystem().getCurrentDirectory())
    }

}

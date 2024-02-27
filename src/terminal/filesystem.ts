export class FakeFileSystem {
    private directories: Map<string, FakeDirectory>;
    private currentDirectory: FakeDirectory;

    constructor(initialDirectories: FakeDirectory[]) {
        this.directories = new Map();
        initialDirectories.forEach(dir => this.directories.set(dir.name, dir));
        let userdir = FakeFileSystem.quickInitDirTree(["home", "daniel"], this.directories);

        // Initialize user directory and all the files that already exist in there
        userdir.appendFile(new FakeFile("hello.txt", "Hello there! Welcome to my website..."));
        userdir.appendChild(new FakeDirectory("projects"));
        let socials = new FakeDirectory("socials");
        socials.appendFile(new FakeFile("GitHub", "https://github.com/Frostplexx"));
        socials.appendFile(new FakeFile("me@dinama.dev", "mailto:me@dinama.dev"));
        socials.appendFile(new FakeFile("Frostplexx.discord", "Frostplexx.discord"));
        userdir.appendChild(socials);
        this.currentDirectory = userdir;
    }

    getDirectoryFromArray(path: string[]): FakeDirectory | null {
        if (path.length === 0) return this.currentDirectory;
        let currentDir: FakeDirectory | null = null;

        if (this.directories.has(path[0])) {
            currentDir = this.directories.get(path[0])!;
            for (let i = 1; i < path.length && currentDir != null; i++) {
                currentDir = currentDir.children.get(path[i]) || null;
            }
        }

        return currentDir;
    }

    getContentOfPath(path: string[]): string[] {

        //Edgecase: your at / and do ls, then the path is empty -> make it an array with empty string so the next if runs
        if (path.length < 1) {
            path.push("")
        }

        // Check if the path is "/" and return all root directory names
        if (path.length === 1 && path[0] === '') {
            return Array.from(this.directories.keys()).map(name => name + "/");
        }


        let dir = this.getDirectoryFromArray(path);
        if (!dir) return [];

        let contentNames = Array.from(dir.children.keys()).map(name => name + "/");
        contentNames.push(...dir.filesArray.map(file => file.name));
        return contentNames;
    }


    getCurrentDirectory(): string[] {
        let hierarchy: string[] = [];
        let currentDir: FakeDirectory | null = this.currentDirectory;

        while (currentDir != null) {
            hierarchy.unshift(currentDir.name);
            currentDir = currentDir.parentDirectory;
        }

        return hierarchy;
    }

    setCurrentDirectory(dir: FakeDirectory) {
        this.currentDirectory = dir;
    }

    static quickInitDirTree(dirNames: string[], directories: Map<string, FakeDirectory>): FakeDirectory {
        let currentDir: FakeDirectory | null = null;

        dirNames.forEach((dirName, index) => {
            let newDir: FakeDirectory;
            if (directories.has(dirName)) {
                newDir = directories.get(dirName)!;
            } else {
                newDir = new FakeDirectory(dirName);
                directories.set(dirName, newDir);
            }

            if (index > 0 && currentDir) {
                currentDir.appendChild(newDir);
            }

            currentDir = newDir;
        });

        if (!currentDir) {
            throw new Error("No directories provided");
        }

        return currentDir;
    }
}

export class FakeDirectory {
    name: string;
    parentDirectory: FakeDirectory | null = null;
    children: Map<string, FakeDirectory>;
    filesArray: FakeFile[];

    constructor(directoryName: string) {
        this.name = directoryName;
        this.children = new Map();
        this.filesArray = [];
    }

    appendFile(file: FakeFile) {
        this.filesArray.push(file);
    }

    appendChild(child: FakeDirectory) {
        child.parentDirectory = this;
        this.children.set(child.name, child);
    }

    getFiles(): FakeFile[] {
        return this.filesArray;
    }
}

export class FakeFile {
    name: string;
    content: string;

    constructor(name: string, content: string) {
        this.name = name;
        this.content = content;
    }
}

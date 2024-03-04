export class FakeFileSystem {
    private directories: Map<string, FakeDirectory>;
    private currentDirectory: FakeDirectory;

    constructor(initialDirectories: FakeDirectory[], currentUser: string) {
        this.directories = new Map();
        initialDirectories.forEach(dir => this.directories.set(dir.name, dir));

        const homedir = this.directories.get("home")
        let userdir = new FakeDirectory(currentUser)
        homedir.appendChild(userdir)

        // Initialize user directory and all the files that already exist in there
        userdir.appendFile(new FakeFile("hello.txt", " Hello there! Welcome to my website where I showcase some of my projects and fun ideas. Browse through the files to discover more about my work. If you have any questions or just want to chat, feel free to reach out. Enjoy your time here! "));
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
            const tmp = Array.from(this.directories.keys()).map(name => name + "/");
            return tmp
        }


        let dir = this.getDirectoryFromArray(path);
        if (!dir) return [];

        // Assuming dir.filesMap exists and maps string keys to FakeFile objects
        let contentNames = Array.from(dir.children.keys()).map(name => name + "/");
        contentNames.push(...Array.from(dir.filesMap.values()).map(file => file.name));
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

}

export class FakeDirectory {
    name: string;
    parentDirectory: FakeDirectory | null = null;
    children: Map<string, FakeDirectory>;
    filesMap: Map<string, FakeFile>;

    constructor(directoryName: string) {
        this.name = directoryName;
        this.children = new Map();
        this.filesMap = new Map();
    }

    appendFile(file: FakeFile) {
        this.filesMap.set(file.name, file);
    }

    appendChild(child: FakeDirectory) {
        child.parentDirectory = this;
        this.children.set(child.name, child);
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

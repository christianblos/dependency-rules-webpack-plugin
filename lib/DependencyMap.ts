export type Dependencies = Set<string>;

export class DependencyMap {
    private map: Map<string, Dependencies> = new Map();

    public add(moduleName: string, dependency: string): void {
        if (!this.map.has(moduleName)) {
            this.map.set(moduleName, new Set<string>());
        }

        this.map.get(moduleName)!.add(dependency);
    }

    toMap(): Map<string, Dependencies> {
        return this.map;
    }
}

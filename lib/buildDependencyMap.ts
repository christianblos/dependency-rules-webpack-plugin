import {DependencyMap} from './DependencyMap';

interface ModuleStats {
    name: string;
    modules: ModuleStats[];
    reasons: Reason[];
    issuerPath: ModuleStats[];
}

interface Reason {
    moduleName: string;
}

interface Issuer {
    name: string;
}

function processStats(map: DependencyMap, moduleStats: ModuleStats): DependencyMap {
    const moduleName: string        = moduleStats.name;
    const subModules: ModuleStats[] = moduleStats.modules;
    const reasons: Reason[]         = moduleStats.reasons;
    const issuerPath: Issuer[]      = moduleStats.issuerPath;

    if (issuerPath) {
        let parentName: string = '';

        issuerPath.forEach((issuer: Issuer) => {
            if (parentName) {
                map.add(parentName, issuer.name);
            }

            parentName = issuer.name;
        });

        map.add(parentName, moduleName);
    }

    if (reasons) {
        reasons.forEach((reason: Reason) => {
            if (reason.moduleName && !reason.moduleName.match(/\+ [0-9]+ modules$/)) {
                map.add(reason.moduleName, moduleName);
            }
        });
    }

    if (subModules) {
        subModules.forEach((subModule: ModuleStats) => {
            map = processStats(map, subModule);
        });
    }

    return map;
}

export function buildDependencyMap(moduleStats: any): DependencyMap {
    let map: DependencyMap = new DependencyMap();

    processStats(map, moduleStats as ModuleStats);

    return map;
}
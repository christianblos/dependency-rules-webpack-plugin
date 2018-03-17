import * as webpack from 'webpack';
import {buildDependencyMap} from './buildDependencyMap';
import {Dependencies, DependencyMap} from './DependencyMap';

type Compiler = webpack.compiler.Compiler;
type Compilation = webpack.compilation.Compilation;
type Match = string | RegExp;

interface Rule {
    module: Match,
    deny: Match[],
}

interface Options {
    rules: Rule[],
}

class CheckDependencyRulesPlugin {

    private rules: Rule[] = [];

    constructor(options?: Options) {
        this.rules = options && options.rules ? options.rules : [];
    }

    apply(compiler: Compiler) {
        compiler.hooks.emit.tap('CheckDependencyRulesPlugin', (compilation: Compilation) => {
            let stats: any         = compilation.getStats().toJson();
            let map: DependencyMap = buildDependencyMap(stats);

            let errorMsg: string  = 'dependencies!\nThere are imports which are not allowed by your settings:\n';
            let hasError: boolean = false;

            map.toMap().forEach((dependencies: Dependencies, moduleName: string) => {
                const invalidDeps: string[] = this.getInvalidModuleDependencies(moduleName, dependencies);

                invalidDeps.forEach((dep: string) => {
                    hasError = true;
                    errorMsg += `  ├─ ${moduleName} → ${dep}\n`;
                });

            });

            if (hasError) {
                compilation.errors.push(new Error(errorMsg));
            }
        });
    }

    private getInvalidModuleDependencies(moduleName: string, dependencies: Dependencies): string[] {
        let invalidDeps: string[] = [];

        for (const rule of this.rules) {
            if (rule.deny && moduleName.match(rule.module)) {
                invalidDeps.push(...this.getInvalidRuleDependencies(rule, dependencies));
            }
        }

        return invalidDeps;
    }

    private getInvalidRuleDependencies(rule: Rule, dependencies: Dependencies): string[] {
        let invalidDeps: string[] = [];

        dependencies.forEach((dependency: string) => {
            for (const deny of rule.deny) {
                if (dependency.match(deny)) {
                    invalidDeps.push(dependency);
                    return;
                }
            }
        });

        return invalidDeps;
    }
}

module.exports = CheckDependencyRulesPlugin;
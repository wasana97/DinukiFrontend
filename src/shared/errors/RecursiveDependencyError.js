// @flow
export default class RecursiveDependencyError extends Error {
    constructor(service: string) {
        super(`Service "${service}" has recursive dependencies`);
    }
}

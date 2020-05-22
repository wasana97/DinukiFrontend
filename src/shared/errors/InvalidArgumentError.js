// @flow
export default class InvalidArgumentError extends Error {
    constructor(argumentName: string) {
        super(`Argument "${argumentName}" is incorrect`);
    }
}

// @flow
export default class UndefinedArgumentError extends Error {
    constructor(argumentName: string) {
        super(`Argument "${argumentName}" should be defined`);
    }
}

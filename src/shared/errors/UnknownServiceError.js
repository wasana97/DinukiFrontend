// @flow
export default class UnknownServiceError extends Error {
    constructor(serviceName: string) {
        super(`Service "${serviceName}" is not registered, cannot instantiate it`);
    }
}

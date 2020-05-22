// @flow
export default class ServiceCreationError extends Error {
    constructor(service: string) {
        super(`The factory of ${service} didn't return anything`);
    }
}

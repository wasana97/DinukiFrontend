// @flow
import type { ApplicationState } from "store/reducers";

export const isAuthenticated = (state: ApplicationState) => {
  return state.auth.isAuthenticated;
};

export const isUserInitiated = (state: ApplicationState) => {
  return state.auth.isUserInitiated;
};

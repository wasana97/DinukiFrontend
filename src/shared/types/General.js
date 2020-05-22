// @flow
import { ASYNC_STATUS } from "constants/async";

export type AsyncStatusType =
  | typeof ASYNC_STATUS.INIT
  | typeof ASYNC_STATUS.LOADING
  | typeof ASYNC_STATUS.SUCCESS
  | typeof ASYNC_STATUS.FAILURE;

export type NotificationType = null | {
  message: string,
  // eslint-disable-next-line flowtype/space-after-type-colon
  type:
    | null
    | typeof Alert.TYPE.ERROR
    | typeof Alert.TYPE.SUCCESS
    | typeof Alert.TYPE.INFO
};

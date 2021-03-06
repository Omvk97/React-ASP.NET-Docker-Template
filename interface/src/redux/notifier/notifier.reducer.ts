import { ENQUEUE_SNACKBAR, CLOSE_SNACKBAR, REMOVE_SNACKBAR } from "./notifier.types";
import { INotifier } from "../../types/redux/reducerStates.types";

const INITIAL_STATE: INotifier = {
  activeNotifications: [],
};

export default (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case ENQUEUE_SNACKBAR:
      return {
        ...state,
        activeNotifications: [
          ...state.activeNotifications,
          {
            key: action.key,
            ...action.notification,
          },
        ],
      };

    case CLOSE_SNACKBAR:
      return {
        ...state,
        activeNotifications: state.activeNotifications.map((notification) =>
          action.dismissAll || notification.key === action.key ? { ...notification, dismissed: true } : { ...notification }
        ),
      };

    case REMOVE_SNACKBAR:
      return {
        ...state,
        activeNotifications: state.activeNotifications.filter((notification) => notification.key !== action.key),
      };

    default:
      return state;
  }
};

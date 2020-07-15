import { Action } from "redux";

export interface IUI {
  headerTitle: string;
}

export interface INotifier {
  activeNotifications: any[];
}

export interface IRootState {
  ui: IUI;
  notifications: INotifier;
}

export interface ReducerAction extends Action {
  type: string;
  payload: any;
}

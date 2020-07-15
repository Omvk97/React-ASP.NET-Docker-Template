import { combineReducers } from "redux";

import notificationsReducer from "./notifier/notifier.reducer";
import uiReducer from "./ui/ui.reducer";

const rootReducer = combineReducers({
  notifications: notificationsReducer,
  ui: uiReducer,
});

export default rootReducer;

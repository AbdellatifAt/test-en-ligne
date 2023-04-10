import { combineReducers } from "redux";

import UserReducer from "./user/user.reducer";
import NotificationReducer from "./notification/notification.reducer";

const routeReducer = combineReducers({
   user: UserReducer,
   notification: NotificationReducer
})

export default routeReducer;

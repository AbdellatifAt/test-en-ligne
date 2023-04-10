const INITIAL_STATE = {
   active: false,
   message: "",
   type: "",
   time: 0,
};

const NotificationReducer = (state = INITIAL_STATE, action) => {
   switch (action.type) {
      case "SET_NOTIFICATION_ON":
         return {
            active: true,
            message: action.payload.message,
            type: action.payload.type,
            time: action.payload.time,
         };
      case "SET_NOTIFICATION_OFF":
         return {
            active: false,
            message: "",
            type: "",
            time: 0,
         };
      default:
         return state;
   }
};

export default NotificationReducer;

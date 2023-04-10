const INITIAL_STATE = {
   userInfos: null,
   type: "",
};

const UserReducer = (state = INITIAL_STATE, action) => {
   switch (action.type) {
      case "SET_USER":
         return {
            ...state,
            userInfos: action.payload.userInfos,
            type: action.payload.type,
         };
      default:
         return state;
   }
};

export default UserReducer;
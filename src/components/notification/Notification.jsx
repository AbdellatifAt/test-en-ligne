import React from "react";
import "./Notification.css";

function Notification({ message, className, type }) {
   return (
      <div
         className={`notification__container ${className && className} ${
            type ? type : "default"
         }`}
      >
         <div className="icon">
            {/* <i className="text-4xl fas fa-check"></i> */}
            <i className="text-4xl far fa-bell"></i>
         </div>
         <div>
            <h1></h1>
            <p className="notification__message">{message}</p>
         </div>
      </div>
   );
}

export default Notification;

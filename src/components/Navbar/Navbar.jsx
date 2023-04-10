import React from "react";
import {Link ,useHistory  } from "react-router-dom";
import './Navbar.css';
import { API_URL } from "../../ApI/api";

import { setUser } from "../../redux/user/user.actions";

import { useDispatch } from "react-redux";

import logo from '../../assets/logo.png'

const Navbar = ({Links}) => {

  const dispatch = useDispatch()

  const history = useHistory();

  const logaout = async()=>{

    const idSession = localStorage.getItem("idSession");

    if (idSession) {
       const formData = new FormData();
       formData.append("idSession", idSession);
       fetch(API_URL + "/logOut.php", {
          method: "POST",
          body: formData,
       })
          .then((res) => res.json())
          .then((data) => {
             localStorage.removeItem("idSession");
          });
    }

    dispatch(setUser({ currentUser: null, type: "" }));

  }
  const ActiveNave = (e)=>{
     const links = Array.from(document.querySelectorAll('.links_act'));
     console.log(links);

     links.forEach(ele => {
          ele.classList.remove('active')
      
     });
     console.log("target");
     console.log(e.target);
     e.target.classList.add('active')

  }
   
    return (  
       <nav  className="nav-contain">
          <div className="nav-div">
            <div className="logo">
              <img src={logo} alt="logo" />
            </div>
          <div className="links">
            {Links.map((Element , i) =>{
              if(i === 0 ){
                    return <Link className="links_act active" to={Element.link} key={i} onClick={ActiveNave}>{Element.nom} </Link>
              }else{
                return <Link className="links_act" to={Element.link} key={i} onClick={ActiveNave}>{Element.nom} </Link>
              }
              
            })}
          </div>
          </div>
          <div className="logout">
            <button className="log-out-btn-nav" onClick={logaout}><i className="fas fa-sign-out-alt"></i></button>
          </div>
       </nav>
    );
}
 
export default Navbar;
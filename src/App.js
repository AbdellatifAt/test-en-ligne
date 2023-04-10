import './App.css';
import {Switch , Route } from 'react-router-dom';
import Admin from './components/admin/Admin';
import AuthAdmin from './components/admin/AuthAdmin';
import { Redirect } from 'react-router-dom';
import Enseignant from './components/Enseignant/Enseignant';
import Etudiant from './components/Etudiant/Etudiant';
import Notification from './components/notification/Notification';
import { setNotificationOff } from './redux/notification/notification.actions';

import { useEffect } from 'react';

import { useSelector, useDispatch } from "react-redux";

import LoginPage from './components/loginPage/LoginPage';

import { API_URL } from './ApI/api';

import { setUser } from './redux/user/user.actions';



function App() {

  const dispatch = useDispatch();

  const notification = useSelector((state) => state.notification);

  useEffect(() => {
     if (notification.active) {
        setTimeout(() => {
           dispatch(setNotificationOff());
        }, notification.time);
     }
  }, [notification]);

  useEffect(() => {

    const idSession = localStorage.getItem("idSession");

    if (idSession) {
       const formData = new FormData();
       formData.append("idSession", idSession);
       fetch(API_URL + "/isAuth.php", {
          method: "POST",
          body: formData,
       })
          .then((res) => {
             if (res.status === 200) {
                return res.json();
             } else {
                throw new Error();
             }
          })
          .then((data) => {
             dispatch(setUser(data));
          })
          .catch((err) => {
             console.log(err);
          });
    }


  }, [])

  const user = useSelector(state => state.user);

  console.log(user);

  //localStorage.setItem('user', JSON.stringify({id:888}))

  // const user = JSON.parse( localStorage.getItem('user'))

  // localStorage.removeItem
  // console.log(user);

  return (
         
        <div className="App">
              <Notification
                message={notification.message}
                type={notification.type}
                className={notification.active && "active"}
              />
              <Switch>
              
                <Route
                  exact
                  path="/"
                  render={() => {
                    if (user.userInfos) {
                        if (user.type === "admin") {
                          return <Redirect to="/admin" />;
                        } else if (user.type === "enseignant") {
                          return <Redirect to="/enseignant" />;
                        } else if (user.type === "etudiant") {
                          return <Redirect to="/etudiant" />;
                        } 
                    } else {
                        return <Redirect to="/auth" />;
                    }
                  }}
                />

                <Route 
                  exact 
                  path={'/auth'} 
                  render={() => {
                    if (user.userInfos) {
                       return <Redirect to="/"/>;
                    } else {
                       return <LoginPage />;
                    }
                 }}
                />

                <Route 
                  path={'/enseignant'} 
                  render={() => {
                    if (user.userInfos) {
                      if (user.type === "enseignant") {
                        return <Enseignant />;
                      } else {
                        return <Redirect to="/" />
                      } 
                    } else {
                        return <Redirect to="/auth" />;
                    }
                  }}
                />
  
                <Route 
                  path={'/etudiant'} 
                  render={() => {
                    if (user.userInfos) {
                      if (user.type === "etudiant") {
                        return <Etudiant />;
                      } else {
                        return <Redirect to="/" />
                      } 
                    } else {
                      return <Redirect to="/auth" />;
                    }
                  }}
                />

                

                <Route path={'/admin'} component={Admin} />

            </Switch>
          
        </div>
    
    

  );
}

export default App;

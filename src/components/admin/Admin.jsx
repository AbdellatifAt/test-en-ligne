import Navbar from '../Navbar/Navbar';
import { Switch , Route } from 'react-router-dom';
import Home from './Home';
import Enseignant from './Enseignant';
import Etudiant from './Etudiant';
import Semestre from './Semestre';
import Module from './Module';
import SM_Modules from './SM_modules';
import Inscription from './Inscription';

import { useSelector } from 'react-redux';

import AuthAdmin from './AuthAdmin';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';

function Admin() {

  const user = useSelector(state => state.user);

  const links=[
    {nom: 'Home' , link:"/Admin"} ,{nom: 'Enseignant' , link:"/Admin/Enseignant"},{nom: 'Etudiant' , link:"/Admin/Etudiant"},
    {nom: 'Semestre' , link:"/Admin/Semestre"},{nom: 'Module' , link:"/Admin/Module"} , 
    ,{nom: 'Inscription' , link:"/Admin/Inscription"}
  ];
  return (
    
      <>

      {
        user.userInfos ? <> 
          <div className="Admin">
            <Navbar Links={links} />
          </div>
          <div className='content'>

          
            <Switch>
              <Route 
                    path={'/admin'} exact
                    render={() => {
                      if (user.userInfos) {
                        if (user.type !== "admin") {
                          return <Redirect to="/" />
                        }
                        
                      }
                      return <Home />
                    }}
                  />
               
                <Route exact path="/Admin/Semestre" component={Semestre} /> 
                <Route exact path="/Admin/Module" component={Module} /> 
                <Route exact path='/Admin/Enseignant' component={Enseignant} />
                <Route exact path="/Admin/Etudiant" component={Etudiant} /> 
                <Route exact path="/Admin/SM_Module/:id" component={SM_Modules} />
                <Route exact path="/Admin/Inscription"  component={Inscription} />
            </Switch>
          </div>  
        </> : (
          <AuthAdmin />
        )
      }
    

       
      </>
    
   
    
  );
}

export default Admin ;

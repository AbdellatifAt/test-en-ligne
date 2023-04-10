import { Route ,Switch } from "react-router-dom";

import Navbar from "../Navbar/Navbar";
import Chapitre from "./Chapitre";
import Competition from "./competition";
import Etudiant from "./Etudiant";
import Home from "./Home";
import Module from "./Module";
import Problem from "./Problem";
import Profile from "./Profile";
import Test from "./Test";



const Enseignant = () => {
    const links=[
        {nom: 'Home' , link:"/Enseignant"} ,{nom: 'Module' , link:"/Enseignant/Module"},
        {nom: 'Competition' , link:"/Enseignant/Competition"},
         {nom: 'Profil' , link:"/Enseignant/Profil"}
      ];
    return ( 
            <div className="enseignant-content-ENS">
                 <Navbar Links={links} />
                 <div className="content_ENS">
                 <Switch>
                    <Route exact path='/Enseignant' component={Home} />
                    <Route exact path='/Enseignant/Module' component={Module} /> 
                    <Route exact path='/Enseignant/Etudiant/:id_module' component={Etudiant} /> 
                    <Route exact path='/Enseignant/Chapitre/:id_module' component={Chapitre} /> 
                    <Route exact path='/Enseignant/Module/Chapitre/test/:id_chap' component={Test} /> 
                    <Route exact path='/Enseignant/Competition' component={Competition} /> 
                    <Route exact path='/Enseignant/Competition/Problem/:id_comp' component={Problem} /> 
                    <Route exact path='/Enseignant/Profil' component={Profile} /> 
                    
                    
                </Switch>
                 </div>

            </div>
    );
}
 
export default Enseignant;
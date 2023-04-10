import { Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import Chapitre from "./Chapitre";
import Navbar from "../Navbar/Navbar";
import Home from "./Home";
import Module from "./Module";
import Test from "./Test";
import Profil from "./Profil";
import Competition from "./Competition";
import PasserCompetition from "./PasserCompetition";

const Etudiant = () => {
    const links=[
        {nom: 'Home' , link:"/Etudiant"} ,
        {nom: 'Competition' , link:"/Etudiant/Competition"},{nom: 'Profil' , link:"/Etudiant/Profil"}
      ];
    return ( 
            <div className="enseignant-content-ENS">
                 <Navbar Links={links} />
                 <div className="content_ENS">
                 <Switch>
                   
                     <Route exact path='/Etudiant' component={Home} />
                     <Route exact path='/Etudiant/module/:id_semester' component={Module} />
                     <Route exact path='/Etudiant/module/chapitre/:id_module' component={Chapitre} />
                     <Route exact path='/Etudiant/module/chapitre/Test/:id_chap'component={Test} />
                     <Route exact path='/Etudiant/Profil'component={Profil} />
                     <Route exact path='/Etudiant/Competition'component={Competition} />
                     <Route exact path='/Etudiant/Competition/PasserCompetition/:id_comp'component={PasserCompetition} />

                </Switch>
                 </div>

            </div>
    );
}
 
export default Etudiant;
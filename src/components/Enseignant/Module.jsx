import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../ApI/api";
import './module.css'
//  redaux
import { useSelector,useDispatch } from 'react-redux';
import { setUser } from '../../redux/user/user.actions';
// redux
const Module = () => {
 //redux
 const user = useSelector(state => state.user);
 const dispatch = useDispatch()
 //redux

    // Enseinant connecter
const cin = user.userInfos.id ; 
  // Enseinant connecter
const [module , setModule] = useState([]);
useEffect(()=>{
    fetch(API_URL+'/Enseignant/Module/AllModule.php?cin='+cin)
    .then(res=>{
        return res.json();
    })
    .then(data=>{
        console.log(data);
        setModule(data);
    })
    .catch(err=>{
        console.log(err);
    })
},[]);
    return ( 
        <div className="Module_content-ENS">

            <div className="modules-ens">
                {
                module.map((M , i)=>{
                    return <div className="Module_ENS" key={i}>
                            {M.nom_module}
                            <div className="btns_module_ens">
                                <button><Link to={`/Enseignant/Etudiant/`+M.id_module}>Etudiant</Link><span></span></button>
                                <button><Link to={`/Enseignant/Chapitre/`+M.id_module}>Chapitre</Link><span></span></button>
                            </div>
                            
                    </div>
                }) 
                }

            </div>
            
           
        </div>
     );
}
 
export default Module;
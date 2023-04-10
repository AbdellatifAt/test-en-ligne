import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { API_URL } from "../../ApI/api";
import './Home.css'
//  redaux
import { useSelector,useDispatch } from 'react-redux';
import { setUser } from '../../redux/user/user.actions';
// redux
const Module = () => {
     //redux
     const user = useSelector(state => state.user);
     const dispatch = useDispatch()
     //redux
    const cne = user.userInfos.id;
    const {id_semester} = useParams()
    const [module , setModule] = useState()

    useEffect(()=>{
        fetch( API_URL+'/Etudiant/Modules.php?id_semester='+id_semester +'&cne='+cne)
        .then(res=>{
            if(res.status === 200 ){
                return res.json()
            }
            else{
                return [] ;
            }
        })
        .then(data =>{
            console.log(data);
            setModule(data);
        })
        .catch(err=>{
            console.log(err);
        })

    },[])


    return ( 
       (module && 
        <div className="global_Content">
            <div className="parent_content">

            {
                module.map((M,i)=>{
                    return <div className="child_content module_child" key={i}><Link className="hover_home_module_etud" to={`/Etudiant/Module/chapitre/`+M.id_module}> {M.nom_module}</Link></div>
                })
            }

            </div>
        </div>
        )
     );
}
 
export default Module;

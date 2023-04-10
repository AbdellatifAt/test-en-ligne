import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../ApI/api";
import './Home.css'
//  redaux
import { useSelector,useDispatch } from 'react-redux';
import { setUser } from '../../redux/user/user.actions';
// redux
const Home = () => {
     //redux
     const user = useSelector(state => state.user);
     const dispatch = useDispatch()
     //redux
    const cne =user.userInfos.id;
    const [semester  ,setSemester ] = useState();

useEffect(()=>{
    fetch( API_URL+'/Etudiant/Semestre.php?cne='+cne)
    .then(res=>{
        if(res.status === 200 ){
            return res.json()
        }
        else{
            return [];
        }
    })
    .then(data =>{
        console.log(data);
        setSemester(data);
    })
    .catch(err=>{
        console.log(err);
    })
},[])

    return ( 
            
            (
                semester && 
            <div className="global_Content">
                <div className="parent_content">

                {
                    semester.map((S , i )=>{
                        return <div className="child_content module_child" key={i}><Link className="hover_home_module_etud" to={'/Etudiant/Module/'+S.id_semester}>  {S.nom}</Link></div>
                    })
                }
                </div>
           </div>
        )
     );
}
 
export default Home;
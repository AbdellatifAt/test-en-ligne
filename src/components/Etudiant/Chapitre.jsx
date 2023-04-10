import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom/";
import { API_URL } from "../../ApI/api";

const Chapitre = () => {
    const {id_module} = useParams()
    const [chapitre , setChapitre] = useState([]);
    useEffect(()=>{
        fetch( API_URL+'/Etudiant/Chapitres.php?id_module='+id_module)
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
            setChapitre(data);
        })
        .catch(err=>{
            console.log(err);
        })

    },[])


    return ( 
       (
        chapitre.length >0 && 
           <div  className="global_Content" >
               <div className="parent_content">

               {
                   chapitre.map((C,i)=>{
                       return <div  className="child_content module_child" key={i}><div> {C.nom_chap} </div> <div className="content_btn_pass_test"> <Link to={`/Etudiant/Module/chapitre/Test/`+C.id_chap}><button className="btn_passe_test"> lancer test</button> </Link></div></div>
                    })
                }
             </div>
         </div>
       )
     );
}
 
export default Chapitre;
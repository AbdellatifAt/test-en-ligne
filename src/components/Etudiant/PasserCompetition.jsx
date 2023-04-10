import { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { API_URL } from "../../ApI/api";
import './PasserCompetitiopn.css' ;


import { setNotificationOn } from "../../redux/notification/notification.actions";
//  redaux
import { useSelector,useDispatch } from 'react-redux';
import { setUser } from '../../redux/user/user.actions';
// redux
const PasserCompetition = () => {
 //redux
 const user = useSelector(state => state.user);
 const dispatch = useDispatch()
 //redux
    const {id_comp} = useParams();
    const [problems ,setProblems] = useState([]) ;
    const [opeation , setOpreration] = useState() ; 
    const history = useHistory();
    const cne = user.userInfos.id;
    useEffect(()=>{
        console.log(id_comp);
        fetch(API_URL+'/Etudiant/PasserCompetition.php?id_comp='+id_comp+'&cne='+cne)
        .then(res=>{
            if(res.status === 200)
                return res.json();
            else 
                return [];
        })
        .then(data=>{
            console.log(data);  
            setProblems(data)
        })
        .catch(err=>{
            console.log(err);
        })
        
    },[])

    const HandlSubmit= async (e)=>{
        e.preventDefault();
        const formData = new FormData(e.target);
        console.log(Object.fromEntries(formData));
        if(opeation ==='Ajouter'){

            try{
         
                let res = await fetch(API_URL+'/Etudiant/RepenseProblem.php',{
                    method:'POST' , 
                    body:formData 
                });
                let resJson = await res.json();
                    if(res.status === 200){
                        
                        console.log(resJson);
                        setProblems(
                            problems.map(P=>{
                                if(P.id_problem === resJson.id_problem){
                                    return resJson ; 
                                }
                                else{
                                    return P ;
                                }
                            })
                        );
                        dispatch(setNotificationOn({
                            message: 'Insertion avec succés',
                            time: 3000,
                            type:"succes" 
                        })) 
                       
                    }
                    else{
                        console.log(resJson);
                        dispatch(setNotificationOn({
                            message: "Echec de d'insertion ",
                            time: 3000,
                            type:"error" 
                        })) 
                    }
           }
           catch(err){

               console.log(err);
           }     
        }else if (opeation ==='Modifie'){
            console.log('modifie');
            try{
         
                let res = await fetch(API_URL+'/Etudiant/ModifieReponseProblem.php',{
                    method:'POST' , 
                    body:formData 
                });
                let resJson = await res.json();
                    if(res.status === 200){
                        
                        console.log(resJson);
                        setProblems(
                            problems.map(P=>{
                                if(P.id_problem === resJson.id_problem){
                                    return resJson ; 
                                }
                                else{
                                    return P ;
                                }
                            })
                        );
                        dispatch(setNotificationOn({
                            message: 'Modification avec succés',
                            time: 3000,
                            type:"modifier" 
                        })) 
                       
                    }
                    else{
                        console.log(resJson);
                        dispatch(setNotificationOn({
                            message: 'Echec de modification',
                            time: 3000,
                            type:"error" 
                        })) 
                    }
           }
           catch(err){

               console.log(err);
           }     
        }else if(opeation ==='Delete'){
            console.log('supprimer');
            try{
         
                let res = await fetch(API_URL+'/Etudiant/DeleteRepenseProblem.php',{
                    method:'POST' , 
                    body:formData 
                });
                let resJson = await res.json();
                    if(res.status === 200){
                        
                        console.log(resJson);
                        setProblems(
                            problems.map(P=>{
                                if(P.id_problem === resJson.id_problem){
                                    return resJson ; 
                                }
                                else{
                                    return P ;
                                }
                            })
                        );
                        dispatch(setNotificationOn({
                            message: 'Suppression avec succés',
                            time: 3000,
                            type:"succes" 
                        })) 
                       
                    }
                    else{
                        console.log(resJson);
                        dispatch(setNotificationOn({
                            message: 'Echec de suppression ',
                            time: 3000,
                            type:"error" 
                        })) 
                    }
           }
           catch(err){

               console.log(err);
           }     
        }else if(opeation ==='ValideComp'){
            console.log('ValideComp');
            try{
         
                let res = await fetch(API_URL+'/Etudiant/ValideCometition.php',{
                    method:'POST' , 
                    body:formData 
                });
                let resJson = await res.json();
                    if(res.status === 200){
                        
                        console.log(resJson);
                        history.go(-1);
                       
                    }
                    else{
                        console.log(resJson);
                        dispatch(setNotificationOn({
                            message: 'Competition non validée ',
                            time: 3000,
                            type:"error" 
                        })) 
                    }
           }
           catch(err){

               console.log(err);
           }     
        }
    
    }

    const aploadFile = async(e , id_p)=>{
        e.preventDefault();
        const inp = document.querySelector(`#`+id_p);
        console.log(inp);
        inp.click();
       
    }

    const onModifier =()=>{
        setOpreration('Modifie')
    }
    const onAjoute =()=>{
        setOpreration('Ajouter')
    }
    const onDelete= ()=>{
        setOpreration('Delete');
    }

    const validerCompetition = ()=>{
        setOpreration('ValideComp') ;
    }
  


    return ( 
        <div className="passerCompetition">
           <div className="Problem_container_etud">
                {
                    problems[0] && 
                    <h1> Competition :<span className="nom_competition"> {problems[0].nom_comp}</span></h1>
                }
                {
                    problems.map((P,i)=>{
                        return <div className="problem_etud" key={i}>
                                    <h3 className="desCription_problem_etud">{P.description}</h3>
                                    <embed src={API_URL+P.file} width="800" height="400" type='application/pdf'/>
                                    <form  onSubmit={HandlSubmit} encType="multipart/form-data" >

                                        <input hidden  id={`inp`+P.id_problem} type="file" name="file" />
                                        <input hidden type="text" name="cne" value={cne} readOnly />

                                        <input hidden type="text" name="id_problem" value={P.id_problem} readOnly />
                                        <div className="content_btn_form_rep_prob">
                                            <button onClick={(e)=>aploadFile(e,`inp`+P.id_problem)} className="download-button">
                                                <div className="docs"><i className="fas fa-file-alt"></i> Docs</div>
                                                <div className="download">  
                                                   <i className="fas fa-upload"></i>
                                                </div>
                                            </button>

                                            <button onClick={onAjoute} className="download-button">
                                                <div className="docs"> envoyer</div>
                                            </button>
                                        </div>
                                       

                                    </form>

                                    {
                                        P.rep_comp_etud && 
                                        <div>
                                            <embed src={API_URL+P.rep_comp_etud.Reponse_problem} width="600" height="300" type='application/pdf'/>
                                              <form  onSubmit={HandlSubmit} encType="multipart/form-data" >

                                                    <input hidden  id={`inpM`+P.id_problem} type="file" name="file" />
                                                    <input hidden type="text" name="cne" value={cne} readOnly />

                                                    <input hidden type="text" name="id_problem" value={P.rep_comp_etud.id_problem} readOnly />
                                                    <div className="content_btn_form_rep_prob">
                                                        <button onClick={(e)=>aploadFile(e,`inpM`+P.rep_comp_etud.id_problem)} className="download-button">
                                                            <div className="docs"><i className="fas fa-file-alt"></i>docs</div>
                                                            <div className="download">  
                                                            <i className="fas fa-upload"></i>
                                                            </div>
                                                        </button>
                                                        <button onClick={onModifier} className="download-button">
                                                            <div className="docs">modifier</div>
                                                        </button>

                                                        <button onClick={onDelete} className="download-button">
                                                            <div className="docs"> Supprimer</div>
                                                        </button>
                                                    </div>


                                                </form>

                                            
                                
                                        </div>
                                    }
                                </div>
                    })
                }
                <div>
                       {
                        problems.length>0 &&
                        <form onSubmit={HandlSubmit}>
                        <input hidden type="text" name="cne" value={cne} readOnly /> 
                        <input hidden type="text" name="id_comp" value={id_comp} readOnly/> 
                       
                        <div className="btn-validation-comp-etud">
                            <button onClick={validerCompetition}  className="valide_btn-etud" ><span>Valider</span></button>
                        </div>
                    </form>   
                       } 
                </div>
           </div>
        </div>
     );
}
 
export default PasserCompetition;
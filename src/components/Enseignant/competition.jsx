import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../ApI/api";

//  redaux
import { useSelector,useDispatch } from 'react-redux';
import { setUser } from '../../redux/user/user.actions';
// redux
import './competition.css'

import { setNotificationOn } from "../../redux/notification/notification.actions";

const Competition = () => {
     //redux
     const user = useSelector(state => state.user);
     const dispatch = useDispatch()
     //redux
    const [semester  ,setSemester ] = useState();
    const [module  ,setModule ] = useState();
    const [competition , setCompetition] = useState([]);
    const cin = user.userInfos.id; 
    const formElement=useRef();
    const [operation ,setOpreration] = useState(); 
    //
    const onAjoute =()=>{
        setOpreration('Ajouter')
        open_modale() ; 
       
    }
    const onModifie = async (id_comp)=>{
        await setOpreration('Modifier')
        open_modale() ; 
       
        const comp = competition.filter(C=> C.id_comp === id_comp)[0]; 
        console.log(comp);
        const form  = formElement.current ;
        console.log(form);
        if(comp){

            form.nom.value = comp.nom_comp ; 
            form.id_comp.value = comp.id_comp ;
        }


    }
    const initialisation= ()=>{
        const reset = document.querySelector("#resetInput"); 
        reset.click();
        
    }
   
//
    useEffect(()=>{
        fetch( API_URL+'/Enseignant/Competition/all_comp.php?cin='+cin)
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
             setCompetition(data);
            //
            
            fetch( API_URL+'/Enseignant/Competition/sem_mod.php?cin='+cin)
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
                setModule(data[0])
                console.log(data[0]);
                
            })
            .catch(err=>{
                console.log(err);
            })
            
           
            
        })
        .catch(err=>{
            console.log(err);
        })


    },[cin])

    const switchsem =async()=>{
        const id_sem=document.querySelector('#semester').value ; 
        console.log("id_sem");
        console.log(id_sem);
        const mod = semester.filter(s=>
          s.id_semester===id_sem) 
  
       await setModule(mod[0])
  
          console.log(mod[0]);
       }
    
   
    const HandlSubmit= async (e)=>{
        e.preventDefault();
        const cls = document.querySelector('.close-btn');
        const formData = new FormData(e.target);
        console.log(Object.fromEntries(formData));
        if(operation === 'Ajouter'){
            try{
             
                let res = await fetch(API_URL+'/Enseignant/Competition/creation_comp.php',{
                    method:'POST' , 
                    body:formData 
                });
                let resJson = await res.json();
                    if(res.status === 200){
                        
                       // console.log(resJson);
                        setCompetition([...competition,resJson]);
                         cls.click();
                         dispatch(setNotificationOn({
                            message: 'Insertion avec succés',
                            time: 3000,
                            type:"succes" 
                        }))
                    }
                    else{
                        //console.log(resJson);
                        dispatch(setNotificationOn({
                            message: "Echec d'insertion",
                            time: 3000,
                            type:"error" 
                        })) 
                    }
           }
           catch(err){

               console.log(err);
           }     
        }
        else if(operation === 'Modifier'){
            try{
             
                let res = await fetch(API_URL+'/Enseignant/Competition/Update_Comp.php',{
                    method:'POST' , 
                    body:formData 
                });
                let resJson = await res.json();
                    if(res.status === 200){
                        
                        console.log(resJson);
                        setCompetition(
                            competition.map(C=>{
                                if(C.id_comp === resJson.id_comp){
                                    return resJson ; 
                                }
                                else{
                                    return C ;
                                }
                            })
                        );

                       initialisation();
                         cls.click();
                         dispatch(setNotificationOn({
                            message: 'Modification avec succés',
                            time: 3000,
                            type:"modifier" 
                        })) 
                    }
                    else{
                        //console.log(resJson);
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
        }
               
    
    }

    
    const onClose = ()=>{
        const modale = document.querySelector('.modal-overlay');
        modale.classList.remove('open-modal');
    }
    
    const open_modale=()=>{
        const modale = document.querySelector('.modal-overlay');
        modale.classList.add('open-modal');
    }
    const Delete_comp = (id_comp)=>{
        fetch( API_URL+'/Enseignant/Competition/Delete_comp.php?id_comp='+id_comp)
        .then(res=>{
            if(res.status === 200 ){
                return res.json() 
            }
            else{
                return null
            }
        })
        .then(data =>{
            
            console.log(data);
    
            if(data!== null){
                setCompetition(competition.filter(C=> C.id_comp!== data))

                dispatch(setNotificationOn({
                    message: 'Suppression avec succés',
                    time: 3000,
                    type:"succes" 
                })) 
            }else{

                dispatch(setNotificationOn({
                    message: 'Echec de suppression ',
                    time: 3000,
                    type:"error" 
                })) 
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }
    return ( 
    <div className="chapitre_ENS"> 
        
        <div className="ajouter" onClick={onAjoute}>
            <button   className="cssbuttons-io-button">
            <i className="fas fa-plus"></i>
                <span>Creer competition</span>
            </button>
        </div>

        <div className="All_comp_ens">
            {
                competition.length>0 && 
                <div className="chapitres-ens">
                    {
                        competition.map((C,i)=>{
                            return  <div className="Semester  chap" key={i}>
                               <Link className="links_competition_ens" to={`/Enseignant/Competition/Problem/`+C.id_comp} > {C.nom_comp}</Link>
                            <div className="btns_chapitres">
                                <button onClick={()=>Delete_comp(C.id_comp)} className=" btn_supprimer"><i className="fa fa-trash" aria-hidden="true"></i></button>
                                <button onClick={()=>onModifie(C.id_comp)}  className="btn_modifier"><i className="fas fa-edit"></i></button>
                             </div>
                           </div> 
                        })
                    }
                </div>
            }
        </div>
        <div className="modal-overlay ">
                    <div className="modal-container">
                            <form  className="formulaire" ref={formElement} onSubmit={HandlSubmit}>

                                <input type="text" name="cin" value={cin} readOnly hidden/>
                                <input type="text" name='id_comp'hidden />
                                <div className="input-box">
                                    <input type="text" name="nom" required/>
                                    <label >Nom </label>

                                 </div>
                                 <div className="input-box">
                                    <input type="datetime-local" name="date_debut" />
                                    <label >date debut</label>
                                </div>
                                <div className="input-box">
                                    <input type="datetime-local" name="date_exp" />
                                   <label >date fin</label>
                                </div>
                            {
                               operation ==="Ajouter" &&  
                               <>
                                     {semester &&
                                         <>
                                         <label className="label-select" >Semestre </label> 
                                         <select id="semester"  onChange={switchsem} name="semester" className="select-inp" >
                                       {
                                          semester.map((s ,i)=>{
                                           return <option key={i} value={s.id_semester}>
                                                  {s.nom}
                                           </option>
                                       })
                                       }
                                         </select>
                                         </>
                                     }
                                     {module &&  <select name="module[]" multiple>
                                      {module.module.map((m ,i)=>{
                                          return <option key={i} value={m.id_module}>
                                                 {m.nom_module}
                                          </option>
                                      })}

                                    </select>
                                    }
                               </>
                            }
                                   
                                    
                                       
                                                      

                                    <div >
                                        <input hidden type="reset" value='reset' id="resetInput" />

                                        <button type="submit" className="btn_modal" >
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            {operation}
                                        </button>
                                    </div>
                             </form>
                                    <button className="close-btn" onClick={onClose}><i className="fa fa-times" aria-hidden="true"></i></button>
                    </div>
        </div>
    </div> );
}
 
export default Competition;
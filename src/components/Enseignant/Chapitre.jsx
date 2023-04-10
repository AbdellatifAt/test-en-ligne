import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { API_URL } from "../../ApI/api";
import './Chapitre.css'

import { useDispatch } from "react-redux";
import { setNotificationOn } from "../../redux/notification/notification.actions";

const Chapitre = () => {
    const {id_module } = useParams()
    const [chapitre , setChapitre ] = useState([]);
    const [operation , setOperation] = useState()
    const formElement = useRef()
    // notification 
const dispatch = useDispatch();
useEffect(()=>{
        fetch(API_URL+'/Enseignant/Module/Chapitre/Chapitre.php?id_module='+id_module)
        .then(res=>{
            if(res.status === 200 ){
                return res.json();
            }
            else{
                return [];
            }
            
        })
        .then(data =>{
            console.log(data);
            setChapitre(data);
            console.log(chapitre);
        })
        .catch(err=>{
            console.log(err);
        })
    },[id_module])

    const HandlSubmit = async(e)=>{
        e.preventDefault();
        const cls = document.querySelector('.close-btn');
        const formData = new FormData(e.target);
        console.log(Object.fromEntries(formData));
        if (operation === 'ajouter') {
                try{
                    let res = await fetch(API_URL+'/Enseignant/Module/Chapitre/Ajout_chap.php',{
                        method:'POST' , 
                        body:formData 
                    });
                    let resJson = await res.json();
                        if(res.status === 200){
                            setChapitre([...chapitre,resJson]);
                          //  console.log(resJson);
                            cls.click();
                            dispatch(setNotificationOn({
                                message: 'Insertion avec succés',
                                time: 3000,
                                type:"succes" 
                            }))
                        }
                        else{
                           // console.log(resJson);
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
            else if(operation === 'modifier') {
                
               // console.log(Object.fromEntries(formData));
            try{
                let res = await fetch(API_URL+'/Enseignant/Module/Chapitre/modif_chap.php',{
                    method:'POST' , 
                    body:formData 
                });
                let resJson = await res.json();
                    if(res.status === 200){
                        let pos = -1;
                        chapitre.forEach((S,i) =>{
                            if(S.id_chap === Object.fromEntries(formData).id_chap){
                                pos = i ;
                                console.log(pos);
                            }
                        })

                    let newchap =  chapitre.filter(chap=>chap.id_chap !== resJson.id_chap);
                            newchap.splice(pos,0,resJson);
                            setChapitre(newchap)
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
const DeleteSemester= (id_chap)=>{
    console.log(id_chap);
    fetch(API_URL+'/Enseignant/Module/Chapitre/suppression_chap.php?id_chap='+id_chap)
    .then(res=>{
        if(res.status===200){
            setChapitre(chapitre.filter(S=> S.id_chap !== id_chap));
            dispatch(setNotificationOn({
                message: 'Suppression avec succés',
                time: 3000,
                type:"succes" 
            })) 
        }
        else{
            dispatch(setNotificationOn({
                message: 'Echec de suppression',
                time: 3000,
                type:"error" 
            })) 
        }
    })
    .catch(err=> console.log(err));
}
const onModefier=(id_chap)=>{
        open_modale()
        const chap = chapitre.filter(S => S.id_chap === id_chap)[0];
        if(chap){
            const form = formElement.current
            form.id_chap.value = chap.id_chap;
            form.nom_chap.value = chap.nom_chap;
            form.querySelector('.hidden_el').setAttribute('hidden','');
            setOperation('modifier')
            const model = document.querySelector(".modal-overlay")
            model.classList.add("open-modal");
        }


}


    const open_modale=()=>{
        const modale = document.querySelector('.modal-overlay');
        modale.classList.add('open-modal');
    }
    const onAjoute=()=>{
        open_modale();
        initializeForm();
        setOperation('ajouter')
    }
    const initializeForm = () => {     
           const form = formElement.current
            form.querySelector('.hidden_el').setAttribute('hidden','');
            
    }
    const onClose = ()=>{
        const modale = document.querySelector('.modal-overlay');
        modale.classList.remove('open-modal');
    }

    return ( 
        <div className="chapitre_ENS">
            <div className="ajouter">

            <button  onClick={onAjoute} className="cssbuttons-io-button">
            <i className="fas fa-plus"></i>
                <span>Ajouter Chapitre</span>
            </button>

            </div>
            {
                chapitre.length>0 && 
                    <div className="chapitres-ens">
            {
                chapitre.map((C ,i)=>(
                    <div className="Semester  chap" key={i}>
                            <Link to={`/Enseignant/module/chapitre/test/`+C.id_chap} > {C.nom_chap}</Link>
                            <div className="btns_chapitres">
                                <button onClick={()=>DeleteSemester(C.id_chap)} ><i className="fa fa-trash" aria-hidden="true"></i></button>
                                <button onClick={() => onModefier(C.id_chap)} className="btn_modifier"><i className="fas fa-edit"></i></button>
                             </div>
                    </div> 
                           ))
                        }

            </div>
            }
           
           
                <div className="modal-overlay ">
                    <div className="modal-container">
                        <form  className="formulaire" ref={formElement} onSubmit={HandlSubmit}>
                        <div>
                        </div>
                        <input type="text" name="operation" hidden defaultValue={operation} />

                        <div className="input-box">
                           
                        <input type="text" name="nom_chap"  required/>       
                        <label >Nom Chapitre</label>
                        </div>
                         <input className="hidden_el" type="text" name="id_chap"  />
                         <input className="hidden_el"  type="text" name="id_module" defaultValue={id_module} hidden />
                        
                        <div>
                               <button type="submit" className="btn_modal" >
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>{operation}
                                 </button>
                       </div>
                        </form>
                        <button className="close-btn" onClick={onClose}><i className="fa fa-times" aria-hidden="true"></i></button>
                    </div>
                </div>

        </div>
        
     );
}
 
export default Chapitre;
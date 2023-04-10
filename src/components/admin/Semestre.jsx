import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import './Semester.css'
import { API_URL } from "../../ApI/api";

import { useDispatch } from "react-redux";

import { setNotificationOn } from "../../redux/notification/notification.actions";
const Semestre = () => {
        const [semester , setSemester] = useState([]);
        const [operation , setOperation] = useState()
        const formElement = useRef();
        // notification 
        const dispatch = useDispatch();
        useEffect(()=>{
                
                fetch(API_URL+'/admin/Semester/Affich_sem.php')
                .then(res=>{
                    if(res.status ===200)
                        return res.json();
                    else 
                    return []
                })
                .then(data=>{
                setSemester(data);
                // console.log(data);

                })
                .catch(err=>{
                console.log(err);
                })
        },[]);
const HandlSubmit = async(e)=>{
        e.preventDefault();
        const cls = document.querySelector('.close-btn');
        const reset = document.querySelector('#reset_form_module');
        const formData = new FormData(e.target);
        //console.log(formData);
        if (operation === 'ajouter') {
                try{
                    let res = await fetch(API_URL+'/admin/Semester/Ajouter.php',{
                        method:'POST' , 
                        body:formData 
                    });
                    let resJson = await res.json();
                        if(res.status === 200){
                            setSemester([...semester,resJson]);
                            console.log(resJson);
                            reset.click();
                            cls.click();

                            dispatch(setNotificationOn({
                                message: 'Insertion avec succés',
                                time: 3000,
                                type:"succes" 
                            }))
                        }
                        else{
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
                let res = await fetch(API_URL+'/admin/Semester/modification.php',{
                    method:'POST' , 
                    body:formData 
                });
                let resJson = await res.json();
                    if(res.status === 200){
                        let pos = -1;
                        semester.forEach((S,i) =>{
                            if(S.id_semester === Object.fromEntries(formData).id_semester){
                                pos = i ;
                                console.log(pos);
                            }
                        })

                    let newSemester =  semester.filter(semester=>semester.id_semester !== resJson.id_semester);
                            newSemester.splice(pos,0,resJson);
                            setSemester(newSemester)
                            cls.click();
                            dispatch(setNotificationOn({
                                message: 'Modification avec succés',
                                time: 3000,
                                type:"succes" 
                            })) 
                    }
                    else{
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
const DeleteSemester= (id_semester)=>{
    console.log(id_semester);
    fetch(API_URL+'/admin/Semester/suppression.php?id_semester='+id_semester)
    .then(res=>{
        if(res.status===200){
            setSemester(semester.filter(S=> S.id_semester !== id_semester));
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
const onModefier=(id_semester)=>{
        open_modale()
        const semes = semester.filter(S => S.id_semester === id_semester)[0];
        if(semes){
            const form = formElement.current
            form.id_semester.value = semes.id_semester;
            form.nom.value = semes.nom;
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
        < div className="semestre-admin">
        <div className="ajouter">     
            <button  onClick={onAjoute} class="cssbuttons-button">
            <i class="fas fa-plus"></i>
                <span>Ajouter </span>
            </button>
        </div>
        { semester.length>0 && 
            <div className="all-Semester">
            {
                semester.map((S ,i)=>(
                    <div className="Semester sem" key={i}>
                            <Link className="nom_semester" to={`/Admin/SM_Module/`+S.id_semester} > {S.nom}</Link>
                            <div className="btns-semester">
                            <button style={{color:'red'}} onClick={()=>DeleteSemester(S.id_semester)} ><i className="fa fa-trash" aria-hidden="true"></i></button>
                            <button style={{color:'blue'}} onClick={() => onModefier(S.id_semester)} className="btn_modifier"><i className="fas fa-edit"></i></button>
                            </div>
                    </div> 
                ))
            }
            </div>

        }
               
                   
                <div className="modal-overlay ">
                <div className="modal-container">
                    <form  className="formulaire" ref={formElement} onSubmit={HandlSubmit}>
                        
                        <input type="text" name="operation" defaultValue={operation} hidden />
                        <div className="input-box">
                
                            <input type="text" name="nom" required />       
                            <label >Nom Semester</label>
                        </div>
                        <div >
                            <button type="submit" className="btn_modal" >
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>{operation}
                            </button>
                        </div>
                         
                         <input className="hidden_el" type="text" name="id_semester"  />
                         <input hidden id="reset_form_module" type="reset" />
                        
                    </form>
                        <button className="close-btn" onClick={onClose}><i className="fa fa-times" aria-hidden="true"></i></button>
                </div>
                </div>
        </div>);
}

export default Semestre;
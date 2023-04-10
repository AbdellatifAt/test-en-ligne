import { useEffect, useRef, useState } from "react";
import { API_URL } from "../../ApI/api";
import './Profil.css'


import { setNotificationOn } from "../../redux/notification/notification.actions";
//  redaux
import { useSelector,useDispatch } from 'react-redux';
import { setUser } from '../../redux/user/user.actions';
// redux
const Profil = () => {
     //redux
     const user = useSelector(state => state.user);
     const dispatch = useDispatch()
     //redux
    const cne = user.userInfos.id;
    const [profil  ,setProfil ] = useState();
    const formElement = useRef()
    const [verifyPassword , setVerifyPassword] = useState(true)

useEffect(()=>{
    fetch( API_URL+'/Etudiant/Profil.php?cne='+cne)
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
        setProfil(data)
    })
    .catch(err=>{
        console.log(err);
    })
},[])

const onClose = ()=>{
    const modale = document.querySelector('.modal-overlay');
    modale.classList.remove('open-modal');
}

const open_modale=()=>{
    const modale = document.querySelector('.modal-overlay');
    modale.classList.add('open-modal');
}
const HandlSubmit= async (e)=>{
    e.preventDefault();
    const cls = document.querySelector('.close-btn');
    const formData = new FormData(e.target);
    console.log(Object.fromEntries(formData));
   
            try{
                let res = await fetch(API_URL+'/Etudiant/modifierMotDePasse.php',{
                    method:'POST' , 
                    body:formData 
                });
                let resJson = await res.json();
                    if(res.status === 200){
                        console.log(resJson);
                        setVerifyPassword(resJson);
                        resetInpu();
                        cls.click();
                        dispatch(setNotificationOn({
                            message: 'Mot de passe modifié',
                            time: 3000,
                            type:"modifier" 
                        })) 
                    }
                    else{
                        setVerifyPassword(resJson);
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

}

const resetInpu =()=>{
    const reset = document.querySelector('#resetInput') ; 
    console.log(reset);
    reset.click();

}

    return ( 
        (profil && 
            <div className="content_profil_Etud">

                <div className="profil_Etud">
                    <div className="image_profil">
                        <img src={ API_URL+profil.image}></img>
                        <input className="nom_Etud" value={profil.nom + ' '+ profil.prenom }  readOnly /> 
                    </div>
                    <div className="iformation_detaill">
                        <h3>information détaillées</h3>
                        <div className="detaill">
                        <span> Cne : </span><input value={profil.cne} readOnly />
                        </div>
                        <div className="detaill">
                        <span>Email : </span><input value={profil.email} readOnly />
                        </div>
                        <div className="change-password">
                            <button  onClick={open_modale} className="btn-change-password">changer le mot de passe</button>
                        </div>
                       

                    </div>

                    
                
                </div>

                <div className="modal-overlay ">
                            <div className="modal-container">
                                <form  className="formulaire" ref={formElement} onSubmit={HandlSubmit}>
                                   {
                                       !verifyPassword && 
                                       <div className="error_password">
                                            le mot de passe n'est pas verifier
                                       </div>
                                       
                                   }
                                    <div className="input-box">
                
                                        <input type="password" name="old_password" required/>
                                        <label >ancien mot de passe</label>
                                    </div>
                                    <div className="input-box">
                                        <input type="password" name="new_password" required/>
                                        <label >nouveau mot de passe</label>
                                    </div>
                                    <div className="input-box">
                                        <input type="test"  name="confirmation_password" required/>
                                        <label >confirme mot de passe</label>
                                    </div>

                                    
                                       
                                        <input hidden  name="cne"  type="text" defaultValue={cne}  />
                                      

                                    <div >
                                        <input hidden type="reset" value='reset' id="resetInput" />

                                        <button type="submit" className="btn_modal" >
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>modifier
                                        </button>
                                    </div>
                                </form>
                                    <button className="close-btn" onClick={onClose}><i className="fa fa-times" aria-hidden="true"></i></button>
                           </div>
                            </div>

        </div>)
     );
}
 
export default Profil;
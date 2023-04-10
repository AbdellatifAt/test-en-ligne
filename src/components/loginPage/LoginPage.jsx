import React, { useState } from 'react'
import { API_URL } from '../../ApI/api';
import './login.css'

import { useDispatch } from 'react-redux';
import image from '../../images/image-fsac.jpg'

import { setUser } from '../../redux/user/user.actions';

function LoginPage() {
  const [utilisateur , setUtilisateur] = useState('etudiant') ; 
  const [erreur , setErreur] = useState('');

  const dispatch = useDispatch()

  const setEnseignant = async () =>{
    await setUtilisateur('enseignant')
  }
  const setEtudiant = async () =>{
    await setUtilisateur('etudiant')
  }

  
const HandlSubmit = async(e)=>{
  //console.log(form);
  e.preventDefault();
  const formData = new FormData(e.target);
  console.log(Object.fromEntries(formData));
  if (utilisateur === 'etudiant') {
    const reset = document.querySelector(".reset_auth_ens")
          try{
              let res = await fetch(API_URL+'/Etudiant/Authentification.php',{
                  method:'POST' , 
                  body:formData 
              });
              let resJson = await res.json();
                  if(res.status === 200){
                      console.log(resJson);
                      localStorage.setItem("idSession", resJson.idSession);
                      dispatch(setUser({userInfos: {id: resJson.id}, type: 'etudiant'}))
                      reset.click();
                  }
                  else{
                      console.log(resJson);
                      setErreur('informations incorrectes')
                  }
         }
         catch(err){
             console.log(err);
         }
      }
      else if(utilisateur === 'enseignant') {
          
        
      try{
          let res = await fetch(API_URL+'/Enseignant/Euthentification.php',{
              method:'POST' , 
              body:formData 
          });
          let resJson = await res.json();
              if(res.status === 200){

               console.log(resJson);
               localStorage.setItem("idSession", resJson.idSession);
               dispatch(setUser({userInfos: {id: resJson.id}, type: 'enseignant'}))

              }else{
                  console.log(resJson);
                  setErreur('informations incorrectes')
              }
      }
      catch(err){
      console.log(err);
      }
  }
  
}

  return (
    <div className="container_formulaire">
        <div className="forme_boxes">
                <div className="box_left">
                  {/* <img src={image} alt="hoioiojo"/> */}
                    <div className="left_content">
                      {
                        utilisateur ==='etudiant' && 
                        <div>
                            <h2>Espace Etudiant</h2>
                            <p> <span>  STUDENt-TEST </span> est un espace numérique de travail conçu pour répondre aux besoins spécifiques 
                              des membres de la communauté de l'Université Hassan II de Casablanca.C'est un espace sécurisé 
                              accessible depuis tout ordinateur connecté à Internet (chez soi, dans une salle équipée de 
                              l'Université, etc.).
                              Chaque utilisateur dispose d'un compte qui, à partir d'une seule identification, ouvre sur un
                               ensemble d'applications et services adaptés au profil et aux fonctions de chacun.</p>
                            <button onClick={setEnseignant}>Enseignant</button>
                        </div>
                      }
                      {
                        utilisateur ==='enseignant' && 
                          <div>
                            <h2>Espace enseignant</h2>
                            <p> <span>  STUDENt-TEST </span>  est un espace numérique de travail conçu pour répondre aux besoins spécifiques 
                              des membres de la communauté de l'Université Hassan II de Casablanca.C'est un espace sécurisé 
                              accessible depuis tout ordinateur connecté à Internet (chez soi, dans une salle équipée de 
                              l'Université, etc.).
                              Chaque utilisateur dispose d'un compte qui, à partir d'une seule identification, ouvre sur un
                               ensemble d'applications et services adaptés au profil et aux fonctions de chacun.</p><button onClick={setEtudiant}>Etudiant</button>
                          </div>
                      }
                       
                       
                    </div>
                </div>
                <div className="box_right">
                   <div className="content_right">
                        <h2> Se Connecter </h2>
                            <div className="forme">
                                <form onSubmit={HandlSubmit}>
                                    <div className='erreurAuthentification'>
                                    {erreur}
                                    </div>
                                    <input type="text" name="user_name" id="email" placeholder="Email" />
                                    <input type="password" name="password" id="psw" placeholder="password"/>
                                    <input type="submit" value="connecter"/>
                                    <input hidden type="reset" className='reset_auth_ens'/>
                                </form>
                            </div>
                   </div>
                </div>
        </div>
       
    </div>
  )
}

export default LoginPage;
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../ApI/api";
import DataTable from "react-data-table-component";
import FilterComponent from "../dataTable/FilterComponent";
import './problem.css'

//  redaux
import { useSelector,useDispatch } from 'react-redux';
import { setUser } from '../../redux/user/user.actions';
import RepCompetition from "./RepCompetition";
// redux

import { setNotificationOn } from "../../redux/notification/notification.actions";
const Problem = () => {
     //redux
     const user = useSelector(state => state.user);
     const dispatch = useDispatch()
     //redux
    const [prob , setProb] = useState()
    const {id_comp} = useParams();
    const formElement=useRef();
    const [operation ,setOpreration] = useState(); 
    const [demande , setDemande] = useState(false) ;
    const [domandeEtud ,setDemandeEtud] = useState([])
    const [resCompetition , setResCompetition] = useState(false);
    
    
    const cin =user.userInfos.id ; 
// data table
const [filteredItems, setFilteredItems] = useState([])
    
const [filterText, setFilterText] = useState("");
const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
useEffect(() => {
        
    setFilteredItems( domandeEtud.filter(
        item =>
          JSON.stringify(item)
            .toLowerCase()
            .indexOf(filterText.toLowerCase()) !== -1
      ))


}, [filterText,domandeEtud]);
// data table
    const onClose = ()=>{
        const modale = document.querySelector('.modal-overlay');
        modale.classList.remove('open-modal');
    }
    
    useEffect(()=>{
        fetch( API_URL+'/Enseignant/Competition/All_Problem.php?id_comp='+id_comp)
        .then(res=>{
            if(res.status === 200 ){
                return res.json() 
            }
            else{
                return [];
            }
        })
        .then(data =>{
            console.log('problem');
            console.log(data);
            setProb(data);   
             //
             fetch( API_URL+'/Enseignant/Competition/Demande.php?cin='+cin)
             .then(res=>{
                 if(res.status === 200 ){
                     return res.json() 
                 }
                 else{
                     return [];
                 }
     
     
             })
             .then(data =>{
                 console.log('demande');
                 console.log(data);
                 setDemandeEtud(data)
            
                
             })
             .catch(err=>{
                 console.log(err);
             })
             // 
        })
        .catch(err=>{
            console.log(err);
        })
    },[id_comp,cin])

    const open_modale=()=>{
        const modale = document.querySelector('.modal-overlay');
        modale.classList.add('open-modal');
    }

    const onAjoute =()=>{
        setOpreration('Ajouter')
        open_modale() ; 
        document.querySelector('#file10').setAttribute('required','');
       
        console.log( document.querySelector('#file'));
    }
    const onModifie = async (id_problem)=>{
        await setOpreration('Modifier')
        open_modale() ; 
        document.querySelector('#file10').removeAttribute('required');
        console.log(  document.querySelector('#file'));
        const problem = prob.filter(P=> P.id_problem === id_problem)[0] ; 
        console.log(problem);
        const form  = formElement.current ;
        console.log(form);
        if(problem){

            form.id_problem.value = problem.id_problem ; 
            form.desc.value = problem.description ;
        }


    }
    const initialisation= ()=>{
        const reset = document.querySelector("#resetInput"); 
        reset.click();
        
    }

    const HandlSubmit= async (e)=>{
        e.preventDefault();
        const cls = document.querySelector('.close-btn');
        const formData = new FormData(e.target);
        console.log(Object.fromEntries(formData));
       
              if(operation === 'Ajouter'){
                try{
             
                    let res = await fetch(API_URL+'/Enseignant/Competition/problem.php',{
                        method:'POST' , 
                        body:formData 
                    });
                    let resJson = await res.json();
                        if(res.status === 200){
                            
                            console.log(resJson);
                           setProb([...prob , resJson])
                           initialisation();
                             cls.click();
                             dispatch(setNotificationOn({
                                message: 'Insertion avec succés',
                                time: 3000,
                                type:"succes" 
                            }))
                        }
                        else{
                            console.log(resJson);
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
              else if(operation === 'Modifier') {
                try{
             
                    let res = await fetch(API_URL+'/Enseignant/Competition/UPdate_Problem.php',{
                        method:'POST' , 
                        body:formData 
                    });
                    let resJson = await res.json();
                    console.log(resJson);
                        if(res.status === 200){
                            
                            console.log(resJson);
                            setProb(
                                prob.map(P=>{
                                    if(P.id_problem === resJson.id_problem){
                                        return resJson ; 
                                    }
                                    else{
                                        return P ;
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
    
    }
    const delete_problem=(id_problem)=>{
        fetch( API_URL+'/Enseignant/Competition/DeleteProblem.php?id_problem='+id_problem)
        .then(res=>{
            if(res.status === 200 ){
                return res.json() 
            }
            else{
                return null
            }
        })
        .then(data =>{
            console.log('id_problem');
            console.log(data);
    
            if(data!== null){
                setProb(prob.filter(P=> P.id_problem !== data))
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
    const consulte_Domande =()=>{
        setDemande(true)
    }
    const go_back =()=>{
        setDemande(false)
    }

    const deleteDemande =(cne , id_c )=>{
        fetch( API_URL+'/Enseignant/Competition/Sepprimer_Demande.php?cne='+cne+'&id_comp='+id_c)
        .then(res=>{
            if(res.status === 200 ){
                return res.json() 
            }
            else{
                return false;
            }

        })
        .then(data =>{
            console.log('demande refus');
            console.log(data);
            if(data){
                setDemandeEtud(domandeEtud.filter(D=> D.id_comp === data.id_comp && D.cne !== data.cne))
            }
           
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const AcceptDomande =(cne , id_c)=>{
        fetch( API_URL+'/Enseignant/Competition/AcceptDemande.php?cne='+cne+'&id_comp='+id_c)
        .then(res=>{
            if(res.status === 200 ){
                return res.json() 
            }
            else{
                return false;
            }

        })
        .then(data =>{
            console.log('demande accepter');
            console.log(data);
            setDemandeEtud(
                domandeEtud.map(D=>{
                    if(D.id_comp === data.id_comp && D.cne === data.cne){
                        return data ; 
                    }
                    else{
                        return D ;
                    }
                })
            );       
        })
        .catch(err=>{
            console.log(err);
        })
    }

    // data table  
const columns= [
    {
        name : 'image',
        cell : row => (
        <div>
            <img className="pic_profile" src={API_URL+row.image} alt={row.image} />
        </div>
        )
    },
    {
        name : 'cne',
        selector: row=>row.cne ,
        sortable: true ,
    },
    {
        name : 'nom',
        selector: row=>row.nom ,
        sortable: true ,
    },
    {
        name : 'prenom',
        selector: row=>row.prenom ,
        sortable: true ,
    },
    {
        name : 'Email',
        selector: row=>row.email ,
        sortable: true ,
    },
    {
        name : 'Score',
        selector: row=>row.score ,
        sortable: true ,
    },
    {
        name : 'Competition',
        selector: row=>row.nom_comp ,
        sortable: true ,
    },
    {
        name : 'action',
        cell : row => (<div>
            {
                row.etat === '0' &&
                <>
            <button onClick={()=>deleteDemande(row.cne,row.id_comp)} style={{ marginRight: '15px' }}  className='btn-delete-ens' ><i className="fas fa-user-minus"></i></button>
            <button onClick={()=>AcceptDomande(row.cne,row.id_comp)} className="btn_modifier btn-update-ens"><i className="fas fa-user-check"></i></button>
                </>
            }
            {
                row.etat === '1' && 
                <>
                <button className="btn_demande_accepter"><i className="fas fa-check-circle"></i></button>
                </>
            }
            </div>)
    }


] 
const customStyles = {
    header: {
        style: {
            minHeight: '56px',
          
        },
    },
    headRow: {
        style: {
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            borderTopColor: '#ccc',
        },
    },
    headCells: {
        style: {
            '&:not(:last-of-type)': {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: '#ccc',
                
            },
            backgroundColor :'#ccc' ,
            fontWeight: 'bold',
            textTransform: 'uppercase',
            fontSize : '14px' ,
            display:'flex',
            justifyContent:'center' , 
            
        },
    },
    cells: {
        style: {
            '&:not(:last-of-type)': {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: '#ccc',
                
            },
            backgroundColor :'white' ,
            display:'flex',
            justifyContent:'center' , 
           
               

        },
    },
};
const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText("");
    }
  };
  const choix_fichier = (e)=>{
        e.preventDefault() ; 
        const file = document.querySelector('#file10') ; 
        file.click() ; 
  }
//data table

const afficherResultatCompetition = ()=>{
    setResCompetition(true)
}
    return ( 
        <div className="problem">
          
           
         {
             !demande && !resCompetition &&
              <div className="content_btn_ajouter_problem">
              <button onClick={onAjoute}  className="icon-btn-admin add-btn-admin ">
                  <div className="add-icon-admin"></div>
                  <div className="btn-txt">ajouter</div>
              </button>

             
                <div className="container_btn_consult_demande">
                    <button className="btn_consulte_demande"  onClick={afficherResultatCompetition}>
                    <div className="default-btn">
                    <i className="fas fa-eye"></i>
                        <span>Consulter</span>
                    </div>
                    <div class="hover-btn">
                        <span>les resultat</span>
                    </div>
                    </button>
                </div>
              <div className="container_btn_consult_demande">
                  <button className="btn_consulte_demande"  onClick={consulte_Domande}>
                <div className="default-btn">
                   <i className="fas fa-eye"></i>
                    <span>Consulter</span>
                </div>
                <div class="hover-btn">
                    <span>les demandes</span>
                </div>
                </button>
             </div>
              </div>
         }
         
            {
              prob &&  !demande && !resCompetition &&
              <div className="content_all_probles">
                  {
                      prob.map((P,i)=>{
                          return <div className="all_problem_ens"  key={i} >
                              <p>{P.description}</p>
                              
                              <embed src={API_URL+P.file} width="800" height="400" type='application/pdf'/>
                            <div className="content_btn_problem" >
                            <button  className="btn__problem" onClick={()=>{delete_problem(P.id_problem)}}>supprimer</button>
                            <button className="btn__problem" onClick={()=>onModifie(P.id_problem)}>modifier</button>
                            </div>
                          </div>
                      })
                  }
              </div>
            }

            {
                demande &&  !resCompetition &&
                <div>
                        <div style={{marginTop:'15px'}  }></div>
                        
                        {
                            domandeEtud.length>0 && 
                            <div>

                                <DataTable
                                customStyles={customStyles}
                            
                                columns={columns}
                                data={filteredItems}
                                defaultSortField={'score'}
                                striped
                                pagination
                                />

                        
                        <div className="btn-validation-test-etud">
                            <button style={{right:'70px',backgroundColor:'#ccc'}} onClick={go_back} className="btn_back">
                                <span className="btn-text-one">Go</span>
                                <span className="btn-text-two">Back</span>
                            </button>
                        </div>  
                        </div>
                        
                        
                            
                            
                        }

                </div>
            }
            {
                resCompetition && 
                
                    <div>
                         <RepCompetition id_comp={id_comp} setResCompetition={setResCompetition} />
                    </div>
            }
          
            <div className="modal-overlay ">
                            <div className="modal-container">
                                <form  className="formulaire" ref={formElement} onSubmit={HandlSubmit} encType="multipart/form-data">
                                    <input type="text" name="id_comp" value={id_comp} readOnly hidden />
                                <div className="input-box">
                                
                                <input type="text" name="desc" required/>
                                <label >Description </label>
                            </div>

                            <div className="input-box">
                                
                                <input  hidden type="file" name="file" id="file10"/>
                                <input type="text" name="ppppp" className="inpRelat" readOnly/>
                                <button className="btnAbs" onClick={choix_fichier}>choisir une fichier</button>
                               
                                <label >Fichier </label>

                                  
                            </div>
                                       
                                       <input type="text" name="id_problem"  hidden />
                                                      

                                        <input hidden type="reset" value='reset' id="resetInput" />
                                    <div >

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
 
export default Problem;
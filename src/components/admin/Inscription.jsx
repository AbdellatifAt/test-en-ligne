import { useEffect, useState } from "react";
import { API_URL } from "../../ApI/api";
import Dropdown from "../dropdown/dropdown";
import './inscription.css'

import { useDispatch } from "react-redux";

import { setNotificationOn } from "../../redux/notification/notification.actions";

const Inscription = () => {
const [Etud , setEtud] = useState([]);
const [module ,setModule] = useState([]);

 // notification 
 const dispatch = useDispatch();

const [selectedValue ,setSelectedValue] = useState(null);

const values = [
    {
        id:8,
        value: 'rzer'
    },
    {
        id:4,
        value: 'mlkk'
    }
]




 useEffect(()=>{
     fetch(API_URL+'/admin/Inscription/AllModule.php')
     .then(res=>{
         if(res.status ===200)
                return res.json();
         else
            return []
     })
     .then(data =>{
         setModule(data)
            fetch(API_URL+'/admin/Etudiant/Affich_etud.php')
            .then(res=>{
                if(res.status ===200)
                    return res.json();
                 else
                    return [] ;
                
            })
            .then(data=>{
                setEtud(data)
            })
            .catch(err=>{
                console.log(err);
            })
         
     })
     .catch(err=>{
         console.log(err);
     })

 },[])
 const HandelSubmit = async (e)=>{
    e.preventDefault();
     const formData = new FormData(e.target);
     //formData.append('id', selectedValue.id)
     console.log(Object.fromEntries(formData));
             try{
                 let res = await fetch(API_URL+'/admin/Inscription/inscrption.php',{
                     method:'POST' , 
                     body:formData 
                 });
                 let resJson = await res.json();
                     if(res.status === 200){
                        console.log(resJson);
                        
                        dispatch(setNotificationOn({
                            message: ' Inscription avec succés.',
                            time: 3000,
                            type:"succes" 
                        }))
                     }
                     else{
                        dispatch(setNotificationOn({
                            message: "Echec d'inscription",
                            time: 3000,
                            type:"error" 
                        })) 
                     }
            }
            catch(err){
                console.log(err);
            }
         
 }

 const Import_file = async (e) =>{
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log(Object.fromEntries(formData));
            try{
                let res = await fetch(API_URL+'/import/inscription_files.php',{
                    method:'POST' , 
                    body:formData 
                });
                let resJson = await res.json();
                    if(res.status === 200){
                       
                        dispatch(setNotificationOn({
                            message: ' Inscription avec succés.',
                            time: 3000,
                            type:"succes" 
                        }))
                    }
                    else{
                        dispatch(setNotificationOn({
                            message: "Echec d'inscription",
                            time: 3000,
                            type:"error" 
                        })) 
                    }
           }
           catch(err){
               console.log(err);
           }

 }

 const file_import = (e)=>{
    e.preventDefault() ; 
    const file = document.querySelector('#file_import_inscription') ; 
    file.click();
}
 

    return ( 
        <div className="Incription">
            <div>
                
            <form onSubmit={Import_file} method="post" encType="multipart/form-data" >

                    <div className="import">
                        <input hidden type="file" name="excel"  id="file_import_inscription"/>
                    </div>
                   

                    <div className="Content_btn_inscription_file">
                        
                            <button onClick={file_import}  className="apload_file_inscription">
                                <div className="docs"><i className="fas fa-file-alt"></i> Docs</div>
                                    <div className="download">  
                                    <i className="fas fa-upload"></i>
                                </div>
                            </button>
                            <button   className="apload_file_inscription">
                                <div className="docs">Import</div>
                            </button>
                    </div>

            </form>
        </div>
           
         <div className="InscriptionContainer">
                <form className="form-inscription" onSubmit={HandelSubmit}>

                        
                            
                        {
                            Etud &&
                            <div className="box decorated">
                               <div className="content__inscription">
                                <label > cne</label>
                                    <select name="etudiant" >
                                    {
                                        Etud.map((E,i) =>{
                                            return <option className='same-as-selected' key={i} value={E.cne}>{E.cne}</option>
                                            
                                        })
                                    }
                                
                                    </select>
                               </div>
                            
                            </div>
                        
                        }
                        {
                            module && 
                            <div className="content__inscription">
                                <label >Modules</label>
                                <div className="selectMultiple" >
                                
                                <select   multiple name="module[]">
                                {
                                    module.map((M,i)=>{
                                    return <option key={i} value={M.id_module}>{M.nom_module}</option>
                                        
                                    })
                                }
                            </select>
                        </div>
                            </div>
                        

                        }
                            <button  className="btn__insciption">inscription</button>

                      


                </form>
                {/* <div className="w-96">
                <Dropdown selectedValue={selectedValue} setSelectedValue={setSelectedValue} values={values} />

                </div> */}

         </div>
        </div>


    );
}
 
export default Inscription;
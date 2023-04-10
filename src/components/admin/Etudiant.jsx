import { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import FilterComponent from "../dataTable/FilterComponent";
import img from '../../images/avatar_famme.jpg'
import { API_URL } from "../../ApI/api";
import './Admin.css'
import './Etudiant.css'
//import { hasFormSubmit } from "@testing-library/user-event/dist/utils";

import { useDispatch } from "react-redux";

import { setNotificationOn } from "../../redux/notification/notification.actions";

const Etudiant = () => {
    
const formElement = useRef();
const picREf = useRef() 
const input_file = useRef()
const imageRef = useRef()
const [Etud , setEtud] = useState([]);
const [operation , setOperation] = useState('ajouter')
// data table
const [filteredItems, setFilteredItems] = useState([])
    
const [filterText, setFilterText] = useState("");
const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

// notification 
const dispatch = useDispatch();

useEffect(() => {
        
    setFilteredItems( Etud.filter(
        item =>
          JSON.stringify(item)
            .toLowerCase()
            .indexOf(filterText.toLowerCase()) !== -1
      ))


}, [filterText,Etud]);
// data table
 useEffect(()=>{
        fetch(API_URL+'/admin/Etudiant/Affich_etud.php')
        .then(res=>{
           if(res.status === 200)
              return res.json();
            else 
                return [];
        })
        .then(data=>{
            setEtud(data);
            setFilteredItems(data);
           // console.log(data);

        })
        .catch(err=>{
            console.log(err);
        })
},[]);

const open_modale=()=>{
    const modale = document.querySelector('.modal-overlay');
    modale.classList.add('open-modal');
}
const HandlSubmit = async(e)=>{
    //console.log(form);
    e.preventDefault();
    const cls = document.querySelector('.close-btn');
    const formData = new FormData(e.target);
    console.log(Object.fromEntries(formData));
    //console.log(formData);
    if (operation === 'ajouter') {
        try{
            let res = await fetch(API_URL+'/admin/Etudiant/Ajouter.php',{
                method:'POST' , 
                body:formData 
            });
            let resJson = await res.json();
            if(res.status === 200){
                setEtud([...Etud,resJson]);
                console.log(resJson);
                cls.click();

                dispatch(setNotificationOn({
                    message: 'Insertion avec succés',
                    time: 3000,
                    type:"succes" 
                }))
            }
            else{
                throw new Error()
            }
        }catch(err){
            console.log(err);
            dispatch(setNotificationOn({
                message: "Echec d'insertion",
                time: 3000,
                type:"error" 
            })) 
        }
    }
    else if(operation === 'modifier') {
        
        
        try{
            let res = await fetch(API_URL+'/admin/Etudiant/modification.php',{
                method:'POST' , 
                body:formData 
            });
    
            let resJson = await res.json();
            console.log(resJson);
                if(res.status === 200){

                    let pos = -1;
                    Etud.forEach((E,i) =>{
                        if(E.cne === Object.fromEntries(formData).cne){
                            pos = i ;
                            
                        }
                    })

                    let newEtudiants =  Etud.filter(etud=>etud.cne !== resJson.cne);
                            newEtudiants.splice(pos,0,resJson);
                            setEtud(newEtudiants)
                            cls.click();
                    dispatch(setNotificationOn({
                        message: 'Modification avec succés',
                        time: 3000,
                        type:"modifier" 
                    })) 

                }else{
                   
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
const onAjoute=()=>{
    open_modale();
    initializeForm();

    setOperation('ajouter')
 
    const form = formElement.current
     form.querySelectorAll('.hidden_el').forEach(el=>{
                 el.removeAttribute('hidden','');
             });
    // form.querySelectorAll('.nom_prenom').forEach(el=>{
        //  el.removeAttribute('hidden','');
    // });
// 
    // form.querySelector('.user_name_password').setAttribute('hidden','');

}
const initializeForm = () => {
    
        const form = formElement.current
         form.querySelectorAll('.hidden_el').forEach(el=>{
                el.removeAttribute('disabled','');
            });
            
            
        formElement.current.querySelectorAll('input, select').forEach(i => {
            if(i.name !== 'operation')
                i.value = '';
        })

        
}

const clickImage=()=>{
    picREf.current.click();
    
 }
 const changeImage = (e)=>{
     var file = e.target.files[0];
     imageRef.current.src =  URL.createObjectURL(file);
 }
const onClose = ()=>{
    const modale = document.querySelector('.modal-overlay');
    modale.classList.remove('open-modal');
}

const onModefier= async (cne)=>{
    await setOperation('modifier')

    open_modale();
    const etudiant = Etud.filter(e => e.cne === cne)[0];
        if(etudiant){
            const form = formElement.current
            form.cne.value = etudiant.cne;
           // form.prenom.value = etudiant.prenom;
           // form.nom.value = etudiant.nom;
           form.email.value = etudiant.email;
            form.user_name.value=etudiant.user_name ;
            form.password.value = "" ;
            form.querySelectorAll('.hidden_el').forEach(el=>{
                el.setAttribute('hidden','');
             });

          
            const model = document.querySelector(".modal-overlay")
            model.classList.add("open-modal");
        }


}

const DeleteEtud = async(cne)=>{
    fetch(API_URL+'/admin/Etudiant/suppression.php?cne='+cne)
        .then(res=>{
            if(res.status===200){
                setEtud(Etud.filter(E=> E.cne !== cne));
                dispatch(setNotificationOn({
                    message: 'Suppression avec succés',
                    time: 3000,
                    type:"succes" 
                })) 
            }
            else{
                dispatch(setNotificationOn({
                    message: 'Echec de suppression ',
                    time: 3000,
                    type:"error" 
                })) 
            }
        })
        .catch(err=> console.log(err));
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
        name : 'action',
        cell : row => (<div>
            <button style={{ marginRight: '15px' }} onClick={()=>DeleteEtud(row.cne)} className='btn-delete-ens' ><i className="fas fa-trash-alt "></i></button>
            <button onClick={() => onModefier(row.cne)} className="btn_modifier btn-update-ens"><i className="fas fa-user-edit btn-update-ens"></i></button>
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
//data table
const Creation_Profil = async (e)=>{
 e.preventDefault();
  const formData = new FormData(e.target);
    console.log(Object.fromEntries(formData));
            try{
                let res = await fetch(API_URL+'/import/creation_profil_etud.php',{
                    method:'POST' , 
                    body:formData 
                });
                let resJson = await res.json();
                    if(res.status === 200 && resJson.length >0){
                       
                        setEtud([...Etud,...resJson] )  ;
                        dispatch(setNotificationOn({
                            message: 'Creation avec succés',
                            time: 3000,
                            type:"succes" 
                        })) 
                    }
                    else{
                        dispatch(setNotificationOn({
                            message: 'echec de creation',
                            time: 3000,
                            type:"error" 
                        })) 
                    }
           }
           catch(err){
               console.log(err);
           }
}
const open_files = () =>{
   // const file = Document.querySelector(".inp_file");
    input_file.current.click();

}

    return ( 
        < div className="etudiant-admin">
            <form onSubmit={Creation_Profil}  className="form-exel" encType="multipart/form-data">
            
                <input type='file' name="excel" className="inp_file" ref={input_file} hidden />

               <div className="content-btn-icon" >
                <button className="btn-create">
                        <span>
                        <i class="fas fa-plus"></i>
                            Creer
                        </span>
                    </button>
                    <button onClick={open_files} type="button" className="btn_apload_file"><i className="fas fa-file-upload"></i></button>
               </div>
            </form>
           
            <div style={{padding:' 0 20px '}}>
            <div style={{display:'flex' , width:'100%' , marginBottom:'10px', justifyContent:'space-between'}}>
        <FilterComponent
            onFilter={event => setFilterText(event.target.value)}
            onClear={handleClear}
            filterText={filterText}
        />

        <button  onClick={onAjoute}  className="icon-btn-admin add-btn-admin ">
            <div className="add-icon-admin"></div>
            <div className="btn-txt">ajouter</div>
        </button>
        
 
            
         </div>

                <DataTable
                customStyles={customStyles}
            
                columns={columns}
                data={filteredItems}
                defaultSortField={'cne'}
                striped
                pagination
            />
        </div>
       

        
      <div className="modal-overlay ">
        <div className="modal-container">
            <form  className="formulaire" ref={formElement} onSubmit={HandlSubmit}>
                
                <input type="text" name="operation" defaultValue={operation} hidden />
                <div >
                    <img onClick={clickImage} ref={imageRef} className="image_profile" src={img}  alt="image_profil" />
                    <input onChange={changeImage} ref={picREf}  type="file" name="image" hidden/>
                </div>
                <div className="input-box">
                
                    <input className="hidden_el" type="text" name="cne"  required/>
                    <label className="hidden_el" >Cne :</label>
                </div>
                {
                    operation === 'ajouter' && (
                    <>
                        <div className="input-box">
                                <input  className="nom_prenom" type="text" name="nom" required />
                                <label className="nom_prenom" >Nom :</label>
                        </div>
                        <div className="input-box">
                        
                                <input className="nom_prenom" type="text" name="prenom" required/> 
                                <label className="nom_prenom">PRENOM :</label>
                        </div>
                    </>
                    )
                }

                <div className="input-box">
                
                    <input type="text" name="email" required/>
                    <label >Email :</label>
                        
                </div>

                {
                    operation === 'modifier' && (
                    <div className="user_name_password">
                            <div className="input-box">
                    
                                <input type="text" name="user_name" required />
                                <label > Identifiant</label>
                            </div>
                            <div className="input-box">
                                <input type="password" name="password"  />
                                <label> Password</label>
                            </div>
                            
                    </div>                        
                    ) 
                }

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
        
     </div>);
     
}
 
export default Etudiant;
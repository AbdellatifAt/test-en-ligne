import { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import FilterComponent from "../dataTable/FilterComponent";
import img from '../../images/avatar_famme.jpg'
import { API_URL } from "../../ApI/api";
import './Admin.css'
import './Enseignant.css'

import { useDispatch } from "react-redux";

import { setNotificationOn } from "../../redux/notification/notification.actions";

const Enseignant = () => {
    
const formElement = useRef();
const picREf = useRef()
const input_file = useRef()
const imageRef = useRef()
const [Ens , setEns] = useState([]);
const [operation , setOperation] = useState('ajouter')
// data table
const [filteredItems, setFilteredItems] = useState()
    
const [filterText, setFilterText] = useState("");
const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
 // notification 
const dispatch = useDispatch();

useEffect(() => {
        
    setFilteredItems( Ens.filter(
        item =>
          JSON.stringify(item)
            .toLowerCase()
            .indexOf(filterText.toLowerCase()) !== -1
      ))


}, [filterText,Ens]);
// data table
 useEffect(()=>{
        fetch(API_URL+'/admin/Enseignant/Affich_ens.php')
        .then(res=>{
            if(res.status ===200)
                return res.json();
            else 
            return []
        })
        .then(data=>{
            setEns(data);
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
const onClose = ()=>{
    const modale = document.querySelector('.modal-overlay');
    modale.classList.remove('open-modal');
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
    //      el.removeAttribute('hidden','');
    // });

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

const HandlSubmit = async(e)=>{
    //console.log(form);
    e.preventDefault();
    const cls = document.querySelector('.close-btn');
    const formData = new FormData(e.target);
    console.log("helo");
    console.log(Object.fromEntries(formData));
    if (operation === 'ajouter') {
            try{
                let res = await fetch(API_URL+'/admin/Enseignant/Ajouter.php',{
                    method:'POST' , 
                    body:formData 
                });
                let resJson = await res.json();
                    if(res.status === 200){
                        setEns([...Ens,resJson]);
                        console.log(resJson);
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
            
          
        try{
            let res = await fetch(API_URL+'/admin/Enseignant/modification.php',{
                method:'POST' , 
                body:formData 
            });
            let resJson = await res.json();
                if(res.status === 200){

                    let pos = -1;
                    Ens.forEach((E,i) =>{
                        if(E.cin === Object.fromEntries(formData).cin){
                            pos = i ;
                        }
                    })
                let newEnseignant =  Ens.filter(ens=>ens.cin !== resJson.cin);
                        newEnseignant.splice(pos,0,resJson);
                        setEns(newEnseignant)
                        cls.click();
                        dispatch(setNotificationOn({
                            message: 'Modification avec succés',
                            time: 3000,
                            type:"modifier" 
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
const onModefier= async(cin)=>{
    await setOperation('modifier')

    open_modale();
    const enseignant = Ens.filter(e => e.cin === cin)[0];
        if(enseignant){
            const form = formElement.current
            form.cin.value = enseignant.cin;
           // form.prenom.value = enseignant.prenom;
           // form.nom.value = enseignant.nom;
            form.email.value = enseignant.email;
            form.user_name.value=enseignant.user_name ;
            form.password.value = "";
            form.querySelectorAll('.hidden_el').forEach(el=>{
                el.setAttribute('hidden','');
            });

            // form.querySelectorAll('.nom_prenom').forEach(el=>{
            //     el.setAttribute('hidden','');
            // });
            // form.querySelector('.user_name_password').removeAttribute('hidden','');


            const model = document.querySelector(".modal-overlay")
            model.classList.add("open-modal");
        }


}

const DeleteEtud = async(cin)=>{
    fetch(API_URL+'/admin/Enseignant/suppression.php?cin='+cin)
        .then(res=>{
            if(res.status===200){
                setEns(Ens.filter(E=> E.cin !== cin));
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
        name : 'cin',
        selector: row=>row.cin ,
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
            <button style={{ marginRight: '15px' }} onClick={()=>DeleteEtud(row.cin)} className='btn-delete-ens' ><i className="fas fa-trash-alt"></i></button>
            <button onClick={() => onModefier(row.cin)} className="btn_modifier btn-update-ens "><i className="fas fa-user-edit"></i></button>
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

  const Creation_Profil = async (e)=>{
    e.preventDefault();
     const formData = new FormData(e.target);
       console.log(Object.fromEntries(formData));
               try{
                   let res = await fetch(API_URL+'/import/creation_profile_ens.php',{
                       method:'POST' , 
                       body:formData 
                   });
                   let resJson = await res.json();
                       if(res.status === 200 && resJson.length >0){
                          
                          setEns([...Ens , ...resJson]);
                          dispatch(setNotificationOn({
                            message: 'Creation avec succés',
                            time: 3000,
                            type:"succes" 
                        })) 
                       }
                       else{
                        dispatch(setNotificationOn({
                            message: 'Echec de creation',
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
                <div className="content-btn-icon">
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
                defaultSortField={'cin'}
                striped
                pagination
            />
        </div>
       

        
      <div className="modal-overlay ">
        <div className="modal-container">
            <form  className="formulaire" ref={formElement} onSubmit={HandlSubmit} encType="multipart/form-data" >
          
                <input type="text" name="operation" defaultValue={operation} hidden />
                <div >
                    <img onClick={clickImage} ref={imageRef} className="image_profile" src={img}  alt="image_profil" />
                    <input onChange={changeImage} ref={picREf}  type="file" name="image" hidden />
                </div>

                <div className="input-box">
                
                    <input className="hidden_el" type="text" name="cin" required />
                    <label className="hidden_el" >Cin :</label>
                </div>
                {
                     operation === 'ajouter' && ( <>
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
                    
                    <input type="text" name="email" required />
                    <label >Email :</label>
                        
                </div>
               
               {
                   operation === 'modifier' &&(
                    <>
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

                     
                    </>
                   )

               }
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
 
export default Enseignant;
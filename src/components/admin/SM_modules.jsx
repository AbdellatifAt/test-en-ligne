import { useParams  } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import FilterComponent from "../dataTable/FilterComponent";
import './Semester.css'
import { API_URL } from "../../ApI/api";

import { useDispatch } from "react-redux";

import { setNotificationOn } from "../../redux/notification/notification.actions";

const SM_Modules = () => {


const {id} = useParams();
const [module , setModule] = useState([]);
const [operation , setOperation] = useState();
const [semester , setSemester] = useState([]);
const [Ens , setEns] = useState([]);
const formElement = useRef();
// data table
const [filteredItems, setFilteredItems] = useState()
    
const [filterText, setFilterText] = useState("");
const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

// notification 
const dispatch = useDispatch();

useEffect(() => {
        
    setFilteredItems( module.filter(
        item =>
          JSON.stringify(item)
            .toLowerCase()
            .indexOf(filterText.toLowerCase()) !== -1
      ))


}, [filterText,module]);
   useEffect(()=>{

    fetch(API_URL+'/admin/Semester/getModules.php?id='+id)
    .then(res=>{
        if(res.status===200){
            return res.json();
        }else{
            return [];
        }
    })
    .then(data=>{
            setModule(data)
      
    })
    .catch(err=>{
        console.log(err);
    })
    allEnseignant();
    allSemester();
},[id]);

const HandlSubmit = async(e)=>{
    e.preventDefault();
    const cls = document.querySelector('.close-btn');
    const formData = new FormData(e.target);

    //console.log(formData);
    if (operation === 'ajouter') {
            try{
                let res = await fetch(API_URL+'/admin/Module/Ajouter.php',{
                    method:'POST' , 
                    body:formData 
                });
                console.log(Object.fromEntries(formData));
                let resJson = await res.json();
                    if(res.status === 200){
                        setModule([...module,resJson]);
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
            let res = await fetch(API_URL+'/admin/Module/modification.php',{
                method:'POST' , 
                body:formData 
            });
            let resJson = await res.json();
                if(res.status === 200){
                    //console.log(FormData.get('id_module'));
                    let pos = -1;
                    module.forEach((M,i) =>{
                        if(M.id_module === Object.fromEntries(formData).id_module){
                            pos = i ;
                            
                        }
                    })

                let newModule =  module.filter(module=>module.id_module!== resJson.id_module);
                        newModule.splice(pos,0,resJson);
                        setModule(newModule)
                        cls.click();
                        dispatch(setNotificationOn({
                            message: ' Modification avec succés',
                            time: 3000,
                            type:"succes" 
                        }))
                }
                else{
                    dispatch(setNotificationOn({
                        message: "Echec de modification",
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

const allSemester = ()=>{
fetch(API_URL+'/admin/Semester/Affich_sem.php')
.then(res=>{
    if(res.status ===200)
        return res.json();
    else 
        return []
})
.then(data=>{
    setSemester(data);

})
.catch(err=>{
    console.log(err);
})
}

const allEnseignant = ()=>{
fetch(API_URL+'/admin/Module/allEnseignant.php')
.then(res=>{
    if(res.status ===200)
        return res.json();
    else 
        return []
})
.then(data=>{
    setEns(data);
    console.log(data);
})
.catch(err=>{
    console.log(err);
})
}
const DeleteModule= (id_module)=>{
    fetch(API_URL+'/admin/Module/suppression.php?id_module='+id_module)
    .then(res=>{
        if(res.status===200){
            setModule(module.filter(S=> S.id_module !== id_module));
            dispatch(setNotificationOn({
                message: ' Suppression avec succés',
                time: 3000,
                type:"succes" 
            }))
        }
        else{
            dispatch(setNotificationOn({
                message: "Echec de suppression",
                time: 3000,
                type:"error" 
            })) 
        }
    })
    .catch(err=> console.log(err));
}
const onModefier=(id_module)=>{
    open_modale()
    const mod= module.filter(S => S.id_module === id_module)[0];
    if(mod){
        console.log(mod);
        const form = formElement.current
            form.id_module.value = mod.id_module ;
            form.id_semester.value = mod.id_semester ; 
            form.nom_module.value = mod.nom_module ; 
            form.id_enseignant.value = mod.cin;

         
            form.querySelector('.id_semester').removeAttribute('hidden','');
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
    initializeForm();
   
    open_modale();
    setOperation('ajouter')
    const form = formElement.current ; 
    form.id_semester.value = id ;
    form.querySelector('.id_semester').setAttribute('hidden','');
}
const initializeForm = () => {     
    formElement.current.querySelectorAll('input, select').forEach(i => {
        if(i.name !== 'operation')
            i.value = '';
    })
      
        
}
const onClose = ()=>{
    const modale = document.querySelector('.modal-overlay');
    modale.classList.remove('open-modal');
}

   // data table  
const columns= [
    {
        name : 'module',
        selector: row=>row.nom_module ,
        sortable: true ,
    },
    {
        name : 'Semester',
        selector: row=>row.nom_semester ,
        sortable: true ,
    },
    {
        name : 'Enseignant',
        cell : row => (<div>
                    <span>{row.nom_ens} </span> 
                    <span>{row.prenom}</span>
            </div>)
    },
   
    {
        name : 'action',
        cell : row => (<div>
            <button style={{ marginRight: '15px' }} onClick={()=>DeleteModule(row.id_module)}  className='btn-delete-ens' ><i className="fas fa-trash-alt"></i></button>
            <button onClick={() => onModefier(row.id_module)}className="btn_modifier btn-update-ens "><i className="fas fa-user-edit"></i></button>
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
    return ( 
        < div className="module-admin">

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
                        defaultSortField={'module'}
                        striped
                        pagination
                    />
                </div>
                 
                                   
                            
                            <div className="modal-overlay ">
                            <div className="modal-container">
                                <form  className="formulaire" ref={formElement} onSubmit={HandlSubmit}>
                                    <div>
                                    </div>
                                    <input type="text" name="operation" defaultValue={operation}  hidden/>

                                    <div className="input-box">
                
                                        <input type="text" name="nom_module" required/>
                                        <label >Nom Module</label>
                                    </div>
                                    <div className="input-box">
                
                                       
                                    </div>
                                    <label className="label-select" > Enseignant</label>    

                                    <select name="id_enseignant" className="select-inp" >
                                        {
                                            Ens.map((E,i)=>(
                                                <option key={i} value={E.cin} >{E.nom} {E.prenom}</option>
                                            ))
                                        }
                                    </select>
                                    <label hidden className="id_semester"> Semestre</label> 
                                    <select hidden className="selectEns id_semester" name="id_semester">
                                        {
                                            semester.map((S,i)=>(
                                                <option key={i} value={S.id_semester}>{S.nom}</option>
                                            ))
                                        }
                                    </select>
                                    <input type="text" name="id_module" hidden />
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
 
export default SM_Modules;
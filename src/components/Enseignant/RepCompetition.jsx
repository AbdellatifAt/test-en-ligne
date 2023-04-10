import { useState } from "react";
import { useEffect } from "react";
import { API_URL } from "../../ApI/api";
import DataTable from "react-data-table-component";
import FilterComponent from "../dataTable/FilterComponent";
import './problem.css'


const RepCompetition =({id_comp , setResCompetition}) => {

    const [repCompetition , setRepCompetition] = useState([]);

// data table
const [filteredItems, setFilteredItems] = useState([])
    
const [filterText, setFilterText] = useState("");
const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
useEffect(() => {
        
    setFilteredItems( repCompetition.filter(
        item =>
          JSON.stringify(item)
            .toLowerCase()
            .indexOf(filterText.toLowerCase()) !== -1
      ))


}, [filterText,repCompetition]);
// data table

    useEffect(()=>{
             // //
             fetch( API_URL+'/Enseignant/Competition/Resultat_competition.php?id_comp='+id_comp)
             .then(res=>{
                 if(res.status === 200 ){
                     return res.json() 
                 }
                 else{
                     return [];
                 }
     
             })
             .then(data =>{
                 console.log('resultat');
                 console.log(data);
                 setRepCompetition(data);
                
             })
             .catch(err=>{
                 console.log(err);
             })
             // //
    },[]);

    const HandlSubmit=async(e)=>{
        e.preventDefault();
        const formData = new FormData(e.target);
        try{
            let res = await fetch(API_URL+'/Enseignant/Competition/NoteCompetition.php',{
                method:'POST' , 
                body:formData 
            });
            let resJson = await res.json();
            if(res.status === 200){
                // setEtud([...Etud,resJson]);
                console.log(resJson);
                // cls.click();

            }
            else{
                console.log(resJson);
            }
        }catch(err){
            console.log(err);
            // dispatch(setNotificationOn({
            //     message: "Echec d'insertion",
            //     time: 3000,
            //     type:"error" 
            // })) 
        }
    }

// data table  
       const columns= [
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
            name : 'reponses',
            cell : row => (<div>
                        {
                            row.result.map((P,i)=>{
                                return <a className="link_reponse_problem" key={i} href={API_URL+P.Reponse_problem} target='_blank'>problem{i+1}  </a>
                            })
                        }
                </div>)
        },
        {
            name : 'Note competition',
            cell : row => (<div>
                       <form onSubmit={HandlSubmit} className="form_content_note" >
                        {
                            row.note_comp ==='-1' && <input className="inputNote" type="text" name="note_comp" />
                        }
                        {
                            row.note_comp !=='-1' &&
                            <input type="text"  className="inputNote"  name="note_comp" defaultValue={row.note_comp} />
                        }
                            <input hidden type="text" name="cne" value={row.cne} readOnly />
                            <input hidden type="text" name="id_comp" value={id_comp} readOnly/>
                            <button className="btn_save_note"><i className="fas fa-save"></i></button>
                       </form>
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
const go_back = ()=>{
    setResCompetition(false);
}


    return ( 
        <div>
            { repCompetition.length >0 &&
                <DataTable
                customStyles={customStyles}

                columns={columns}
                data={filteredItems}
                defaultSortField={'score'}
                striped
                pagination
                />
            }
             <div className="btn-validation-test-etud">
                            <button style={{right:'70px',backgroundColor:'#ccc'}} onClick={go_back}  className="btn_back">
                                <span className="btn-text-one">Go</span>
                                <span className="btn-text-two">Back</span>
                            </button>
            </div>  
                        
        </div>
     );
}
 
export default RepCompetition;
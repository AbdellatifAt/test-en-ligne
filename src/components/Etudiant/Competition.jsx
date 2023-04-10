import { useEffect, useState } from "react";
import { API_URL } from "../../ApI/api";
import DataTable from "react-data-table-component";
import FilterComponent from "../dataTable/FilterComponent";
import './Competition.css' 
import { Link } from "react-router-dom";
//  redaux
import { useSelector,useDispatch } from 'react-redux';
import { setUser } from '../../redux/user/user.actions';
// redux

const Competition = () => {
    //redux
    const user = useSelector(state => state.user);
    const dispatch = useDispatch()
    //redux
    const cne =user.userInfos.id ;
    const [competition , setCompetition] = useState([])
    const [condidate , setCondidate] = useState([]) ; 
    const [date ,setDate] = useState();

    // data table
const [filteredItems, setFilteredItems] = useState([])
    
const [filterText, setFilterText] = useState("");
const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
useEffect(() => {
        
    setFilteredItems( condidate.filter(
        item =>
          JSON.stringify(item)
            .toLowerCase()
            .indexOf(filterText.toLowerCase()) !== -1
      ))


}, [filterText,condidate]);
// data table

    useEffect(()=>{
        fetch( API_URL+'/Etudiant/AllCompetition.php?cne='+cne)
        .then(res=>{
            if(res.status === 200 ){
                return res.json()
            }
            else{
                return [] ;
            }
        })
        .then(data =>{
            console.log(data);
            setCompetition(data)
            
///// 
        fetch( API_URL+'/Etudiant/condidat.php?cne='+cne)
        .then(res=>{
            if(res.status === 200 ){
                return res.json()
            }
            else{
                return [] ;
            }
        })
        .then(data =>{
            console.log(data);
            setDate(new Date().getTime() );
            setCondidate(data)    
        })
        .catch(err=>{
            console.log(err);
        })


///
 
            
        })
        .catch(err=>{
            console.log(err);
        })

    },[])

    const HandlSubmit= async (e)=>{
        e.preventDefault();
        const formData = new FormData(e.target);
        console.log(Object.fromEntries(formData));
       
            try{
             
                let res = await fetch(API_URL+'/Etudiant/Condidateur.php',{
                    method:'POST' , 
                    body:formData 
                });
                let resJson = await res.json();
                    if(res.status === 200){
                        
                        console.log(resJson);
                        await setCondidate([...condidate , resJson]) ;

                        await setCompetition(
                            competition.filter(C=> C.id_comp !== resJson.id_comp)
                        );
                         
                    }
                    else{
                        console.log(resJson);
                    }
           }
           catch(err){

               console.log(err);
           }     
        } 
    // data table  
    const columns= [
       
         {
            name : 'Competition',
            cell : row => (<div>
               {
                   <div className="content_comp_td"> 
                       <div>{row.nom_comp }     
                        </div>
                       {
                            date && date >= new Date(row.date_comp).getTime() && date <= new Date(row.date_exp).getTime() &&row.etat==="1"   && 
                            <div> 
                                
                                <div className="btn-start-etud">

                                <button  >
                                <Link to ={`/Etudiant/Competition/PasserCompetition/`+row.id_comp}>
                                <span>Lancer </span>
                                <i className="fas fa-arrow-circle-right"></i>
                                </Link>
                                </button>
                                </div>
                            </div>
                       }

                   </div>
                  
                    
               }
                </div>)
        },
        {
            name : 'date competition',
            selector: row=>row.date_comp ,
            sortable: true ,
        },
        {
            name : 'etat',
            cell : row => (<div>
                {
                    row.etat === '0' &&
                    <>
                        <div>En attente...</div>
                    </>
                }
                {
                    row.etat === '1' && row.valide_comp==='0' && 
                    <>
                   <div style={{color:'green' ,}}> Admet</div>
                    </>
                }
                {
                     row.etat === '-1' && 
                     <>
                    <div style={{color:'red'}}> Rejeter</div>
                     </>

                }
                {
                     row.etat === '1' &&  row.valide_comp==='1' && 
                     <>
                     <div style={{color:'#ccc'}}>Valider</div>
                     </>
                }
                
                </div>)
        },
        {
            name : 'note',
            cell : row => (<div>
                
                {
                    row.note_comp !=='-1' && 
                    <>
                        <div>{row.note_comp}</div>
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
    //data table

    return ( 
        <div className="Competition_Etud">
            
           
           <div className="Container_data_table_competition">
                <DataTable
                     customStyles={customStyles}
                            
                    columns={columns}
                    data={filteredItems}
                    defaultSortField={'score'}
                     striped
                    pagination
                />
           </div>

           {
               competition.length >0 && 
               <div>
                   {
                       competition.map((C,i)=>{
                           return <div className="Invitation_comp" key={i}>
                               <form onSubmit={HandlSubmit} >
                                     <p>Compétition <span className="span_invit_comp">{C.nom_comp}</span> organisé à la date
                                      <span className="span_invit_comp"> { C.date_comp}</span>,
                                         concernant les modules 
                                         { C.module.map((M,i)=>{
                                         return <span className="module_invetation_comp" key={i}> { M.nom_module} { i <C.module.length-1  && <span> ,</span>} </span>
                                     })}
                                     
                                         </p>
                                <input hidden type="text" name="id_comp" value={C.id_comp}  readOnly/>
                                    <input hidden type="text" name="cne" value={cne} readOnly />
                                   <div className="content_btn_inv"> 
                                   <button>
                                        <span>Participer</span>
                                    </button>
                                   </div>
                                </form>
                           </div>
                       })
                   }
               </div>
           }
        </div>
     );
}
 
export default Competition;
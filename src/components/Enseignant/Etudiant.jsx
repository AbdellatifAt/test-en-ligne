import { useEffect , useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../ApI/api";
import DataTable from "react-data-table-component";
import FilterComponent from "../dataTable/FilterComponent";
const Etudiant = () => {
    const { id_module } = useParams()

const [Etud , setEtud] = useState([]);

// data table
const [filteredItems, setFilteredItems] = useState([])
    
const [filterText, setFilterText] = useState("");
const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
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
    fetch(API_URL+'/Enseignant/Module/Etudiant.php?id_module='+id_module)
    .then(res=>{
        if(res.status===200)
            return res.json();
        else{
            return [];
        }
    })
    .then(data=>{
        console.log(data);
        setEtud(data);
    })
    .catch(err=>{
        console.log(err);
    })
},[]);

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
        name : 'score',
        selector: row=>row.score ,
        sortable: true ,
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
        <div className="Etudiant_ENS">
                 
            <div style={{padding:' 0 20px '}}>
            <div style={{display:'flex' , width:'100%' , marginBottom:'10px', justifyContent:'space-between'}}>
        <FilterComponent
            onFilter={event => setFilterText(event.target.value)}
            onClear={handleClear}
            filterText={filterText}
        />
        
            </div>

                <DataTable
                customStyles={customStyles}
            
                columns={columns}
                data={filteredItems}
                defaultSortField={'score'}
                striped
                pagination
            />
        </div>
           
        </div>
     );
}
 
export default Etudiant;
import Navbar from "../Navbar/Navbar";

// const Home = () => {
//     return ( 
//         < div className="home-admin">
//            <h1>home Enseignant !!!!!!!!!!</h1>
//         </div>);
// }

// export default Home;

import { useEffect } from "react";
import { useState } from "react";
import { API_URL } from "../../ApI/api";
import './home.css'
import CanvasJSReact from "../../assets/canvasjs-3.6.4/canvasjs.react"
//  redaux
import { useSelector,useDispatch } from 'react-redux';
import { setUser } from '../../redux/user/user.actions';
// redux

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Home = () => {
     //redux
     const user = useSelector(state => state.user);
     const dispatch = useDispatch()
     //redux
   const [statique , setStatique] = useState(null);
   const [etudiantsParModule,setEtudiantsParModule]= useState(null);
   const [options,setOptions]= useState(null);
   const [staticNoteGeneral,setStaticNoteGeneral] = useState(null);
   const cin = user.userInfos.id;
   const [options1,setOptions1]= useState(null);
   const [staticTest,setStaticTest]=useState(null);
   useEffect(()=>{
      fetch(API_URL+'/Enseignant/statistic/total_etud_par_ens.php?cin='+cin)
      .then(res=>{
          if(res.status ===200)
              return res.json();
          else 
          return null;
      })
      .then(data=>{
         setStatique(data);
         
         console.log(data);
         fetch(API_URL+'/Enseignant/statistic/etud_chaque_module.php?cin='+cin)
         .then(res=>{
             if(res.status ===200)
                 return res.json();
             else 
             return []
         })
         .then(data=>{
            setEtudiantsParModule(data);
            
            console.log(data);
            // get all note 
            fetch(API_URL+'/Enseignant/statistic/static_general_des_test.php?cin='+cin)
            .then(res=>{
                if(res.status ===200)
                    return res.json();
                else 
                return null
            })
            .then(data=>{
               setStaticNoteGeneral(data);
               console.log(data);
               //static de nombre des etdiants et nombre detest de enseignant
            fetch(API_URL+'/Enseignant/statistic/static_nb_etud_de_chaque_ens.php?cin='+cin)
            .then(res=>{
                if(res.status ===200)
                    return res.json();
                else 
                return null
            })
            .then(data=>{
               setStaticTest(data);
               console.log(data);
      
            })
            .catch(err=>{
                
                console.log(err);
            })
               //
      
            })
            .catch(err=>{
                
                console.log(err);
            })
            //
   
         })
         .catch(err=>{
             
             console.log(err);
         })

      })
      .catch(err=>{
          
          console.log(err);
      })
},[]);


   useEffect(() => {
      if (etudiantsParModule) {
         var opt = {
            // exportEnabled: true,
            animationEnabled: true,
            data: [
               {
                  type: "pie",
                  startAngle: 20,
                  toolTipContent: "<b>{label}</b>: {y}%",
                  showInLegend: "true",
                  legendText: "{label1}",
                  indexLabelFontSize: 16,
                  indexLabel: "{label} - {y}%",
                  dataPoints: etudiantsParModule.map((elem) => {
                     var col = `rgb(
                        ${Math.floor(Math.random() * 138 + 117)},
                        ${Math.floor(Math.random() * 138 + 117)},
                        ${Math.floor(Math.random() * 138 + 117)}
                     )`;

                     return ({
                        y: Math.floor((elem.nb_etud / statique.nb_etud) * 100),
                        label: elem.nb_etud ,
                        color: col,
                        label1: elem.nom_module ,
                     })
                  }),
               },
            ],
         };
         setOptions(opt)
    
         
      }
   }, [etudiantsParModule])
//
useEffect(() => {
   if (staticNoteGeneral && staticNoteGeneral.total>0) {
      var opt = {
         // exportEnabled: true,
         animationEnabled: true,
         data: [
            {
               type: "pie",
               startAngle: 75,
               toolTipContent: "<b>{label}</b>: {y}%",
               showInLegend: "true",
               legendText: "{label}",
               indexLabelFontSize: 16,
               indexLabel: "{label1} - {y}%",
               dataPoints:[
                   {
                        y: Math.floor((staticNoteGeneral.non_valide /staticNoteGeneral.total ) * 100),
                        label:'non validé' ,
                        color: '#F0F0F0',
                        label1: staticNoteGeneral.non_valide
                   }, 
                   {
                       y: Math.floor((staticNoteGeneral.valide/ staticNoteGeneral.total) * 100),
                       label:'validé' ,
                       color: 'cornflowerblue',
                       label1:staticNoteGeneral.valide 
                   },   
               ],
               
            },
         ],
      };
      setOptions1(opt)
 
      
   }
}, [staticNoteGeneral])
//
  
    return ( 
      
        <div className="home-admin">
        <div>
         {staticTest && 
          <div className="statique_admin">
            <div> <span>{staticTest.nb_total_etud}</span> Nombre total des étudiants </div>
            <div> <span> {staticTest.nb_total_test}</span>Nombre de tests créés </div>
            <div> <span> {staticTest.nb_module_ens} </span>Nombre de modules enseignés </div>

          </div>
        }
        <div className="content_next_test">
        {staticTest && staticTest.test && 
        <div className="date_recent_test">Le test associé au chapitre <span>  { staticTest.test.nom_chap } </span>  expirera le <span>{ staticTest.test.date_exp }</span></div>       
            }
       </div>
        </div>
         <div className="container-home_ens">
           { options && options1 && 
           <div className="staticContent1">

               <div className="statique_etud_sem">
               <div className="tittle_static"> <span>titre</span>  : Nombre des étudiants par rapport à chaque module </div>
               <CanvasJSChart
                  options={options}
                  /* onRef={ref => this.chart = ref} */
                  />
               <div className="canvasdelete"></div>
               </div>



               <div className="statique_etud_sem">
               <div className="tittle_static"> <span>titre</span>  : Statistiques des tests </div>

               <CanvasJSChart
                  options={options1}
                  /* onRef={ref => this.chart = ref} */
                  />
               <div className="canvasdelete"></div>
               </div>

               
            </div>
             }
      
       </div>
        </div>
    );
}

export default Home;




import { useEffect } from "react";
import { useState } from "react";
import { API_URL } from "../../ApI/api";
import CanvasJSReact from "../../assets/canvasjs-3.6.4/canvasjs.react"
import Calendrier from "../Calendrie/DatePicker";
import './Home.css'

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Home = () => {
   const [statique , setStatique] = useState([]);
   const [etudiantsParSemestere,setEtudiantsParSemestere]= useState(null);
   const [options,setOptions]= useState(null);



   useEffect(()=>{
      fetch(API_URL+'/admin/satistique/statistique.php')
      .then(res=>{
          if(res.status ===200)
              return res.json();
          else 
          return [];
      })
      .then(data=>{
         setStatique(data);
         
         console.log(data);
         fetch(API_URL+'/admin/satistique/statiqueGlobal.php')
         .then(res=>{
             if(res.status ===200)
                 return res.json();
             else 
             return []
         })
         .then(data=>{
            setEtudiantsParSemestere(data);
            
            console.log(data);
   
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
      if (etudiantsParSemestere) {
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
                  dataPoints: etudiantsParSemestere.map((elem) => {
                     var col = `rgb(
                        ${Math.floor(Math.random() * 138 + 117)},
                        ${Math.floor(Math.random() * 138 + 117)},
                        ${Math.floor(Math.random() * 138 + 117)}
                     )`;

                     return ({
                        y: Math.floor((elem.nb_etud / statique[0].nb_etud) * 100),
                        label: elem.nom,
                        color: col,
                        label1:elem.nb_etud,
                     })
                  }),
               },
            ],
         };
         setOptions(opt)
    
         
      }
   }, [etudiantsParSemestere])

  
    return ( 
        <div className="home-admin">

    
            {
               statique.length>0 &&  
               <div className="statique_admin">
                 <div><span>{ statique[0].nb_etud }</span> Nombre étudiants   </div>
                 <div><span>{ statique[1].nb_ens }</span> Nombre enseignants  </div>
                 <div> <span>{ statique[2].nb_test}</span> Nombre tests  </div>
             
            </div>
            }
         
           { options  &&
           <div className="staticContent">

            <div className="Calendrier__graphe">
                  
                  <div className="statique_etud_sem">
                  <div className="tittle_static"> <span>titre</span>  : Nombre des étudiants dans chaque semestre </div>
                  
                  <CanvasJSChart 
                     options={options}
                     /* onRef={ref => this.chart = ref} */
                     />
                  <div className="canvasdelete"></div>
                  </div>
               <div> <Calendrier/> </div>
            </div>
              
               </div>
            }
      

        </div>
    );
}

export default Home;



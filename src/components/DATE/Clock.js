import React, { useState  } from "react";
import { API_URL } from "../../ApI/api";
const Clock = ({ deadline ,setQuest ,setEndTime ,setResTest ,cne , id_chap }) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [fin_test , setFin_Test] = useState(true)

  const getTimeUntil = () => {

          const time = deadline - Date.parse( new Date() );
          //const time = Date.parse(deadline) - Date.parse(new Date());
   
          if (time < 0) {
            if(setQuest){

              setQuest(null)
            }
            if(setEndTime){
              setEndTime(false)

            }
            if(setResTest && cne && id_chap && fin_test){
              fetch(API_URL+'/Etudiant/Resultat.php?id_chap='+id_chap+'&cne='+cne)
              .then(res=>{
                if(res.status ===200)
                  return res.json();
                else
                 return []
               
              })
              .then(data=>{
                console.log("resultat test :");
                  console.log(data);  
                 setResTest(data)                 
              })
              .catch(err=>{
                  console.log(err);
              })
              setFin_Test(false)

            }
           
            setDays(0);
            setHours(0);
            setMinutes(0);
            setSeconds(0);
            } else {
                setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
                setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
                setMinutes(Math.floor((time / 1000 / 60) % 60));
                setSeconds(Math.floor((time / 1000) % 60));
            }
        
  };
  

  setTimeout(() => {
    //console.log('calculer ...');
    getTimeUntil()
  }, 1000)

  const finTest = ()=>{


  }

  // function handleSaveClick() { list.push(item) } return ( <childComponent handleSave={handleSaveClick} /> );
        


  return (
    <div>
      <div className="Clock-days">{days} Days : {hours} Hours : {minutes} Minutes : {seconds} Seconds</div>
     
    </div>
  );
};

export default Clock;

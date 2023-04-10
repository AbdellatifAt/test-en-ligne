import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../ApI/api";
import './test.css'
import Clock from '../DATE/Clock' 
import { hasPointerEvents } from "@testing-library/user-event/dist/utils";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import { setNotificationOn } from "../../redux/notification/notification.actions";

//  redaux
import { useSelector,useDispatch } from 'react-redux';
import { setUser } from '../../redux/user/user.actions';
// redux
const Test = () => {
     //redux
     const user = useSelector(state => state.user);
     const dispatch = useDispatch()
     //redux
    const cne = user.userInfos.id;
    const {id_chap} = useParams();
    const [question , setQuestion] = useState();
    const [Quest , setQuest]  =useState();
    const  [testIslanced ,setTestIsLanced] = useState(false) ; 
    const [date , setDate] = useState(null);
    const [date2 ,setDate2] =useState(null)
    const [endTest , setEndTest] = useState(false);
    const [endTime , setEndTime] = useState(true)
    const history= useHistory();
    const [note , setNote] = useState(null);

    const [resTest , setResTest] = useState(null);


     useEffect(()=>{


        //
        fetch(API_URL+'/Etudiant/testIsLanced.php?id_chap='+id_chap)
        .then(res=>{
            return res.json();
        })
        .then(data=>{
            console.log("test lanced");
            console.log(data);  
            setTestIsLanced(data)

            if(data === true){
                fetch( API_URL+'/Etudiant/Test.php?id_chap='+id_chap+'&cne='+cne)
                .then(res=>{
                    if(res.status === 200 ){
                        return res.json()
                    }
                    else{
                        return false;
                    }
                })
                .then(data =>{
                    console.log('data');
                    console.log(data);
                    setQuestion(data);
                    if(data.length >0 ){
                        setTestIsLanced(true);
                        setQuest(data[Math.floor(Math.random() * data.length )]);
                    }
                    else{      
                         setQuest(false)
                      
                    }
        
        
                    fetch(API_URL+'/Etudiant/getDate_test.php?id_chap='+id_chap)
                    .then(res=>{
                        return res.json();
                    })
                    .then(data=>{
                        console.log(data);  
                        setDate( new Date(data.date_exp).getTime() ); 
                        setDate2(  new Date(data.date_exp).getTime() - Date.parse(new Date()) );
                    
                       
                    })
                    .catch(err=>{
                        console.log(err);
                    })
            
                        //
                })
                .catch(err=>{
                    console.log(err);
                })
        
            }
           
        })
        .catch(err=>{
            console.log(err);
        })
        //
        



    
    },[id_chap])

    useEffect(()=>{
        fetch(API_URL+'/Etudiant/Test_passer.php?id_chap='+id_chap+'&cne='+cne)
        .then(res=>{
            return res.json();
        })
        .then(data=>{
            console.log("test_passer");
            console.log( data);
            setNote(data.note);

        })
        .catch(err=>{
            console.log(err);
        })

    },[id_chap,cne])

    const ajouter_repose = async(e)=>{
        e.preventDefault();
        const formData = new FormData(e.target);
        
        console.log(Object.fromEntries(formData));
       
                try{
                    let res = await fetch(API_URL+'/Etudiant/insertReponse.php',{
                        method:'POST' , 
                        body:formData 
                    });
                    let resJson = await res.json();
                    const init = document.querySelector('#reset_question_etud');
                    init.click();
                        if(res.status === 200){
                            
                            const data = question.filter( Q=> Q.id_quest !== resJson)                            
                            if(data.length >0){
                                
                                setQuest(data[Math.floor(Math.random() * data.length )])
                            }
                            else{
                                setQuest(null);
                            }

                            setQuestion(data);
                            
                        }
                        else{
                            console.log(resJson);
                        }
               }
               catch(err){
                   console.log(err);
               }
    
     }


const endTestfn = ()=>{
    setEndTest(true);
}
const ValiderTest = async()=>{
    fetch(API_URL+'/Etudiant/fintest.php?id_chap='+id_chap+'&cne='+cne)
    .then(res =>{
        return res.json();
    })
    .then(data=>{
        //console.log(data);
        history.push('/Etudiant/module/chapitre/'+data);
        setEndTest(false);
    })
    .catch(err=>{
        console.log(err);
        dispatch(setNotificationOn({
            message: 'Test non validé ',
            time: 3000,
            type:"error" 
        })) 
    })

    
}
const goBack = ()=>{
    history.go(-1);
}



        return (
            <div>
                  {
                (
                    !endTime && resTest && testIslanced &&
                
                    <div  className="container_All-questions">
                        
                    <div className="ALL_Questions_ENS">
                        {
                            note && note>=10 &&
                        <h1>Votre note : <span style={{color:'green'}}>{note}/20</span></h1>
                        }
                        {
                            note && note<10 &&
                        <h1>Votre note : <span style={{color:'red'}}>{note}/20</span></h1>
                        }
                      {
                          resTest.map(((Q , i)=>{
                            return (
                                <div key={Q.id_quest} className="Question-test">
                                      <h1>{Q.quest} </h1>
                                  
                                  {
                                       Q.choix.map((ch ,i)=>{

                                         
                                          if(ch.choix_correct ==='1' ){
                                            return   <div className="choix_corr Question-option" key={i}>
                                              {
                                                 ch.choix
                                              }
                                             </div>
                                        }
                                         if(ch.choix_correct ==='0' && Q.rep_etud.some(item => item.id_choix === ch.id_choix) ){
                                             return <div className="choix_Incorr Question-option" key={i}>
                                              {
                                                  ch.choix
                                              }
                                             </div>
  
                                        }
                                          else{
                                              return <div className="choix_null Question-option" key={i}>
                                              {
                                                  ch.choix
                                              }
                                             </div>
                                              
                                        }
                                      })
                                  }    
                                </div>

                                )
                                
                                
                            }))
                        }
                    
                  
                        </div>
                        </div>
                    
                )
            }

            
        <div className="content-test-etud">
              {
                testIslanced && endTime &&
                date && <div className="cmp-date-etud"><Clock deadline={date} setQuest={setQuest} setEndTime={setEndTime} setResTest={setResTest} cne={cne} id_chap={id_chap} /> </div>
              } 


            {

                (Quest  && question && testIslanced &&
                    <div className="Question_content_etud">
                         <h1>{Quest.quest} </h1>
                         <form onSubmit={ajouter_repose} className="form-question-etud" >
                         {
                          Quest.choix.map((ch , j)=>{
                             return <div key={j} className="choix_question_etud"> 
                             <input type="checkbox" name="testChoix[]" value={ch.id_choix} id={j}/> <label htmlFor={j}> {ch.choix}</label>
         
                         </div>
                                                 })
                                             }
         
                          <div className="btn-next-etud">
                              <input type="text" name="cne" value={cne} readOnly  hidden/>
                              <input type="text" name="id_quest" value={Quest.id_quest} readOnly hidden/>
                        {
                             question.length !==1 && 
                                 <button   type='submit'>
                                    <span>Next</span>
                                    <i className="fas fa-arrow-circle-right"></i>
                              </button>
                        }
                          

                            {
                                question.length === 1 &&
                                <button onClick={endTestfn}  type='submit'>
                                <span>Next</span>
                                <i className="fas fa-arrow-circle-right"></i>
                                </button>
    
                            }
                          </div>
                          <input hidden type="reset"  value="reset" id="reset_question_etud" />
                        
                          
                         </form>
         
                    </div>
                 )
            }
            {
                ( !Quest  && endTime && testIslanced &&
                    <div className="fin_test">
                        <p>fin de test ! <span><i classame="fas fa-check-circle"></i></span></p>

                      {
                           (
                            endTest && 
                            <div className="btn-validation-test-etud">
                                <button   onClick={ValiderTest} className="valide_btn-etud" ><span>Valider</span></button>
                            </div>
                        )
                      }
                    </div>
                    
                )
               
            }
         
            {
                !testIslanced && 
                
                <div style={{backgroundColor:'#B4CBCB'}} className="fin_test ">
                <div> le test n'est pas oncore lancer! <div className="btn_loading_etud"  >
                    <div className="spinner">
                    <span></span>
                    <span></span>
                    <span></span>
                    </div></div>
                </div>

             
                    <div className="btn-validation-test-etud">
                    <button onClick={goBack} className="btn_back">
                        <span className="btn-text-one">Go</span>
                        <span className="btn-text-two">Back</span>
                    </button>
                    </div>
                
            </div>
                
            }
           
           
           
        </div>
      
        </div>
      );
}
 
export default Test;

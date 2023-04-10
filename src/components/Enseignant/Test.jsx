import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../ApI/api";
import './test.css'
import Clock from '../DATE/Clock' 
import { AiFillDelete } from "react-icons/ai";
import {GrAddCircle} from "react-icons/gr"

import { IconContext } from "react-icons";
import CanvasJSReact from "../../assets/canvasjs-3.6.4/canvasjs.react"

import { useDispatch } from "react-redux";
import { setNotificationOn } from "../../redux/notification/notification.actions";



//  redaux
import { useSelector } from 'react-redux';
import { setUser } from '../../redux/user/user.actions';
// redux
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Test = () => {
      //redux
      const user = useSelector(state => state.user);
      const dispatch = useDispatch()
      //redux

    const {id_chap} = useParams();
    const [question , setQuestion ] = useState([]);
    
    const [id_test ,  set_IDTest] = useState()
    
    const [nbOPtion , setnbOption] = useState(1)
    const formulaire = useRef();
    const formElement = useRef();
    const [testIslanced , setTestIsLanced ] = useState(false);
    const [errorChangeTime , setErrorChangeTime] = useState('');
    const [date_inc , setDateInc] = useState({});
    const [timeExp , setTimeExp] =useState(true);
    const [dd , setDd] = useState();

    const [importTest , serImportTest] = useState(false);
    const [ errorAjouteQ,setErrorAjouteQ] = useState(null);

    const cin = user.userInfos.id;
    const [statique , setStatique] = useState(null) ; 
    const [options,setOptions] = useState(null)
    const [endTime , setEndTime] = useState(true)
    

    useEffect(()=>{
        fetch(API_URL+'/Enseignant/Test/getIDtest.php?id_chap='+id_chap)
        .then(res=>{  
            if(res.status===200)
               return res.json();
           
               
        })
        .then(data =>{
            console.log(data);
            set_IDTest(data);
            console.log("id_test " ,data);
            // question
            fetch(API_URL+'/Enseignant/Test/Questions.php?id_test='+id_test)
            .then(res=>{  
                if(res.status===200)
                   return res.json();
                else{
                    return [] ;
                }
                
            })
            .then(data =>{
                console.log(data);
                setQuestion(data);
                // test is lancer
                fetch(API_URL+'/Enseignant/Test/teest_is_lansed.php?id_test='+id_test)
                .then(res=>{
                    return res.json();
                })
                .then(data=>{
                    setTestIsLanced(data)
                    console.log(data);
                   
                    console.log(testIslanced);
                    // date
                    fetch(API_URL+'/Enseignant/Test/getDate_test.php?id_test='+id_test)
                    .then(res=>{
                        return res.json();
                    })
                    .then(data=>{
                       
                     console.log('new date' , new Date(data.date_exp).getTime());
                     
                     setDd( new Date(data.date_exp).getTime() );
                     console.log(dd);
                      //  statistique

                      fetch(API_URL+'/Enseignant/statistic/stattic_test.php?id_test='+id_test+'&id_chap='+id_chap+'&cin='+cin)
                      .then(res=>{
                        if(res.status === 200) 
                          return res.json();
                        else
                          return [];
                      })
                      .then(data=>{
                          setStatique(data) ;
                          console.log(data);
                       
                      })
                      .catch(err=>{
                          console.log(err);
                      })
                         
                      // statistique   
                     

                     
                     
                    })
                    .catch(err=>{
                        console.log(err);
                    })
                    // date
                   
                })
                .catch(err=>{
                    console.log(err);
                })
                // test lancer
            
            })
            .catch(err=>{
                console.log(err);
            })
            // question

          
        })
        .catch(err=>{
            console.log(err);
        })
    },[id_chap ,id_test,cin])

    useEffect(() => {
        if (statique) {
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
                             y: Math.floor((statique[1].nb_etud_valide /statique[0].nb_total ) * 100),
                             label:' validé' ,
                             color: 'green',
                             label1: statique[1].nb_etud_valide
                        }, 
                        {
                            y: Math.floor((statique[2].nb_etud_non_valide/statique[0].nb_total ) * 100),
                            label:' non validé' ,
                            color: '#ccc',
                            label1: statique[2].nb_etud_non_valide 
                       },
                       {
                        y: Math.floor(( (statique[0].nb_total - statique[2].nb_etud_non_valide -statique[1].nb_etud_valide)  /statique[0].nb_total ) * 100),
                        label:'raté' ,
                        color: 'red',
                        label1: (statique[0].nb_total - statique[2].nb_etud_non_valide -statique[1].nb_etud_valide) 
                      }
                        
                      
                    ],
                    
                 },
              ],
           };
          setOptions(opt)
      
           
        }
     }, [statique])
  
 

    const HandlSubmit = async(e)=>{
        e.preventDefault();
      
         const btn_res = formulaire.current.querySelector('button[type=reset]');
        const formData = new FormData(e.target);
        console.log(Object.fromEntries(formData));
        const opperat = Object.fromEntries(formData).option ;
        if (opperat === 'ajouter') {
                try{
                    let res = await fetch(API_URL+'/Enseignant/Test/Ajouter_Question.php',{
                        method:'POST' , 
                        body:formData 
                    });
                    let resJson = await res.json();
                        if(res.status === 200){
                            setQuestion([...question,resJson]);
                            console.log(resJson);
                           btn_res.click();
                           setnbOption(1);
                           setErrorAjouteQ(null)

                           dispatch(setNotificationOn({
                            message: 'Insertion avec succés',
                            time: 3000,
                            type:"succes" 
                            })) 
                        
                            
                        }
                        if(res.status ===400){
                            setErrorAjouteQ(resJson) ;
                            dispatch(setNotificationOn({
                                message: "Echec d'insertion",
                                time: 3000,
                                type:"error" 
                            }))  
                        }
                        
                            //console.log(resJson); 
                           
                            
                        
               }
               catch(err){
                   console.log(err);
               }
            }
            else if(opperat === 'modifier') {
                
               // console.log(Object.fromEntries(formData));
            try{
                let res = await fetch(API_URL+'/Enseignant/Test/Update.php',{
                    method:'POST' , 
                    body:formData 
                });
                let resJson = await res.json();
                const form = formulaire.current ;
                    if(res.status === 200){

                        setQuestion(
                            question.map(Q=>{
                                if(Q.id_quest == resJson.id_quest){
                                    return resJson ; 
                                }
                                else{
                                    return Q ;
                                }
                            })
                        )

                        btn_res.click() ; 
                        form.submit.innerText = 'Ajouter Question';
                        setnbOption(1)

                        dispatch(setNotificationOn({
                            message: 'Modification avec succés',
                            time: 3000,
                            type:"modifier" 
                        })) 
                   
                           
                     }
                    else{
                       // console.log(resJson);

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
const Deletequestion= (id_quest)=>{
    console.log(id_quest);
    fetch(API_URL+'/Enseignant/Test/DeleteQuestion.php?id_quest='+id_quest )
    .then(res=>{
        if(res.status===200){
            setQuestion(question.filter(S=> S.id_quest !== id_quest));
            
            dispatch(setNotificationOn({
                message: 'Suppression avec succés',
                time: 3000,
                type:"succes" 
            })) 
        }
        else{
            //console.log('impossible de supprimer');
            dispatch(setNotificationOn({
                message: 'Echec de suppression ',
                time: 3000,
                type:"error" 
            })) 
        }
    })
    .catch(err=> console.log(err));
}
const onModefier= async (ques)=>{
       
        if(ques){

            await  setnbOption(ques.choix.length);
            const form = formulaire.current ; 
            console.log(form);
         
            form.question.value = ques.quest ;
            
            const inputs_Q=Array.from (form.querySelectorAll('.input_Q'));
            console.log(inputs_Q) ; 
          
            inputs_Q.forEach((inp,i)=>{
                
                inp.value = ques.choix[i].choix;
            })
            form.option.value = 'modifier';
            form.submit.innerText = 'Modifie Question';
            
            form.id_quest.value = ques.id_quest ;
            
            
        }
        

}
const ajouter_option=() =>{
    
     setnbOption(nbOPtion +1);
    }
const delete_option=()=>{
    if(nbOPtion >1){
        setnbOption(nbOPtion - 1);
    }
    
}

//modale
const open_modale=()=>{
    const modale = document.querySelector('.modal-overlay');
    modale.classList.add('open-modal');
}
const onClose = ()=>{
    const modale = document.querySelector('.modal-overlay');
    modale.classList.remove('open-modal');
}

const Lancer_test = async (e)=>{
    e.preventDefault();
    const formData = new FormData(e.target);
    const cls = document.querySelector('.close-btn');
    console.log(Object.fromEntries(formData))
    try{
        let res = await fetch(API_URL+'/Enseignant/Test/Lancer_test.php',{
            method:'POST' , 
            body:formData 
        });
        let resJson = await res.json();
            if(res.status === 200){
               // setQuestion([...question,resJson]);
              // console.log(resJson);
              // console.log('new date' , new Date(resJson.date_exp).getTime());
             
               await setDd( new Date(resJson.date_exp).getTime() );
               await setTestIsLanced(true)
             cls.click();
               //setnbOption(1);

               dispatch(setNotificationOn({
                message: 'Test Lancé',
                time: 3000,
                type:"succes" 
            }))
                
            }
            else{
                setTestIsLanced(false);
                //console.log(resJson);
                dispatch(setNotificationOn({
                    message: 'Echec du lancement du test',
                    time: 3000,
                    type:"error" 
                })) 
            }
   }
   catch(err){
       console.log(err);
   }

}
const Modifie_dure = async (e)=>{
    e.preventDefault();

   
    const cls = document.querySelector('.close-btn');
    console.log(cls);
    const formData = new FormData(e.target);
    const date_exp =Object.fromEntries(formData).date_exp;
    console.log(Object.fromEntries(formData))
    try{
        let res = await fetch(API_URL+'/Enseignant/Test/modifie_dure.php',{
            method:'POST' , 
            body:formData 
        });
        let resJson = await res.json();
            if(res.status === 200){
               
                console.log(resJson);
                console.log('new date' ,new Date(date_exp).getTime());
                setDd(new Date(date_exp).getTime())
              cls.click();
              setErrorChangeTime('');
               //setnbOption(1);
               
               dispatch(setNotificationOn({
                message: 'durée modifiée',
                time: 3000,
                type:"succes" 
            })) 
                
            }
            else{
                setErrorChangeTime('impossible')
                //console.log(resJson);
                dispatch(setNotificationOn({
                    message: 'durée non modifiée ',
                    time: 3000,
                    type:"error" 
                })) 
            }
   }
   catch(err){
       console.log(err);
   }

}

const onSubmiteTest = async (e)=>{
    e.preventDefault();

    const formData = new FormData(e.target);
    console.log(Object.fromEntries(formData))
    try{
        let res = await fetch(API_URL+'/import/creation_test.php',{
            method:'POST' , 
            body:formData 
        });
        let resJson = await res.json();
            if(res.status === 200){
               
               // console.log(resJson);
                setQuestion([...question,...resJson]);

                
                dispatch(setNotificationOn({
                    message: 'Importation avec succés',
                    time: 3000,
                    type:"succes" 
                })) 
            }
            else{
               
                //console.log(resJson);
                  dispatch(setNotificationOn({
                    message: "Echec d'importation",
                    time: 3000,
                    type:"error" 
                })) 

            }
   }
   catch(err){
       console.log(err);
   }

}
const file_import = (e)=>{
    e.preventDefault() ; 
    const file = document.querySelector('#file_import_test') ; 
    file.click();
}


    return ( 
        <div className="test_ENS">
             
            {
                testIslanced &&
                dd && <div className="cmp-date-ens"><Clock deadline={dd} setEndTime={setEndTime}/>  <button  onClick={open_modale} className="button" ><span>Changer</span></button></div>
            }
 
          {
            !testIslanced && id_test &&
            <div className="import_test">
            <form onSubmit={onSubmiteTest} encType="multipart/form-data" >
                <input hidden type="file" name="excel" id="file_import_test" />
             
                <input hidden type="text" name="id_test" value={id_test} readOnly />

                <button  onClick={file_import}  className="apload_file">
                    <div className="docs"><i className="fas fa-file-alt"></i> Docs</div>
                         <div className="download">  
                         <i className="fas fa-upload"></i>
                    </div>
                </button>
                <button   className="apload_file">
                    <div className="docs">Import</div>
                </button>

            </form>
    </div>
          }
                             
           
                 { !testIslanced && 
                 <div className="container-form">
                    
                     <div className="form_test" >
                         
                           

                            <form ref={formulaire} onSubmit={HandlSubmit} >
                                <div className="errorAjouteQ">
                                    { errorAjouteQ && 
                                         
                                         <p>{errorAjouteQ}</p>
                                    }

                                </div>
                            <textarea required  name="question" id="" cols="30" rows="10" placeholder="Ajouter question"></textarea>
                            <ul >
                                {
                                    
                                    [...new Array(nbOPtion)].map((Op , i )=>{
                                        return  <li  className="checkbox-test-ens" key={i}>  <input type="checkbox" value={i} name="opt[]" id={Op} /> <input  className="input_Q" type="text" name="values[]" /></li> 
                                    })
                                }
                            
                            </ul>
                            <div className="option-btn">  
                                 <button type="button" onClick={ajouter_option}> <GrAddCircle size='25px'/></button>
                                 <button type="button" onClick={delete_option}><AiFillDelete size='25px'   /></button>
                            </div>
                            <button type="reset" hidden> resete</button>
                            <div className="ajouter_question" >
                                  <button type="submit" name="submit">ajouter Question </button>
        
                             </div>
                             <input type="text" name="option" defaultValue='ajouter' hidden />
                             <input type="text" name="id_test" defaultValue={id_test} hidden />
                             <input type="text" name="id_quest" hidden/>
                             
       
                        </form> 
                        
                      
                        
        
                         </div> 
                 </div>
                 }
                         
                     
                            <div className="container_All-questions">
                                <div className="ALL_Questions_ENS">
                                { options &&  !endTime &&
                                    <div className="staticContentTest">
                                    <div className="canvasdelete3"></div>

                                        <div className="statique_test_ens">
                                        <CanvasJSChart
                                            options={options}
                                           
                                            />
                                   <div className="canvasdelete2"></div>

                                        </div>
                                        
                                        </div>
                               }

                              

                                  {
                                    
                                    question.map((Q , i  )=>{
                                       return (
                                       <div key={Q.id_quest} className="Question-test">
                                            <h1>{Q.quest}</h1>
                                          
                                            {
                                                Q.choix.map((ch)=>{
                                                    if(ch.choix_correct === '1'){
                                                      return   <div className="choix_correct Question-option" key={ch.id_choix}>
                                                        {
                                                            ch.choix
                                                        }
                                                       </div>
                                                    }
                                                    else{
                                                       return <div className="choix_Incorrect Question-option" key={ch.id_choix}>
                                                        {
                                                            ch.choix
                                                        }
                                                       </div>
                                    

                                                    }
                                                }
                                                    
                                                   
                                                )
                                            }
                                            <div className="btns_question">
                                                { !testIslanced &&  <button className="supp_q" onClick={()=>Deletequestion(Q.id_quest)}><i className="fas fa-trash-alt delete_quest"></i></button >
                                                }
                                                { !testIslanced &&  <button className="modi_q" onClick={()=>onModefier(Q)}><i className="fas fa-edit update_quest"></i></button> }
                                            </div>

                                       </div>)

                                       
                                  })

                                }
                                </div>
                            </div>


                            
                         <div className="btn-lancre-test">
                            { !testIslanced  && question.length>0 &&
                           <div className="btn-lancer-test">
                                <button onClick={open_modale} className="cta">
                                    <span>Lancer Le Test</span>
                                    <svg viewBox="0 0 13 10" height="10px" width="15px">
                                        <path d="M1,5 L11,5"></path>
                                        <polyline points="8 1 12 5 8 9"></polyline>
                                    </svg>
                            </button>
                           </div>
                            }
                         </div>

                         {/* modale  */}
                <div  className="modal-overlay ">
                        <div className="modal-container">
                            {
                            !testIslanced &&<form  className="formulaire" ref={formElement} onSubmit={Lancer_test}  >
                                <label >dure finale</label>
                                <div className="input-box">
                                    <input type="datetime-local" name="date_exp" />
                                </div>
                               
                                <input type="text" name="id_test" defaultValue={id_test} hidden/>
                                
                                <div>
                               <button type="submit" className="btn_modal" >
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>lancer test
                                 </button>
                       </div>
                               
                              
                            </form>
                            }
                            {testIslanced &&
                            <form  className="formulaire" ref={formElement} onSubmit={Modifie_dure}  >
                                <div className="errupdate_date_test">
                                    {errorChangeTime}
                                </div>
                                <div className="input-box">  
                                    
                                <input type="datetime-local" name="date_exp" />
                                <label >dure finale</label>
                                </div>
                                <input type="text" name="id_test" defaultValue={id_test} hidden />
                                <div>
                                <button type="submit" className="btn_modal" >
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>modifier 
                                        </button>
                                </div>
                               
                              
                            </form>
                            }

                        <button className="close-btn" onClick={onClose}><i className="fa fa-times" aria-hidden="true"></i></button>
                        </div>
                </div>
                            
           
        </div>
     );
}
 
export default Test;
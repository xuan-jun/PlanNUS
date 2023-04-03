import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './DetailedView.css';
import { Link } from 'react-router-dom';

function DetailedView({ isDetailed, setIsDetailed, date, assignmentData, modulePairAssignment, stressScoreDaily, currentModule}) {
  const [compiledData, setCompiledData] = useState([]);

  useEffect(() => {
   if (assignmentData && modulePairAssignment) {
       setCompiledData(assignmentData.concat(modulePairAssignment));
    }
  }, [assignmentData, modulePairAssignment]);

 const [stressScoreData, setStressScoreData] = useState([]);

 useEffect(() => {
  setStressScoreData(stressScoreDaily);
  },[stressScoreDaily]);

  const [currentModuleData, setCurrentModuleData] = useState([]);

  useEffect(() => {
   setCurrentModuleData(currentModule);
   },[currentModule]);

 const formattedDate = moment.isMoment(date) ? date.format("D-MMM-YY") : date

 const uniqueCompiledData = [...new Set(compiledData.map(JSON.stringify))].map(JSON.parse);

 const filteredRowData = uniqueCompiledData.filter((row) => {
   return row["Due Date"] === formattedDate
 })

 const myDueData = filteredRowData.filter((row) => {
  return row["Module Code"] === currentModuleData
 })

 const othersDueData = filteredRowData.filter((row) => {
  return row["Module Code"] !== currentModuleData
 })

 // computes the colour for the background when we have 
 let rowStyle = (stressScore) => {
   let style = "";
   // assuming higher the worse it is
   if (stressScore >= 7.5) {
     style = style.concat("stressed")
   } else if (stressScore >= 5 && stressScore <= 7.5) {
     style = style.concat("moderate")
   } else {
     style = style.concat("good")
   }
   return style;
 }

 const stressScore = stressScoreData[formattedDate]

 const detailedStyle = rowStyle(stressScore);
 return (
   <div className={`detailed-view ${isDetailed ? 'active' : 'inactive'}`}>
     {console.log(currentModuleData)}
     <div className="detailed-view-content">
       <button className="close-btn" onClick={() => setIsDetailed(!isDetailed)}>
         Return to Calendar View
       </button>
       <h2 className={`detailed-view-header ${detailedStyle}`}>
        {new Date(date).toLocaleDateString('en-GB', {day: '2-digit', month: 'long', year: 'numeric'})}
        <br></br>
        Stress Score: {stressScore ? stressScore.toFixed(2) : 0}
       </h2>
       <div>
         <table>
           <thead>
              <tr>
                <th colSpan="9" className="merged-table-header">My Assignment(s)</th>
              </tr>
              <tr className='tableHeader'>
               <th>Assignment Name</th>
               <th>Module Code</th>
               <th>Due Date</th>
               <th>Assignment Type</th>
               <th>Weightage</th>
               <th>Stress Score</th>
               <th>Action</th>
              </tr>
           </thead>
           <tbody>
             {myDueData.map((row, i) => (
               <tr key={i}>
                 <td>{row['Name']}</td>
                 <td>{row['Module Code']}</td>
                 <td>{row['Due Date']}</td>
                 <td>{row['Type']}</td>
                 <td>{row['Weightage']}%</td>
                 <td>{row['stress_score'].toFixed(2)}</td>
                 <td>
                  <Link to="/assignments">
                   <button>Edit Assignment</button>
                  </Link>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>

        <br></br>

         <table>
           <thead>
           <  tr>
                <th colSpan="9" className="merged-table-header">Other Assignment(s)</th>
              </tr>
             <tr className="tableHeader">
               <th>Assignment Name</th>
               <th>Module Code</th>
               <th>Due Date</th>
               <th>Assignment Type</th>
               <th>Weightage</th>
               <th>Stress Score</th>
               <th>Students Involved</th>
               <th>Instructor</th>
               <th>Email</th>
             </tr>
           </thead>
           <tbody>
             {othersDueData.map((row, i) => (
               <tr key={i}>
                 <td>{row['Name']}</td>
                 <td>{row['Module Code']}</td>
                 <td>{row['Due Date']}</td>
                 <td>{row['Type']}</td>
                 <td>{row['Weightage']}%</td>
                 <td>{row['stress_score'].toFixed(2)}</td>
                 <td>{row['Count']}</td>
                 <td>{row['Instructor']}</td>
                 <td>
                   <a className={"link"} href={`mailto:${row['Email']}`}>{row['Email']}</a>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     </div>
   </div>
 );
}

export default DetailedView;


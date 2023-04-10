import React, { useState, useEffect } from 'react';
import moment from 'moment';
import stressScoreColor from '../../../../../stressScoreColor';
import './DetailedView.css';

function DetailedView({ isDetailed, setIsDetailed, date, assignmentData }) {
  const [compiledData, setCompiledData] = useState([]);

  useEffect(() => {
       setCompiledData(assignmentData);
  }, [assignmentData]);

 const formattedDate = moment.isMoment(date) ? date.format("D-MMM-YY") : date

 const uniqueCompiledData = [...new Set(compiledData.map(JSON.stringify))].map(JSON.parse);

 const filteredRowData = uniqueCompiledData.filter((row) => {
   return row["Due Date"] === formattedDate
 })

 const stressScore = filteredRowData.length > 0
    ? filteredRowData.reduce((sum, row) => sum + row['stress_score'], 0)
    : null;

 const detailedStyle = stressScoreColor(stressScore);
 return (
   <div className={`detailed-view ${isDetailed ? 'active' : 'inactive'}`}>
     {console.log(stressScore)}
     <div className="detailed-view-content">
       <button className="close-btn" onClick={() => setIsDetailed(!isDetailed)}>
         Return to Calendar View
       </button>
       <h2 className={`detailed-view-header ${detailedStyle}`}>
        Assignments on {new Date(date).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'})}
        <br></br>
        Stress Score: {stressScore ? stressScore.toFixed(2) : 0}
       </h2>
       <div>
         <table>
           <thead>
             <tr>
               <th>Assignment Name</th>
               <th>Module Code</th>
               <th>Due Date</th>
               <th>Assignment Type</th>
               <th>Weightage</th>
               <th>Stress Score</th>
               <th>Instructor</th>
               <th>Email</th>
             </tr>
           </thead>
           <tbody>
             {filteredRowData.map((row, i) => (
               <tr key={i}>
                 <td>{row['Name']}</td>
                 <td>{row['Module Code']}</td>
                 <td>{row['Due Date']}</td>
                 <td>{row['Type']}</td>
                 <td>{row['Weightage']}%</td>
                 <td>{row['stress_score'].toFixed(2)}</td>
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



import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './DetailedView.css';
import data from './DetailedViewData.json';

function DetailedView({ isDetailed, setIsDetailed, date }) {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(
      Object.keys(data[0] || {})
        .map(key => ({
          header: headerNameMap[key] || key, // use the header name map for known fields
          values: data.map(item => item[key])
        }))
    );
  }, []);

  // Pivot the table data from columns to rows
  const rowData = tableData.reduce((acc, col) => {
    col.values.forEach((value, i) => {
      if (!acc[i]) {
        acc[i] = {};
      }
      acc[i][col.header] = value;
    });
    return acc;
  }, []);

  const formattedDate = moment.isMoment(date) ? date.format("D MMM YYYY") : date

  const filteredRowData = rowData.filter((row) => {
    return row["Due Date"] === formattedDate
  })

    // computes the colour for the background when we have 
    let dayStyle = (row) => {
      let style = "";
      // assuming higher the worse it is
      if (row["Stress Score"] >= 7.5 && row["Stress Score"] <= 10) {
        style = style.concat("stressed")
      } else if (row["Stress Score"] >= 5 && row["Stress Score"] <= 7.5) {
        style = style.concat("moderate")
      } else {
        style = style.concat("good")
      }
      return style;
    }

  return (
    <div className={`detailed-view ${isDetailed ? 'active' : 'inactive'}`}>
      <div className="detailed-view-content">
        <button className="close-btn" onClick={() => setIsDetailed(!isDetailed)}>
          Return to Calendar View
        </button>
        {/*<h2 className={"detailed-view-header"}>Assignments due on 21st March 2023</h2>*/}
        <h2 className={"detailed-view-header"} dayStyle = {dayStyle}>Assignments on {new Date(date).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'})}</h2>
        {/* <div>{date.toString()}</div> */}
        <div>
          <table>
            <thead>
              <tr>
                <th>Assignment Name</th>
                <th>Module Code</th>
                <th>Due Date</th>
                <th>Professor</th>
                <th>Email</th>
                <th>Stress Score</th>
              </tr>
            </thead>
            <tbody>
              {filteredRowData.map((row, i) => (
                <tr key={i}>
                  <td>{row['Assignment Name']}</td>
                  <td>{row['Module Code']}</td>
                  <td>{row['Due Date']}</td>
                  <td>{row['Professor']}</td>
                  <td>
                    <a href={`mailto:${row['Email']}`}>{row['Email']}</a>
                  </td>
                  <td>{row['Stress Score']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// map of known header names
const headerNameMap = {
  'assignment-name': 'Assignment Name',
  'module-code': 'Module Code',
  'date': 'Due Date',
  'professor': 'Professor',
  'email': 'Email',
  'stressScore': "Stress Score"
};

export default DetailedView;

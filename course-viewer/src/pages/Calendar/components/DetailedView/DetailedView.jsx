import React, { useState, useEffect } from 'react';
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

  return (
    <div className={`detailed-view ${isDetailed ? 'active' : 'inactive'}`}>
      <div className="detailed-view-content">
        <button className="close-btn" onClick={() => setIsDetailed(!isDetailed)}>
          Return to Calendar View
        </button>
        {/*<h2 className={"detailed-view-header"}>Assignments due on 21st March 2023</h2>*/}
        <h2 className={"detailed-view-header"}>Assignment Details</h2>
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
              </tr>
            </thead>
            <tbody>
              {rowData.map((row, i) => (
                <tr key={i}>
                  <td>{row['Assignment Name']}</td>
                  <td>{row['Module Code']}</td>
                  <td>{row['Due Date']}</td>
                  <td>{row['Professor']}</td>
                  <td>
                    <a href={`mailto:${row['Email']}`}>{row['Email']}</a>
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


// map of known header names
const headerNameMap = {
  'assignment-name': 'Assignment Name',
  'module-code': 'Module Code',
  'date': 'Due Date',
  'professor': 'Professor',
  'email': 'Email'
};

export default DetailedView;

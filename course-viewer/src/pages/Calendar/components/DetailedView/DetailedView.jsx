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
              {tableData.map(row => (
                row.header === "Assignment Name" ? (
                  <tr key={row.header}>
                    <th></th>
                    {row.values.map(value => (
                      <th key={value}>{value}</th>
                    ))}
                  </tr>
                ) : null
              ))}
            </thead>
            <tbody>
              {tableData.map(row => (
                row.header === 'assignment-key' ? null : // skip the row with the 'Assignment-Key' header
                row.header === 'Assignment Name' ? null : // skip the row with the 'Assignment Name' header
                <tr key={row.header}>
                  <th>{row.header}</th>
                  {row.values.map((value, i) => (
                    <td key={i}>
                      {row.header === 'Email' ? (
                        <a href={`mailto:${value}`}>{value}</a>
                      ) : (
                        value
                      )}
                    </td>
                  ))}
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

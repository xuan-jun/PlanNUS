import React, { useState } from 'react'
import AssignmentForm from "./components/AssignmentForm/AssignmentForm";
import { Paper, makeStyles, TableBody, TableRow, TableCell} from '@material-ui/core';
import useTable from "./components/useTable";
import * as assignmentService from "./components/AssignmentService/AssignmentServices";
import Controls from "./components/controls/Controls";
import Popup from "./components/Popup";
import Title from './components/ModuleTitle/Title';

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3)
    },
    searchInput: {
        width: '75%'
    },
    newButton: {
        position: 'absolute',
        right: '10px'
    }
}))


const headCells = [
    { id: 'AssignmentName', label: 'Assignment Name' },
    { id: 'startDate', label: 'Start Date' },
    { id: 'endDate', label: 'End Date' },
    { id: 'weightage', label: 'Weightage' }
]

export default function Assignments() {

    const classes = useStyles();
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [records, setRecords] = useState(assignmentService.getAllAssignments())
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const [openPopup, setOpenPopup] = useState(false)

    const {
        TblContainer,
        TblHead,
        TblPagination
    } = useTable(records, headCells, filterFn);


    const addOrEdit = (assignment, resetForm) => {
        if (assignment.id === 0)
            assignmentService.insertAssignment(assignment)
        else
            assignmentService.updateAssignment(assignment)
        resetForm()
        setRecordForEdit(null)
        setOpenPopup(false)
        setRecords(assignmentService.getAllAssignments())
    }

    const openInPopup = item => {
        setRecordForEdit(item)
        setOpenPopup(true)
    }

    const handleCellClick = (item) => {
      openInPopup(item);
  }

  function createData(id, name, startdate, enddate, weight) {
    return { id, name, startdate, enddate, weight };
  }
  
  const rows = [
    createData(
      0,
      "Docker Assignment",
      "16 Mar, 2023",
      "23 Mar, 2023",
      5
    ),
    createData(
      1,
      "Git Quiz",
      "16 Mar, 2023",
      "23 Mar, 2023",
      10
    ),
    createData(
      2,
      "Peer Review",
      "16 Mar, 2023",
      "23 Mar, 2023",
      5
    ),
    createData(
      3,
      "Assignment 1",
      "16 Mar, 2023",
      "23 Mar, 2023",
      15
    ),
    createData(
      4,
      "Assignment 2",
      "15 Mar, 2023",
      "23 Mar, 2023",
      5
    )
  ];

    return (
        <>
            <Paper className={classes.pageContent} elevation="0">
                    <Controls.Button
                        text="Add New"
                        variant="outlined"
                        className={classes.newButton}
                    />
                    <Title> DSA3101 </Title>
                <TblContainer>
                    <TblHead />
                      <TableBody className="abody">
                      {rows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell onClick={handleCellClick}>{row.name}</TableCell>
                          <TableCell>{row.startdate}</TableCell>
                          <TableCell>{row.enddate}</TableCell>
                          <TableCell>{row.weight}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                </TblContainer>
                <TblPagination />
            </Paper>
            <Popup
                title="Assignment Details"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
                <AssignmentForm
                    recordForEdit={recordForEdit}
                    addOrEdit={addOrEdit} />
            </Popup>
        </>
    )
}
import React from "react";
import AssignmentForm from "./components/AssignmentForm/AssignmentForm";

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

    const handleCellClick = (item) => {
        openInPopup(item);
    }

    return (
        <>
            <AssignmentForm
                recordForEdit={recordForEdit}
                addOrEdit={addOrEdit} />
        </>
        
    )
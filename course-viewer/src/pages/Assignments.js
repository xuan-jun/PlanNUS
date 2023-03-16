import * as React from "react";
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AssignmentTable from "./Assignment/components/AssignmentTable/AssignmentTable";
import "./Assignment/AssignmentInstructor.css";

const Assignments = () => {
    return (
        <div>
            <Box>
                <Toolbar />
                <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
                    <Grid container spacing={10}>
                    {/* Recent Orders */}
                    <Grid item xs={20}>
                        <AssignmentTable />
                    </Grid>
                    </Grid>
                </Container>
                </Box>
        </div>
    )
  };
export default Assignments;
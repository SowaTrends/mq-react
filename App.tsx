import { useState, useEffect } from 'react';
import { Button, Container, Grid, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { Chart } from './components/Chart';
import { ChartType } from './utils/enums';

function App() {
    const [start, setStart] = useState<number>(1881);
    const [end, setEnd] = useState<number>(2006);
    const [chartType, setChartType] = useState<string>(ChartType.TEMP);

    const years = [];
    for(let i=1881;i<2007;i++){
        years.push(<MenuItem key={i} value={i}>{i}</MenuItem>);
    }

    return (
        <Container component="main" maxWidth="lg">
            <h2>Архив метеослужбы:</h2>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <Button 
                        onClick={()=>{setChartType(ChartType.TEMP)}} 
                        fullWidth 
                        variant={chartType === ChartType.TEMP ? "contained" : "outlined"}
                        sx={{ mt: 1, mb: 1 }}
                        color="secondary"
                    >
                        Температура
                    </Button>
                    <Button 
                        onClick={()=>{setChartType(ChartType.PREC)}} 
                        fullWidth 
                        variant={chartType === ChartType.PREC ? "contained" : "outlined"} 
                        sx={{ mt: 1, mb: 1 }}
                        color="secondary"
                    >
                        Осадки
                    </Button>
                </Grid>
                <Grid item xs={9}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Select 
                                id="startYear" 
                                fullWidth 
                                value={start} 
                                label="Начало" 
                                sx={{ mt: 1, mb: 1 }} 
                                onChange={(e: SelectChangeEvent<number>)=>{
                                    const val:number = e.target.value as number;
                                    setStart(val <= end ? val : end);
                                }} 
                            >
                                {years}
                            </Select>
                        </Grid>
                        <Grid item xs={6}>
                            <Select 
                                id="endYear" 
                                fullWidth 
                                value={end} 
                                label="Конец" 
                                sx={{ mt: 1, mb: 1 }} 
                                onChange={(e: SelectChangeEvent<number>)=>{
                                    const val:number = e.target.value as number;
                                    setEnd(val >= start ? val : start);
                                }} 
                            >
                                {years}
                            </Select>
                        </Grid>
                        <Chart chartType={chartType} start={start} end={end} />
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
}

export default App;

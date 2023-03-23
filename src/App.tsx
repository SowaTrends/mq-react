import { useState } from 'react';
import { Button, Container, Grid, MenuItem, NativeSelect, Select, SelectChangeEvent } from "@mui/material";
import { Chart } from './components/Chart';
import { ChartType } from './utils/enums';

function App() {
    const [start, setStart] = useState<number>(1881);
    const [end, setEnd] = useState<number>(2006);
    const [chartType, setChartType] = useState<string>(ChartType.TEMP);

    const years = [];
    for(let i=1881;i<2007;i++){
        years.push(<option key={i} value={i}>{i}</option>);
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
                            <NativeSelect
                                id="startYear"
                                fullWidth
                                value={start}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>{
                                    const val:number = +e.target.value;
                                    setStart(val <= end ? val : end);
                                }}
                            >
                                {years}
                            </NativeSelect>
                        </Grid>
                        <Grid item xs={6}>
                            <NativeSelect
                                id="endYear"
                                fullWidth
                                value={end}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>{
                                    const val:number = +e.target.value;
                                    setEnd(val >= start ? val : start);
                                }}
                            >
                                {years}
                            </NativeSelect>
                        </Grid>
                        <Chart chartType={chartType} start={start} end={end} />
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
}

export default App;

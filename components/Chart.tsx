import React, { useEffect, useRef, useState } from "react";
import { CanvasDraw } from "../utils/draw";
import { ChartType } from "../utils/enums";
import IndexedDbClass from "../utils/idb";
import { ItemData } from "../utils/types";
import Canvas from "./Canvas";

type ChartProps = {
    chartType: string;
    start: number;
    end: number;
};

export const Chart: React.FC<ChartProps> = ({chartType, start, end}) => {
    const allStart:string = "1881-01-01";
    const allEnd:string = "2006-12-31";
    const [dbTemperature, setDBTemperature] = useState<ItemData[]>([]);
    const [dbPrecipitation, setDBPrecipitation] = useState<ItemData[]>([]);

    const draw = (ctx:CanvasRenderingContext2D, frameCount:number) => {
        let draw = new CanvasDraw(ctx, calcData(chartType === ChartType.TEMP ? dbTemperature : dbPrecipitation));
        draw.drawChart();
    }

    const calcData = (data:ItemData[]):ItemData[] => {
        const startYear:string = start + "-01-01";
        const endYear:string = end + "-12-31";
        const filteredData:ItemData[] = data ? data.filter(x=>x.t >= startYear && x.t <= endYear) : [];
        return filteredData;
    }

    const checkDataLoaded = (chartType:string):boolean => {
        if( chartType === ChartType.TEMP && dbTemperature.length === 0 || 
            chartType === ChartType.PREC && dbPrecipitation.length === 0)
            return false;
        return true;
    }

    const setDBData = (chartType:string, data: ItemData[]) => {
        chartType === ChartType.TEMP ? 
            setDBTemperature(data) : setDBPrecipitation(data);
    }

    useEffect(() => {
        if(!checkDataLoaded(chartType)){
            const db = new IndexedDbClass("MetaQuotes");
            db.open(()=>{
                db.get(chartType,allStart,allEnd,data => {
                    if(data.length === 0){
                        console.log("Load from server...");
                        db.getData(chartType, newData => {
                            setDBData(chartType, newData);
                        });
                    } else {
                        console.log("Load from IndexedDB...");
                        setDBData(chartType, data);
                    }
                });
            });
            db.close();
        }
    }, [start, end, chartType]);

    return (
        <div style={{width:"100%", height: "600px", marginLeft :"20px"}}>
            <Canvas draw={draw} />
        </div>
    );
};
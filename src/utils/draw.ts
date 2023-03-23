import { ItemData } from "./types";

/**
 * Класс для отрисовки графика
 */
export class CanvasDraw {
    /**
     * @var width ширина Canvas
     * @var innerWidth внутренняя ширина зоны отрисовки данных
     * @var height высота Canvas
     * @var innerHeight внутренняя высота зоны отрисовки данных
     * @var min минимальное значение шкалы y
     * @var max максимальное значение шкалы y
     * @var dx расстояние между точками x
     * @var dy шаг шкалы y
     * @var zeropoint координата 0 на графике по y
     * @var ctx контекст Canvas
     * @var data данные для графика
     */
    width: number;
    innerWidth: number;
    height: number;
    innerHeight: number;
    min: number;
    max: number;
    dx: number;
    dy: number;
    py: number;
    zeropoint: number;
    ctx: CanvasRenderingContext2D;
    data: ItemData[];

    constructor(ctx: CanvasRenderingContext2D, data: ItemData[]) {
        ctx.canvas.style.width ='100%';
        ctx.canvas.style.height ='100%';
        this.width = ctx.canvas.width  = ctx.canvas.offsetWidth;
        this.height = ctx.canvas.height = ctx.canvas.offsetHeight;

        this.innerWidth = this.width - 70;
        this.innerHeight = this.height - 50;
        this.ctx = ctx;

        this.data = this.groupData(data);
        this.max = this.data.reduce((prev, curr) => {
            return Math.max(prev,curr.v);
        },0);
        this.min = this.data.reduce((prev, curr) => {
            return Math.min(prev,curr.v);
        },0);
        this.dx = (this.width-30)/this.data.length;
        this.dy = (this.max - this.min)/10;
        this.py = this.innerHeight/10;
        this.zeropoint = this.max*this.py/this.dy + this.py/2 - 10;
    }

    /**
     * Группируем данные чтобы отобразить максимальное количество точек
     * @param data массив данных
     */
    groupData(data:ItemData[]):ItemData[]{
        const result:ItemData[] = [];

        let minInterval:number = Math.ceil(data.length / this.width);
        if(minInterval > 1){
            for (let i=0; i < Math.floor(data.length/minInterval);i++) {
                const val:number = this.getAvg(data, minInterval*i, (minInterval*(i+1)));
                result.push({
                    t: data[minInterval*i].t,
                    v: val
                });
            }
            return result;
        }
        return data;
    }

    /**
     * Усредняем точки
     * @param data массив данных
     */
    getAvg(data: ItemData[], start:number, end:number):number{
        let sum:number = 0;
        for (let i:number = start; i < end; i++) {
            const val:number = data[i] ? data[i].v : 0;
            sum += val;
        }
        return (sum / (end - start + 1));
    }

    /**
     * Рисуем график
     */
    drawChart(){
        this.clear();
        this.drawData();
        this.drawAxis();
        this.drawLabels();
    }

    /**
     * Очищаем график
     */
    clear(){
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    /**
     * Рисуем оси
     */
    drawAxis() {
        //y
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 1.0;
        this.ctx.beginPath();
        this.ctx.moveTo(30, 10);
        this.ctx.lineTo(30, this.height);
        this.ctx.stroke();

        //x
        this.ctx.beginPath();
        this.ctx.moveTo(30, this.zeropoint);
        this.ctx.lineTo(this.width, this.zeropoint);
        this.ctx.stroke();
        this.ctx.fillText(0+"", 4, this.zeropoint); 
    }
    
    /**
     * Наносим подписи шкалы
     */
    drawLabels() {
        this.ctx.strokeStyle = "black";
        //подписи по y
        for(let i = 0; i < (this.min === 0 ? 10 : 11); i++) {
            let val:number = this.max - i*this.dy;
            this.ctx.fillText(val.toFixed(1), 4, i * this.py + this.py/2); 
        }
    
        //подписи по x
        const di: number = Math.ceil(this.data.length/10);
        for(let i = 0; i < this.data.length; i+=di) { 
            this.ctx.fillText(this.data[i].t, (i+1)*this.dx + 30, this.zeropoint + 10);
        }
    }
    
    /**
     * Рисуем данные
     */
    drawData() {
        this.ctx.strokeStyle = "#9c27b0"; 
        
        this.ctx.beginPath(); 
        this.ctx.moveTo(30, this.zeropoint);        //начинаем с (0,0)
        for(let i = 0; i < this.data.length; i++) {
            let y:number = (this.max-this.data[i].v)*this.py/this.dy;
            this.ctx.lineTo((i+1)*this.dx + 30, y + this.py/2 - 10);
        }
        this.ctx.stroke();
    }
}
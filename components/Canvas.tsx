import React from 'react';
import useCanvas from '../utils/usecanvas';

type CanvasProps = {
    draw: (...props:any)=>void;
};

export const Canvas: React.FC<CanvasProps> = ({draw, ...rest }) => {

    const canvasRef = useCanvas(draw);
  
    return <canvas ref={canvasRef} {...rest}/>
}

export default Canvas;
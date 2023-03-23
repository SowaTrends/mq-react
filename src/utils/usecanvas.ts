import { useRef, useEffect } from 'react';

/**
 * Хук для рыботы с Canvas
 */
const useCanvas = (draw:any) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
  
    useEffect(() => {

        const canvas:HTMLCanvasElement = canvasRef.current!;
        const context:CanvasRenderingContext2D | null = canvas.getContext('2d');
        
        draw(context);
        
    }, [draw]);
  
    return canvasRef;
}

export default useCanvas;
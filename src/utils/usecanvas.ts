import { useRef, useEffect } from 'react'

const useCanvas = (draw:any) => {
  
    const canvasRef = useRef<HTMLCanvasElement>(null);
  
    useEffect(() => {

        const canvas:HTMLCanvasElement = canvasRef.current!;
        const context:CanvasRenderingContext2D | null = canvas.getContext('2d')
        let frameCount:number = 0;
        let animationFrameId:number;
        
        const render = () => {
            frameCount++;
            draw(context, frameCount);
            animationFrameId = window.requestAnimationFrame(render);
        }
        render()
        
        return () => {
            window.cancelAnimationFrame(animationFrameId);
        }
    }, [draw]);
  
    return canvasRef;
}

export default useCanvas;
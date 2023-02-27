import { useFilterZoom} from "../context/FilterZoomProvider"
import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Center } from "@react-three/drei";


function CenterObj({children}) {
    return (
      <Center scale={[1, 1, 1]}>
        {children}
      </Center>
    );
}
  
function CanvasControls({children }) {
    const camera = useThree(({ camera }) => camera)
    const {setCamera} = useFilterZoom()
    
    useEffect(() => {
      setCamera(camera)
    }, [camera])
    return <></>
  }
  
  function CanvasBody({style, children}){
    const {canvasRef} = useFilterZoom();
  
    return (<div
        id="canvas-container"
        style={{touchAction: 'none', ...style}}  
         ref={canvasRef}
      >
        <Canvas orthographic camera={{ zoom: 1, up: [0, 0, 1], position: [0, 0, 5], rotation: [0, 0, 0]}} >
          <Suspense fallback={null}>
            <CenterObj>
                {children}
            </CenterObj>
          </Suspense>
          <CanvasControls />
        </Canvas>
      </div>
      )
  }

export default function FiberZoomContainer({style, children}){
    useEffect(() => {
        const handler = (e) => e.preventDefault()
        document.addEventListener('gesturestart', handler)
        document.addEventListener('gesturechange', handler)
        document.addEventListener('gestureend', handler)
        return () => {
          document.removeEventListener('gesturestart', handler)
          document.removeEventListener('gesturechange', handler)
          document.removeEventListener('gestureend', handler)
        }
      }, [])
    
    return (
        <CanvasBody style={style}>
                {children}
        </CanvasBody>
    );
}
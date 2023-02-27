import "./App.css";
import { useState, useCallback } from "react";
import {useThree, useFrame } from "@react-three/fiber";
import { Image, Html} from "@react-three/drei";
import { useFilterZoom, FilterZoomProvider} from "./context/FilterZoomProvider";
import FiberZoomContainer from "./components/FiberZoomContainer";
import { useDrag } from '@use-gesture/react'

function positionTranslator(x, y) {
  return [-300 + x + 50, 200 - y - 50, 1];
}

function PhoneImage({ x, y }) {
  const [stateX, setStateX] = useState(x)
  const [stateY, setStateY] = useState(y)
  const [_x, _y, z] = positionTranslator(stateX, stateY)

  const {setMove, setZoom, enabled, zoom, canvasRef} = useFilterZoom()

  const click = useCallback(() => {
    if(enabled) {
      setMove([_x, _y])
      const newZoom = Math.min(canvasRef.current.clientHeight/(100 + 30), canvasRef.current.clientWidth/(100 + 30))
      setZoom(newZoom)
    }
  }, [enabled, canvasRef])
  
  const bind = useDrag(({delta}) => { 
    if(!enabled){
      console.log(delta)
      const [newX, newY] =  [delta[0]/zoom, delta[1]/zoom]
      console.log(stateX, newX)
      console.log(stateY, newY)
      setStateX(stateX + newX)
      setStateY(stateY + newY)
    }
  })

  return (
    <>
      <Html
        position={[_x, _y, z]}
        scale={[100, 100, 1]}
      >
        {_x},
        {_y}
      </Html>
      <Image
        position={[_x, _y, z]}
        scale={[100, 100, 1]}
        onClick={click}
        {...bind()}
        url={
          "https://media.istockphoto.com/photos/mobile-phone-top-view-with-white-screen-picture-id1161116588?k=20&m=1161116588&s=612x612&w=0&h=NKv_O5xQecCHZic53onobxjqGfW7I-D-tBrzXaPbj_Q="
        }
      />
    </>
  );
}

function Test() {
  const camera = useThree(({ camera }) => camera)
  const [cameraStuff, setCameraStuff] = useState([camera.zoom, camera.rotation, camera.position])
  useFrame(() => setCameraStuff([camera.zoom, camera.rotation, camera.position]))
  
  return (
    <>
      <Html>
        <div>
          {cameraStuff[0]}
        </div>
        <div>
          {cameraStuff[1].x.toFixed(2)},
          {cameraStuff[1].y.toFixed(2)},
          {cameraStuff[1].z.toFixed(2)}
        </div>
        <div>
          {cameraStuff[2].x.toFixed(2)},
          {cameraStuff[2].y.toFixed(2)},
          {cameraStuff[2].z.toFixed(2)}
        </div>
      </Html>
    </>
  )

}

function TestControls() {
  const {zoom, setZoom, setEnabled, enabled} = useFilterZoom();

  return(
    <div>
      <button onClick={() => setZoom(zoom+1)}>Zoom In</button>
      <button onClick={() => setZoom(zoom-1)}>Zoom Out</button>
      <button onClick={() => setEnabled(!enabled)}>{enabled ? "Edit Mode" : "View Mode"}</button>
    </div>
  )
}

function App() {
  return (
    <FilterZoomProvider>
      <TestControls />
      <FiberZoomContainer style={{width: '100vw', height: '100vh'}}>
        <Test/>
        <Image
          position={[0, 0, 0]}
          scale={[600, 400, 1]}
          url={
            "https://image.shutterstock.com/image-vector/white-shelf-mockup-empty-shelves-260nw-1927984952.jpg"
          }
        />
        <PhoneImage x={150} y={-30} />
        <PhoneImage x={300} y={-30} />
        <PhoneImage x={150} y={90} />
        <PhoneImage x={300} y={90} />
        <PhoneImage x={150} y={200} />
        <PhoneImage x={300} y={200} />
      </FiberZoomContainer>
    </FilterZoomProvider>
  );
}

export default App;

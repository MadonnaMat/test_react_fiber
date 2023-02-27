import "./App.css";
import { Suspense, useEffect, useRef, useState } from "react";
import {Vector3} from 'three';
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { MapControls, Image, Center, useCamera, Html} from "@react-three/drei";
import CameraControls from "camera-controls";
import { CanvasControlsProvider, useCanvasControls } from "./context/CanvasControlsProvider";

function positionTranslator(x, y) {
  return [-300 + x + 50, 200 - y - 50, 1];
}

function PhoneImage({ x, y }) {
  const [_x, _y, z] = positionTranslator(x, y)
  const {setMove, setZoom} = useCanvasControls()

  const click = () => {
    setMove([_x, _y])
    setZoom(window.innerHeight/(100 + 30))
  }

  return (
    <>
      <Html
        position={positionTranslator(x, y)}
        scale={[100, 100, 1]}
      >
        {positionTranslator(x, y)[0]},
        {positionTranslator(x, y)[1]}
      </Html>
      <Image
        position={positionTranslator(x, y)}
        scale={[100, 100, 1]}
        onClick={click}
        url={
          "https://media.istockphoto.com/photos/mobile-phone-top-view-with-white-screen-picture-id1161116588?k=20&m=1161116588&s=612x612&w=0&h=NKv_O5xQecCHZic53onobxjqGfW7I-D-tBrzXaPbj_Q="
        }
      />
    </>
  );
}

function CenterObj() {
  return (
    <Center scale={[1, 1, 1]}>
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
    </Center>
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

function CanvasControls({children }) {
  const camera = useThree(({ camera }) => camera)
  const {setCamera} = useCanvasControls()
  
  useEffect(() => {
    setCamera(camera)
  }, [camera])
  return <></>
}

function CanvasBody(){
  const {canvasRef} = useCanvasControls();

  return (<div
      id="canvas-container"
      style={{ width: '100vw', height: '100vh', touchAction: 'none'}}  
       ref={canvasRef}
    >
      <Canvas orthographic camera={{ zoom: 1, up: [0, 0, 1], position: [0, 0, 5], rotation: [0, 0, 0]}} >
        <Suspense fallback={null}>
          <CenterObj />
        </Suspense>
        <Test />
        <CanvasControls />
      </Canvas>
    </div>
    )
}

function App() {
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
    <CanvasControlsProvider>
      <CanvasBody />
    </CanvasControlsProvider>
  );
}

export default App;

import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useDrag, usePinch } from '@use-gesture/react'

const CanvasControlsContext = React.createContext();

export const useCanvasControls = () => {
  const context = React.useContext(CanvasControlsContext);

  if (context === undefined) {
    throw new Error('useCanvasControls must be used within a CanvasControlsProvider');
  }

  return context;
}

export const CanvasControlsProvider = ({ children }) => {
  const [canMove, setCanMove] = useState(false)
  const [dragMove, setDragMove] = useState([0, 0])
  const [move, setMove] = useState([0, 0])
  const [zoom, setZoom] = useState(1)
  const [camera, setCamera] = useState()
  const canvasRef = useRef()

  const pointerMove = useDrag(({delta: [x, y]}) => setDragMove([x, y]), {target: canvasRef})
  const zoomMove = usePinch(({offset: [scale, angle]}) => setZoom(scale), {target: canvasRef, from: () => [zoom, 0]})
  
  useEffect(() => {
    if(camera) setMove([camera.position.x - (dragMove[0]/zoom), camera.position.y + (dragMove[1]/zoom)])
  }, [dragMove, camera])
  
  useEffect(() => { 
    console.log(move, zoom)
    if(camera){
      camera.position.set(move[0], move[1], 5)
      camera.rotation.set(0, 0, 0)
      camera.zoom = zoom
      camera.updateProjectionMatrix()
    }
  }, [move, zoom, camera])
  
  
  const providerData = {
    setCamera,
    canvasRef,
    move,
    zoom,
    setMove,
    setZoom
  }
  
  return <CanvasControlsContext.Provider value={providerData}>{children}</CanvasControlsContext.Provider>;
};

import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useDrag, usePinch } from '@use-gesture/react'

const FiberZoomContext = React.createContext();

export const useFiberZoom = () => {
  const context = React.useContext(FiberZoomContext);

  if (context === undefined) {
    throw new Error('useFiberZoom must be used within a FiberZoomProvider');
  }

  return context;
}

export const FiberZoomProvider = ({ children }) => {
  const [canMove, setCanMove] = useState(false)
  const [dragMove, setDragMove] = useState([0, 0])
  const [move, setMove] = useState([0, 0])
  const [zoom, setZoom] = useState(1)
  const [camera, setCamera] = useState()
  const [enabled, setEnabled] = useState(true)
  const canvasRef = useRef()

  const pointerMove = useDrag(({delta: [x, y]}) => enabled && setDragMove([x, y]), {target: canvasRef})
  const zoomMove = usePinch(({offset: [scale, angle]}) => enabled && setZoom(scale), 
    {target: canvasRef, from: () => [zoom, 0], modifierKey: null})
  
  useEffect(() => {
    if(zoom < 0.5) setZoom(0.5)
  }, [zoom])
  
  const movePositioner = useCallback(([x, y]) => {
    console.log(camera && camera.position, zoom)
    if(camera)
      return [camera.position.x - (x/zoom), camera.position.y + (y/zoom)]
    return [x, y]
  }, [camera && camera.position, zoom])
  
  useEffect(() => {
    if(camera) setMove(movePositioner(dragMove))
  }, [dragMove, camera])
  
  useEffect(() => { 
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
    setEnabled,
    enabled,
    movePositioner,
    setZoom
  }
  
  return <FiberZoomContext.Provider value={providerData}>{children}</FiberZoomContext.Provider>;
};

import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useDrag, usePinch } from '@use-gesture/react'

const FilterZoomContext = React.createContext();

export const useFilterZoom = () => {
  const context = React.useContext(FilterZoomContext);

  if (context === undefined) {
    throw new Error('useFilterZoom must be used within a FilterZoomProvider');
  }

  return context;
}

export const FilterZoomProvider = ({ children }) => {
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
  
  return <FilterZoomContext.Provider value={providerData}>{children}</FilterZoomContext.Provider>;
};

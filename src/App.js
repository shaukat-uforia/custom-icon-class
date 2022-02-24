import React, {useEffect, useState, useRef} from 'react';
import {fabric} from 'fabric';

require("./components/icon");
const json='{"version":"4.6.0","objects":[{"type":"icon","version":"4.6.0","originX":"left","originY":"top","left":144.38,"top":52.7,"width":488.69,"height":488.69,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"_id":"6215046f4fcddbc96845bcc7","title":"shaukat","hasShapeContainer":true,"objects":[{"type":"rect","version":"4.6.0","originX":"center","originY":"center","left":0,"top":0,"width":1000,"height":1000,"fill":"#ab65ed","stroke":"#2f8e58","strokeWidth":100,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":0.44,"scaleY":0.44,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":150,"ry":150},{"type":"path","version":"4.6.0","originX":"center","originY":"center","left":0,"top":0,"width":15.93,"height":14,"fill":"#ae9b37","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":13.12,"scaleY":13.12,"angle":39.82,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",0,0],["L",0,1],["L",2.531,1],["L",3.3120000000000003,4.625],["L",3.8120000000000003,7.968999999999999],["L",3.2180000000000004,11.032],["C",2.5200000000000005,11.16,1.9990000000000003,11.766,1.9990000000000003,12.501],["C",1.9990000000000003,13.328999999999999,2.6710000000000003,14.001,3.4990000000000006,14.001],["C",4.189,14.001,4.7620000000000005,13.542,4.937,12.907],["L",12.062000000000001,12.907],["C",12.237000000000002,13.542,12.809000000000001,14.001,13.500000000000002,14.001],["C",14.328000000000001,14.001,15.000000000000002,13.328999999999999,15.000000000000002,12.501],["C",15.000000000000002,11.673,14.328000000000001,11.001,13.500000000000002,11.001],["C",12.879000000000001,11.001,12.353000000000002,11.369,12.125000000000002,11.907],["L",4.875000000000002,11.907],["C",4.742000000000002,11.593,4.516000000000002,11.35,4.219000000000002,11.188],["L",4.657000000000002,9],["L",14.501000000000001,9],["C",14.801000000000002,9,15.001000000000001,8.8,15.001000000000001,8.5],["L",15.907000000000002,2.5],["C",16.007,2.2,15.801000000000002,2,15.501000000000001,2],["L",3.8130000000000006,2],["L",3.5000000000000004,0.5940000000000001],["L",3.4690000000000003,0.5940000000000001],["C",3.442,0.4710000000000001,3.3960000000000004,0.3730000000000001,3.3440000000000003,0.31300000000000006],["C",3.2750000000000004,0.23300000000000004,3.221,0.16400000000000006,3.156,0.12500000000000006],["C",3.0260000000000002,0.047000000000000056,2.904,5.551115123125783e-17,2.6870000000000003,5.551115123125783e-17],["L",-0.0009999999999998899,5.551115123125783e-17],["z"]]}]}],"background":"#eee"}';
const icons=[{name:'arrow',path:'arrow.svg'},{name:'badge',path:'badge.svg'},{name:'trending',path:'trending.svg'},{name:'cart',path:'5460.svg'},{name:'male',path:'male.svg'}]
function App() {
  const [canvas, setCanvas] = useState(null);
  const [activeObject, setActiveObject] = useState(null);
  const [iconMaxSize, setIconMaxSize] = useState(0);
  const canvasRef = useRef();
  useEffect(() => {
    let canvas = new fabric.Canvas(canvasRef.current, {height: 600, width: 800, backgroundColor: '#eee'})
    setCanvas(canvas);
    window.canvas = canvas;
    canvas.on('selection:created', ({target}) => {
      setActiveObject(target)
      let object=target
      if(object.type=='icon'){
        setIconMaxSize(object.iconMaxSize)
      }

      // this.updateIconObjectState(target)
    })
    canvas.on('selection:updated', ({target}) => {
      setActiveObject(target)
      // this.updateIconObjectState(target)

    })
    canvas.on('selection:cleared', () => {
      setActiveObject(null)
    })
    canvas.on('after:render',(e)=>{
      let object=canvas.getActiveObject();
      if(object){
        let icon =object.icon;
        let matrix = icon.calcTransformMatrix();
        let {x: rectLeft, y: rectTop} = fabric.util.transformPoint({x: icon.left, y: icon.top}, matrix)

        let ctx=canvas.getContext();
        ctx.fillStyle ='rgba(250,250,250,0)';
        ctx.strokeStyle ='rgb(0, 0, 0)';
        ctx.lineWidth=2
        ctx.strokeRect(rectLeft-object.replaceRefBounding.width/2, rectTop-object.replaceRefBounding.height/2, object.replaceRefBounding.width, object.replaceRefBounding.height);
        console.log('afterRender')
      }
    })
  }, []);

  useEffect(() => {
    if (!canvas) return;
    fabric.Icon.loadIcon('5460.svg', (icon) => {
      icon.scaleToWidth(100)

      icon.set({left: 30, top: 30,title:'shaukat'})
      canvas.add(icon);
      canvas.setActiveObject(icon);
      canvas.renderAll()
    })
    // let parsedJson=JSON.parse(json);
    // canvas.loadFromJSON(parsedJson)
  }, [canvas]);

  const updateIconObjectState=(object)=>{
    if(object.type=='icon'){
      setIconMaxSize(object.iconMaxSize)
    }

  }
  const handleIconSizeChange = ({target}) => {
    let value = +target.value;
    activeObject.setIconSize(value);
    canvas.renderAll();
  }
  const handleShapeSizeChange = ({target}) => {
    let value = +target.value;
    activeObject.setShapeSize(value);
    canvas.renderAll();
  }
  const handleChangeIconColor = ({target}) => {
    let value = target.value;
    activeObject.setIconColor(value);
    canvas.renderAll();
  }
  const handleChangeShapeColor = ({target}) => {
    let value = target.value;
    activeObject.setShapeColor(value);
    canvas.renderAll();
  }
  const handleChangeShapeBorderColor = ({target}) => {
    let value = target.value;
    activeObject.setShapeBorderColor(value);
    canvas.renderAll();
  }
  const handleChangeShapeBorderWidth = ({target}) => {
    let value = +target.value;
    activeObject.setShapeBorderWidth(value);
    canvas.renderAll();
  }
  const handleChangeShapeRadius = ({target}) => {
    let value = +target.value;
    activeObject.setShapeRadius(value);
    canvas.renderAll();
  }
  const replaceIcon=(name)=>{
    activeObject.replaceIcon(name);

  }
  const replaceShape=(name)=>{
    activeObject.replaceShape(name);
  }
  const handleReload=()=>{
    let json=canvas.toDatalessJSON();
    canvas.clear();
    canvas.loadFromJSON(json,()=>{
      canvas.renderAll();
    })
  }
  return <div className={'row mx-3'}>
    <div className={'col-1'}>

      {icons.map(icon=><button onClick={()=>replaceIcon(icon.path)}>{icon.name}</button>)}
      <button onClick={()=>{activeObject.removeShape();canvas.renderAll()}}>Toggle Shape</button>
      <button onClick={()=>replaceShape('square.svg')}>change square shape</button>
      <button onClick={()=>replaceShape('hexagon.svg')}>change hexa shape</button>
      <button onClick={handleReload}>reload</button>
      <img src={activeObject&&activeObject.iconSrc} style={{width:100}} alt=""/>
    </div>
    <div className={'col'} style={{height: '600px'}}>
      <canvas id={'canvass'} ref={canvasRef}/>
    </div>
    <div className={'col-3'}>
      {activeObject &&
      <>
        <div className="form-group mb-2">
          <label htmlFor="">Icon Size</label>
          <input type="range" step={0.1} min={activeObject.iconMinSize} max={iconMaxSize}
                 defaultValue={activeObject.iconSize} onChange={handleIconSizeChange}/>

        </div>
        <div className="form-group mb-2">
          <label htmlFor="">Shape Size</label>
          <input type="range" step={0.01} min={activeObject.shapeMinSize} max={activeObject.shapeMaxSize}
                 defaultValue={activeObject.shapeSize} onChange={handleShapeSizeChange}/>
        </div>
        <div className="form-group mb-2">
          <label htmlFor="">Icon Color</label>
          <input type="color" defaultValue={activeObject.iconColor} onChange={handleChangeIconColor}/>
        </div>
        <div className="form-group mb-2">
          <label htmlFor="">Shape Color</label>
          <input type="color" defaultValue={activeObject.shapeColor} onChange={handleChangeShapeColor}/>
        </div>
        <div className="form-group mb-2">
          <label htmlFor="">Shape Border Color</label>
          <input type="color" defaultValue={activeObject.shapeBorderColor} onChange={handleChangeShapeBorderColor}/>
        </div>
        <div className="form-group mb-2">
          <label htmlFor="">Shape Border Color</label>
          <input type="range" min={0} max={100} defaultValue={activeObject.shapeBorderWidth} onChange={handleChangeShapeBorderWidth}/>
        </div>
        <div className="form-group mb-2">
          <label htmlFor="">Shape Radius</label>
          <input type="range" min={0} max={150} defaultValue={activeObject.shapeRadius} onChange={handleChangeShapeRadius}/>
        </div>
        <div className="form-group mb-2">
          <label htmlFor="">Icon angle</label>
          <input type="range" min={0} max={360} defaultValue={activeObject.icon.angle} onChange={({target})=>{activeObject.icon.rotate(+target.value);activeObject.icon.dirty=true; activeObject.dirty=true;canvas.renderAll();}}/>
        </div>
      </>
      }
    </div>

  </div>
}

export default App;

import {fabric} from "fabric";

/**
 *
 * @param innerObject {angle,height,width}
 * @param outerObject {height,width,scaleX,scaleY}
 * @returns {number}
 */
export function getObjectRelativeMaxScale(innerObject,outerObject){
    let scale1=calculateScale(innerObject,outerObject,0);
    if(innerObject.angle != 0){
        let scale2=calculateScale(innerObject,outerObject,getDiagonalAngle(innerObject));
        return scale1 < scale2 ? scale1 : scale2 ;
    }
    return scale1
}

/**
 *
 * @param innerObject {angle,height,width}
 * @param outerObject {height,width,scaleX,scaleY}
 * @param  additionalAngle Number needed for 2nd diagonal angle
 * @returns {number}
 */
export function calculateScale( innerObject,  outerObject,  additionalAngle = 0,errorFactor=5) {
    let originPoint = {x: 0, y: 0};
    let diagonalLineAngle =  getDiagonalAngle(innerObject) +  innerObject.angle +  additionalAngle;
    let diagonalLineLength =  getDiagonalDistance( innerObject);

    let x1 = originPoint.x;
    let y1 = originPoint.y;

    let lineAngle = Math.tan(diagonalLineAngle * Math.PI / 180);

    let shapeHalfHeight= (outerObject.height * outerObject.scaleY) / 2;
    let shapeHalfWidth= (outerObject.width * outerObject.scaleX) / 2 ;

    let x2 = 0;
    let y2 =shapeHalfHeight + y1;
    y2 -= errorFactor;
    x2 = ((y2 - y1) / lineAngle) + x1;
    let point2 = {x: x2, y: y2};

    y2 = y1 - shapeHalfHeight;
    y2 += errorFactor;
    x2 = ((y2 - y1) / lineAngle) + x1;
    let point1 = {x: x2, y: y2};

    let line1Length =  getDistance(point1, point2);

    x2 =shapeHalfWidth + x1;
    x2 -= errorFactor;
    y2 = lineAngle * (x2 - x1) + y1;
    point2 = {x: x2, y: y2};

    x2 = x1 - shapeHalfWidth;
    x2 += errorFactor;
    y2 = lineAngle * (x2 - x1) + y1;
    point1 = {x: x2, y: y2};

    let line2Length =  getDistance(point1, point2);

    let minLength = line2Length > line1Length ? line1Length : line2Length;

    let maxScale = minLength / diagonalLineLength;
    return maxScale;

}

export function getDistance(point1, point2) {
    return Math.hypot(point2.x - point1.x, point2.y - point1.y)
}

export function getDiagonalDistance({height,width}) {
    return Math.sqrt((height * height) + (width * width))
}

export function getDiagonalScaledDistance({height,width,scaleX,scaleY}) {
    return Math.sqrt((width*width*scaleX*scaleX) + (height*scaleY*height*scaleY))
}

export function getDiagonalAngle({height,width}) {
    return Math.atan(height / width) * (180 / Math.PI)
}

/**
 *
 * @param objectProps {height,width,scaleX,scaleY}
 * @param height must be property of object
 * @returns {number}
 */
export function getObjectRelativeMinScale(objectProps, {height}){
    return getDiagonalScaledDistance(objectProps)/height
}


export function colorOpacityConverter (color)   {
    console.log('in utility')
    color = new fabric.Color(color);
    return RGBAtoRGB(color.getSource()[0], color.getSource()[1], color.getSource()[2], color.getSource()[3], 255, 255, 255);
}

export function RGBAtoRGB  (r, g, b, a, r2, g2, b2)   {
    let r3 = Math.round(((1 - a) * r2) + (a * r));
    let g3 = Math.round(((1 - a) * g2) + (a * g));
    let b3 = Math.round(((1 - a) * b2) + (a * b));
    return "rgb(" + r3 + "," + g3 + "," + b3 + ")";
}
export function iconTypeValidate(object) {
    let type = false;
    if ((object.type == 'image' && object.name == 'iconNounApi')
        || (object.type == 'group' && object.name == 'iconNounApi')
        || (object.type == 'polygon')
        || (object.type == 'circle' && object.name != 'controlA')
        || (object.type == 'circle' && object.name != 'controlB')
        || (object.type == 'circle' && object.name != 'oldControlA')
        || (object.type == 'circle' && object.name != 'oldControlB')
        || (object.type == 'polygon')
        || (object.type == 'path' && object.name == 'iconNounApi')
        || (object.type == 'group' && object.name == "Icons8")) {
        type = true;
    }
    return type;
}

export function convertOldIconObject(object){
    let newIconObject={
        type:'icon',
        objects:[object],
        hasShapeContainer:false,
        title:object.objectName,
        _id:object.objectId,
        scaleX:1,
        scaleY:1,
        width:object.scaleX*object.width,
        height:object.scaleY*object.height,
    }
    return newIconObject;
}

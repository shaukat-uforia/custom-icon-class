import {fabric} from "fabric";
import ObjectID from "bson-objectid";
import {
    calculateScale,
    getDiagonalAngle,
    getDiagonalScaledDistance
} from "../helper/UtilityFunctions.js";

const props = [
    '_id',
    'title',

];
const defaultProps = {
    icon: {
        maxScale: 30,
    },
    shape: {
        fill: '#ab65ed',
        stroke: 'rgb(0,0,0)',
        strokeWidth: 0,
        radius: 0
    }
}
fabric.Icon = class extends fabric.Group {
    type = 'icon';
    icon = null;
    shape = null;
    iconSize = 0;
    shapeSize = 0;
    iconMaxSize = 10;
    shapeMaxSize = 10;
    iconMinSize = 0.1;
    shapeMinSize = 0.1;
    iconColor = '#000';
    shapeColor = defaultProps.shape.fill;
    iconSrc = '';
    shapeSrc = '';
    hasShapeContainer = false;
    shapeBorderColor = defaultProps.shape.stroke;
    shapeBorderWidth = defaultProps.shape.strokeWidth;
    shapeRadius = defaultProps.shape.radius;
    stateProperties = fabric.Group.prototype.stateProperties.concat(...props);
    cacheProperties = fabric.Group.prototype.cacheProperties.concat(...props, 'icon.angle');
    replaceRefBounding = {};

    constructor(objects, options = {}) {
        let icon = objects[1];
        let shape = objects[0];

        if (!shape) {
            objects = [icon];
        }
        icon.originX = 'center';
        icon.originY = 'center';
        icon.needsItsOwnCache = function () {
            return true;
        }

        super(objects, options);
        this.icon = icon;
        this.shape = shape || {}
        this.shape.left = 0;
        this.shape.top = 0;

        this.icon.left = 0;
        this.icon.top = 0;
        if (options) this.setOptions(options);
        this._id = options._id || ObjectID().toHexString();
        this.iconSize = icon.scaleX;
        this.iconColor = this.icon.freelyDrawn ? this.icon.stroke : this.icon.fill;
        this.iconSrc = icon.src || icon.toDataURL();
        if (!shape) {
            this.width = icon.scaleX * icon.width;
            this.height = icon.scaleY * icon.height;
        } else {
            this.shapeBorderColor = shape.stroke;
            this.shapeBorderWidth = shape.strokeWidth;
            if (shape.type === 'rect') {
                this.shapeRadius = shape.rx;
            }
        }
        this.iconMaxSize = this._getIconMaxScale();
        this.shapeMinSize = this._getShapeMinSize(this.icon, this.shape);
        this._updateRefBounding();

        this.on('rotated', () => {
            this._updateRefBounding();
        })
        this.on('scaled', () => {
           this.handleObjectScaled()
        })
    }
    handleObjectScaled(){
        this.icon.scaleX = this.scaleX * this.icon.scaleX;
        this.icon.scaleY = this.scaleY * this.icon.scaleY;
        this.shape.scaleX = this.scaleX * this.shape.scaleX;
        this.shape.scaleY = this.scaleY * this.shape.scaleY;
        this.width = this.width * this.scaleX;
        this.height = this.height * this.scaleY;
        this.scaleX = 1;
        this.scaleY = 1;
        this.shapeSize = this.shape.scaleX;
        this.iconSize = this.icon.scaleX;
        this.shapeMinSize = this._getShapeMinSize(this.icon, this.shape);
        this.iconMaxSize = this._getIconMaxScale();
        this.icon.dirty = true;
        this.shape.dirty = true;
        this.dirty = true;
        this._updateRefBounding();

        setTimeout(() => {
            this._updateRefBounding();
        }, 500)
    }
    _updateRefBounding() {
        if (!this.hasShapeContainer) {
            let rect = this.getBoundingRect();
            this.replaceRefBounding = rect;
        } else {
            let rect = this.icon.getBoundingRect(false, true);
            this.replaceRefBounding = rect
        }

    }

    setIconSize(value) {
        if (value >= this.iconMinSize && value <= this.iconMaxSize) {
            this.iconSize = value;
            this.icon.scaleX = value;
            this.icon.scaleY = value;
            this.icon.dirty = true;
            this.dirty = true;
            if (!this.hasShapeContainer) {
                this.height = this.icon.height * value;
                this.width = this.icon.width * value;
            }
            this.shapeMinSize = this._getShapeMinSize(this.icon, this.shape);
            setTimeout(() => {
                this._updateRefBounding();
            }, 1000)
        }
    }


    _getShapeMinSize(icon, shape) {
        return getDiagonalScaledDistance(icon) / shape.height
    }

    setIconColor(color) {
        this.iconColor = color;

        this.icon.fill = color;
        if (this.icon.freelyDrawn) {
            this.icon.stroke = color;
        }

        if (this.icon.type == 'image') {
            let src = this.updateIconFillInSrc(this.icon.src, color);
            this.icon.setSrc(src, () => {

            });
        } else if (this.icon.type == "group") {
            this.icon.getObjects().forEach((object) => {
                object.fill = color;
            });

        }
        this.dirty = true;
        this.icon.dirty = true;
    }

    setShapeColor(color) {
        this.shapeColor = color;

        this.shape.fill = color;
        if (this.shape.type === 'group') {
            this.shape.getObjects().forEach((object) => {
                object.fill = color;
            });

        }
        this.dirty = true;
        this.icon.dirty = true;
    }

    setShapeBorderColor(color) {
        this.shapeBorderColor = color;
        this.shape.stroke = color;
        this.dirty = true;
        this.shape.dirty = true;
    }

    setShapeBorderWidth(value) {
        value = +value;
        this.shapeBorderWidth = value;
        this.shape.strokeWidth = value;
        this.height = this.shape.getScaledHeight();
        this.width = this.shape.getScaledWidth();
        this.dirty = true;
        this.shape.dirty = true;
    }

    setShapeRadius(value) {
        value = +value;
        this.shapeRadius = value;
        if (this.shape.type == 'rect') {
            this.shape.rx = value;
            this.shape.ry = value;
            this.dirty = true;
            this.shape.dirty = true;
        }
    }

    setShapeSize(value) {
        if (value >= this.shapeMinSize && value <= this.shapeMaxSize) {
            console.log(value)
            this.shapeSize = value;
            this.shape.scaleX = value;
            this.shape.scaleY = value;
            this.shape.dirty = true;
            this.width = this.shape.getScaledWidth();
            this.height = this.shape.getScaledHeight();
            this.scaleX = 1;
            this.scaleY = 1;
            this.dirty = true;
            this.iconMaxSize = this._getIconMaxScale()

        }
    }

    _getIconMaxScale() {
        if (!this.hasShapeContainer) return 30;
        let icon = this.icon;
        let outer = this;
        let scale1 = calculateScale(icon, outer, 0);
        if (icon.angle > 0) {
            let scale2 = calculateScale(icon, outer, getDiagonalAngle(icon));
            return scale1 < scale2 ? scale1 : scale2;
        }
        return scale1
    }

    _getIconNewScale(icon, outer) {
        outer.scaleX = 1;
        outer.scaleY = 1;
        let scale1 = calculateScale(icon, outer, 0, 1);
        if (icon.angle > 0) {
            let scale2 = calculateScale(icon, outer, getDiagonalAngle(icon), 1);
            return scale1 < scale2 ? scale1 : scale2;
        }
        return scale1
    }

    replaceIcon(src) {
        let group = this;
        let icon = this.icon;
        let oldIconFill = icon.freelyDrawn ? icon.stroke : icon.fill;

        fabric.loadSVGFromURL(src, (objects, option) => {
            let newIcon = fabric.util.groupSVGElements(objects, option);

            //some how object name changes from icons8 to nounApi object type is path
            //so i have to check that the new object is of type noun
            let nounType = !src.includes('icons8');
            if (newIcon.type == 'group' && nounType) {
                newIcon.getObjects().forEach((item) => {
                    item.fill = oldIconFill;
                });
            }

            if (icon.freelyDrawn) {
                newIcon.fill = oldIconFill;
            } else {
                newIcon.fill = oldIconFill;
                newIcon.stroke = icon.stroke;
            }

            newIcon.strokeWidth = icon.strokeWidth;
            newIcon.src = src;
            let shapeAngle = 0;
            if (this.hasShapeContainer) {
                shapeAngle = this.shape.angle;
            }
            let angle = group.angle;
            let {x, y} = group.getCenterPoint();
            let {scaleX,scaleY}=group;
            group.remove(icon);
            group.addWithUpdate(newIcon);
            group.angle = angle;
            newIcon.left = 0;
            newIcon.top = 0;
            newIcon.originX = "center";
            newIcon.originY = "center";
            newIcon.dirty = true;
            group.shape.left = 0;
            group.shape.top = 0;
            let tempAngle = false;

            if (this.hasShapeContainer) {
                this.shape.angle = shapeAngle;
                this.shape.dirty = true;
                newIcon.angle = icon.angle;
            } else {
                newIcon.angle = group.angle;
                tempAngle = true;
            }

            let scale = this._getIconNewScale(newIcon, this.replaceRefBounding);
            if (tempAngle) {
                newIcon.angle = 0;
            }
            newIcon.scaleX = scale*scaleX;
            newIcon.scaleY = scale*scaleY;
            if (this.hasShapeContainer) {
                group.height = group.shape.getScaledHeight();
                group.width = group.shape.getScaledWidth();
            } else {
                group.height = newIcon.height * newIcon.scaleY;
                group.width = newIcon.width * newIcon.scaleX;
            }

            group.setPositionByOrigin({x, y}, 'center', 'center')
            group.dirty = true;
            group.icon.dirty = true;
            group.icon = newIcon;
            group.iconSrc = src;
            group.iconMaxSize = this._getIconMaxScale();
            group.iconSize = newIcon.scaleX;
            group.canvas && group.canvas.renderAll()
            if(scaleX!==1||scaleY!==1){
                this._updateRefBounding()
            }
        });
    }

    removeShape() {
        if (!this.hasShapeContainer) return;
        let {x, y} = this.getCenterPoint();
        this.hasShapeContainer = false;
        this.remove(this.shape);
        this.shape.dirty = true;
        this.width = this.icon.scaleX * this.icon.width;
        this.height = this.icon.scaleY * this.icon.height;
        this.setPositionByOrigin({x: x, y: y}, 'center', 'center')
        this.iconMaxSize = defaultProps.icon.maxScale;
        this.rotate(this.icon.angle)
        this.icon.angle = 0;
        this.shapeBorderWidth = defaultProps.shape.strokeWidth;
        this.shapeBorderColor = defaultProps.shape.stroke;
        this.shapeRadius = defaultProps.shape.radius;
        this.icon.dirty = true;
        this.dirty = true;
        this.canvas && this.canvas.renderAll();
        this._updateRefBounding();

    }

    replaceShape(src) {
        let icon = this.icon;
        let shape = this.shape;
        fabric.loadSVGFromURL(src, (objects, option) => {
            let newShape = fabric.util.groupSVGElements(objects, option);
            newShape.set({left: icon.left, top: icon.top, strokeWidth: 0});
            let scale=1;
            if(this.hasShapeContainer){
                let maxDim = icon.getScaledWidth();
                let height = icon.getScaledHeight();
                if (height > maxDim)
                    maxDim = height;

                  scale = maxDim * 2 / newShape.width;
            }else {
                let maxDim = this.getScaledWidth();
                let height = this.getScaledHeight();
                if (height > maxDim)
                    maxDim = height;

                  scale = maxDim * 2 / newShape.width;
            }



            newShape.scaleX = scale;
            newShape.scaleY = scale;
            newShape.originX = 'center';
            newShape.originY = 'center';
            icon.originX = 'center';
            icon.originY = 'center';
            let {x, y} = this.getCenterPoint();
            this.remove(this.shape);
            this.addWithUpdate(newShape);
            fabric.util.removeFromArray(this._objects, newShape)
            this._objects.splice(0, 0, newShape);

            if (this.hasShapeContainer) {
                if (newShape.type == 'rect') {
                    newShape.rx = this.shapeRadius;
                    newShape.ry = this.shapeRadius;
                }
                newShape.stroke = this.shapeBorderColor;
                newShape.strokeWidth = this.shapeBorderWidth;
                newShape.fill = shape.fill;
            } else {
                newShape.stroke = defaultProps.shape.stroke;
                newShape.strokeWidth = defaultProps.shape.strokeWidth;
                newShape.fill = defaultProps.shape.fill;
            }
            newShape.left = 0;
            newShape.top = 0;
            icon.top = 0;
            icon.left = 0;
            this.shapeSrc = src;
            this.height = newShape.getScaledHeight();
            this.width = newShape.getScaledWidth();
            this.scaleX = 1;
            this.scaleY = 1;
            this.setPositionByOrigin({x: x, y: y}, 'center', 'center')
            this.shape = newShape;
            this.shapeMinSize = this._getShapeMinSize(icon, newShape);
            this.hasShapeContainer = true;
            this.iconMaxSize = this._getIconMaxScale()
            this.shape.dirty = true;
            this.dirty = true;
            this.shapeSize = newShape.scaleX;
            this.canvas && this.canvas.renderAll()
            setTimeout(()=>{
                this._updateRefBounding()
            },500)

        });
    }

    toObject(propertiesToInclude = ['_id', 'title', 'hasShapeContainer', 'shapeSrc', 'iconSrc']) {
        var _includeDefaultValues = this.includeDefaultValues;
        var objsToObject = this._objects
            .filter(function (obj) {
                return !obj.excludeFromExport;
            })
            .map(function (obj) {
                var originalDefaults = obj.includeDefaultValues;
                obj.includeDefaultValues = _includeDefaultValues;
                var _obj = obj.toObject(propertiesToInclude);
                obj.includeDefaultValues = originalDefaults;
                return _obj;
            });
        var obj = fabric.Object.prototype.toObject.call(this, propertiesToInclude);
        obj.objects = objsToObject;
        return obj;
    }

}
fabric.Icon.fromObject = function (object, callback) {
    var objects = object.objects,
        options = fabric.util.object.clone(object, true);
    delete options.objects;
    if (typeof objects === 'string') {
        // it has to be an url or something went wrong.
        return;
    }
    fabric.util.enlivenObjects(objects, function (enlivenedObjects) {
        fabric.util.enlivenObjects([object.clipPath], function (enlivedClipPath) {
            var options = fabric.util.object.clone(object, true);
            options.clipPath = enlivedClipPath[0];
            delete options.objects;
            if (enlivenedObjects.length == 1) {
                enlivenedObjects.unshift(null)
            }
            callback && callback(new fabric.Icon(enlivenedObjects, options, true));
        });
    });

}
fabric.Icon.loadIcon = function (url, callback, iconOptions) {
    //check if icon is svg or not
    if (url.includes('.svg')) {
        fabric.loadSVGFromURL(url, (objects, options) => {
            let icon = fabric.util.groupSVGElements(objects, options);
            callback && callback(new fabric.Icon([null, icon], iconOptions));
        }, null, iconOptions && iconOptions.crossOrigin)
    }

};
// fabric.Icon.prototype.set=  function  set(key, value) {
//     console.log('called')
//     if (typeof key === 'object') {
//         let {scaleX, scaleY} = key;
//         if (scaleX) {
//             this.icon.scaleX *= scaleX;
//             this.width=this.icon.scaleX*this.icon.width;
//             this.icon.dirty=true;
//
//             if (this.hasShapeContainer) {
//                 this.shape.scaleX *= scaleX;
//                 this.width=this.shape.scaleX*this.shape.width;
//                 this.shape.dirty=true;
//             }
//             delete key.scaleX;
//         }
//         if (scaleY) {
//             this.icon.scaleY *= scaleY;
//             this.height=this.icon.scaleY*this.icon.height;
//             this.icon.dirty=true;
//
//             if (this.hasShapeContainer) {
//                 this.shape.scaleY *= scaleY;
//                 this.height=this.shape.scaleY*this.shape.height;
//                 this.shape.dirty=true;
//
//
//             }
//             delete key.scaleY;
//
//         }
//
//
//         this._setObject(key);
//     } else {
//         if(key=='scaleX'){
//             this.icon.scaleX *= value;
//             this.width=this.icon.scaleX*this.icon.width;
//             this.icon.dirty=true;
//
//             if (this.hasShapeContainer) {
//                 this.shape.dirty=true;
//
//                 this.shape.scaleX *= value;
//                 this.width=this.shape.scaleX*this.shape.width;
//             }
//         }else if(key=='scaleY'){
//             this.icon.scaleY *= value;
//             this.height=this.icon.scaleY*this.icon.height;
//             this.icon.dirty=true;
//
//             if (this.hasShapeContainer) {
//                 this.shape.dirty=true;
//
//                 this.shape.scaleY *= value;
//                 this.height=this.shape.scaleY*this.shape.height;
//
//             }
//         }else{
//             this._set(key, value);
//         }
//     }
//     return this;
// }


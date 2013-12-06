/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var canvas;
var canvasContext;
var height;
var width;
var canvasValid = false;

var mousePosX;
var mousePosY;
var isDrag = false;

var refreshRate = 20;

var Objects = [];

// The selected Object
var mySelColor = '#CC0000';
var mySelWidth = 2;
var selectedObject = null; 

var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop; // Padding and border style widths for mouse offsets
var offsetx, offsety;

//TESTES
addObject("square", 500, 200, 100, 100, '#FFC02B', false, false);
addObject("fork", 100, 100, 50, 100, '#2BB8FF', false, false);
addObject("fork", 200, 100, 50, 100, '#2BB8FF', false, false);
addObject("fork", 150, 150, 50, 200, '#2BB8FF', false, false);
addObject("fork", 50, 150, 50, 100, '#2BB8FF', false, false);
addObject("fork", 250, 150, 50, 100, '#2BB8FF', false, false);
addObject("fork", 100, 250, 50, 50, '#2BB8FF', false, false);
addObject("fork", 200, 250, 50, 50, '#2BB8FF', false, false);
addImage("robot", 275, 325, 150, 150, "logo", false, false);
addImage("animals", 200, 500, 150, 150, "beaver", false, false);

init();

function init()
{
    canvas = document.getElementById("dragCanvas"); 
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasContext = canvas.getContext('2d');
    height = canvas.height;
    width = canvas.width;
    
    canvas.onmousedown = mouseDown;
    canvas.onmouseup = myUp;
    canvas.ondblclick = myDblClick;
    
    if (document.defaultView && document.defaultView.getComputedStyle) 
    {
        stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
        stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
        styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
        styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
    }
    
    setInterval(draw, refreshRate);
};

function object()
{
    this.type = "rectangle";
    this.id = "square";
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.fill = '#444444';
    this.ghost = false;
    this.selectable = false;
    this.inColision = false;
    this.visible = true;
}

function imageObj()
{
    this.type = "image";
    this.id = "imgObj";
    this.x = 0;    
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.ghost = true;
    this.selectable = false;
    this.inColision = false;
    this.imageId = "logo";
    this.visible = true;
}

function addImage(id, posX, posY, width, height, imageId, ghost, selectable)
{
    var img = new imageObj();
    img.id = id;
    img.x = posX;
    img.y = posY;
    img.w = width;
    img.h = height;
    img.ghost = ghost;
    img.imageId = imageId;
    img.selectable = selectable;
    Objects.push(img);
    invalidate();
}

function addObject(id, posX, posY, width, height, fill, ghost, selectable)
{
    var obj = new object();
    obj.id = id;
    obj.x = posX;
    obj.y = posY;
    obj.w = width;
    obj.h = height;
    obj.fill = fill;
    obj.ghost = ghost;
    obj.selectable = selectable;
    Objects.push(obj);
    invalidate();
}

function invalidate() {
  canvasValid = false;
}

//wipes the canvas context
function clear(c) {
  c.clearRect(0, 0, width, height);
}

function mouseDown(e)
{
    selectedObject = ClickedObject(e);
    
    if(selectedObject !== null)
    {
        isDrag = true;
        offsetx = mousePosX - selectedObject.x;
        offsety = mousePosY - selectedObject.y;
        canvas.onmousemove = myMove;
    }
}

function ClickedObject(e)
{
    getMouse(e);
    var l = Objects.length;
    for (var i = l-1; i >= 0; i--) 
    {
        if(Objects[i].visible)
        {
            if (Objects[i].x <= mousePosX && Objects[i].x + Objects[i].w >= mousePosX)
                        if (Objects[i].y <= mousePosY && Objects[i].y + Objects[i].h >= mousePosY)
                            return Objects[i];            
        }
    }
    return null;
}

function myMove(e){ //Eu estive aqui - JA
  if (isDrag)
  {
    getMouse(e);
   
    var xOldValue;
    var yOldValue;
    var xNewValue;
    var yNewValue;
           
    var l = Objects.length;
    for (var i = 0; i < l; i++) 
    {
        if(Objects[i] === selectedObject)
        {
            xOldValue = Objects[i].x;
            yOldValue = Objects[i].y;
            xNewValue = Objects[i].x = mousePosX - offsetx;
            yNewValue = Objects[i].y = mousePosY - offsety;  
            break;
        }
    }
      
    for (var i = 0; i < l; i++) 
    {
        if(Objects[i].id === selectedObject.id && Objects[i] !== selectedObject)
        {
            Objects[i].x = Objects[i].x -(xOldValue - xNewValue);
            Objects[i].y = Objects[i].y -(yOldValue - yNewValue);
        }
    }
    
    ColisionDetection();
    // something is changing position so we better invalidate the canvas!
    invalidate();
  }
}

function SetColisionStatus(objId, inColision)
{
    for(var i = 0; i < Objects.length; i++)
    {
        if(Objects[i].id === objId)
        {
            Objects[i].inColision = inColision;
        }
    }
}

function GetObjectsWithId(id)
{
    var ObjectsTemp = [];
    
    for(var i = 0; i < Objects.length; i++)
    {
        if(Objects[i].id === id)
            ObjectsTemp.push(Objects[i]);
    }
    return ObjectsTemp;
}

function ColisionDetection()
{
    //lista de objectos que compoem o objecto complexo
    var ObjectsTemp = GetObjectsWithId(selectedObject.id);
    
    for(var k = 0; k < ObjectsTemp.length; k++)
    {
        for(var i = 0; i < Objects.length; i++)
        {
            if(Objects[i] !== ObjectsTemp[k] && !ObjectsTemp[k].ghost && Objects[i].id !== selectedObject.id)
            {
                if((ObjectsTemp[k].x + ObjectsTemp[k].w < Objects[i].x || ObjectsTemp[k].x > Objects[i].x + Objects[i].w))
                {
                    SetColisionStatus(Objects[i].id, false);
                }
                else if(ObjectsTemp[k].y + ObjectsTemp[k].h < Objects[i].y || ObjectsTemp[k].y > Objects[i].y + Objects[i].h)
                {
                    SetColisionStatus(Objects[i].id, false);
                }
                else if(Objects[i].ghost)
                {
                    SetColisionStatus(Objects[i].id, false);
                }
                else
                {
                    for(var j = 0; j < Objects.length; j++)
                    {
                        if(Objects[j].id === Objects[i].id)
                        {
                            SetColisionStatus(Objects[j].id, true);
                            return;
                        }
                    }
                }
            }
        }
    }
}

function myUp()
{
    isDrag = false;
    canvas.onmousemove = null;
    selectedObject = null;
}

function myDblClick(e)
{
    
}

function draw() 
{   
  if (canvasValid === false) 
  {
    clear(canvasContext);

    // Add stuff you want drawn in the background all the time here
    
    // draw all boxes
    var l = Objects.length;
    for (var i = 0; i < l; i++) 
    {
        if(Objects[i].visible)
        {
            if(Objects[i].type === "rectangle")
                drawshape(Objects[i], Objects[i].fill);
            else if(Objects[i].type === "image")
                drawimage(Objects[i]);
        }
    }
    
    // draw selection
    // right now this is just a stroke along the edge of the selected box
    if (selectedObject !== null && selectedObject.selectable) {
      canvasContext.strokeStyle = mySelColor;
      canvasContext.lineWidth = mySelWidth;
      canvasContext.strokeRect(selectedObject.x,selectedObject.y,selectedObject.w,selectedObject.h);
    }
    
    // Add stuff you want drawn on top all the time here
    
    canvasValid = true;
  }
}

function drawimage(imageObj)
{
    var img = document.getElementById(imageObj.imageId);
    //img.src = "../img/scream.jpg";
   
    canvasContext.drawImage(img, imageObj.x, imageObj.y, imageObj.w, imageObj.h);
    
    if(imageObj.inColision)
    {
      canvasContext.strokeStyle = mySelColor;
      canvasContext.lineWidth = mySelWidth;
      canvasContext.strokeRect(imageObj.x,imageObj.y,imageObj.w,imageObj.h);
    }
}

function drawshape(shape, fill) 
{
    canvasContext.fillStyle = fill;

    // We can skip the drawing of elements that have moved off the screen:
    if (shape.x > width || shape.y > height) return; 
    if (shape.x + shape.w < 0 || shape.y + shape.h < 0) return;

    canvasContext.fillRect(shape.x,shape.y,shape.w,shape.h);
    
    if(shape.inColision)
    {
      canvasContext.strokeStyle = mySelColor;
      canvasContext.lineWidth = mySelWidth;
      canvasContext.strokeRect(shape.x,shape.y,shape.w,shape.h);
    }
}

function getMouse(e) {
      var element = canvas, offsetX = 0, offsetY = 0;

      if (element.offsetParent) {
        do {
          offsetX += element.offsetLeft;
          offsetY += element.offsetTop;
        } while ((element === element.offsetParent));
      }

      // Add padding and border style widths to offset
      offsetX += stylePaddingLeft;
      offsetY += stylePaddingTop;

      offsetX += styleBorderLeft;
      offsetY += styleBorderTop;

      mousePosX = e.pageX - offsetX;
      mousePosY = e.pageY - offsetY;
}
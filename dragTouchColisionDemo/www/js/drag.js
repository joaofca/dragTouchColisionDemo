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

var refershRate = 20;

var Objects = [];

// The selected Object
var mySelColor = '#CC0000';
var mySelWidth = 2;
var selectedObject = null; 

var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop; // Padding and border style widths for mouse offsets
var offsetx, offsety;

//TESTES
addObject(200, 200, 40, 40, '#FFC02B');
addObject(25, 90, 25, 25, '#2BB8FF');

init();

function init()
{
    canvas = document.getElementById("dragCanvas"); 
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
    
    setInterval(draw, refershRate);
};

function object()
{
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.fill = '#444444';
}

function addObject(posX, posY, width, height, fill)
{
    var obj = new object();
    obj.x = posX;
    obj.y = posY;
    obj.w = width;
    obj.h = height;
    obj.fill = fill;
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
        offsetx = mousePosX - selectedObject.x;
        offsety = mousePosY - selectedObject.y;
        selectedObject.x = mousePosX - offsetx;
        selectedObject.y = mousePosY - offsety;
        isDrag = true;
        canvas.onmousemove = myMove;
    }
}

function ClickedObject(e)
{
    getMouse(e);
    var l = Objects.length;
    for (var i = l-1; i >= 0; i--) 
    {
        if (Objects[i].x <= mousePosX && Objects[i].x + Objects[i].w >= mousePosX)
            if (Objects[i].y <= mousePosY && Objects[i].y + Objects[i].h >= mousePosY)
                return Objects[i];
    }
    return null;
}

function myDown(e)
{
getMouse(e);
  clear(canvasContext);
  var l = Objects.length;
  for (var i = l-1; i >= 0; i--) 
  {
    // get image data at the mouse x,y pixel
    var imageData = canvasContext.getImageData(mousePosX, mousePosY, 1, 1);
    //var index = (mousePosX + mousePosY * imageData.width) * 4;
    
    // if the mouse pixel exists, select and break
    if (imageData.data[3] > 0) {
      selectedObject = Objects[i];
      offsetx = mousePosX - selectedObject.x;
      offsety = mousePosY - selectedObject.y;
      selectedObject.x = mousePosX - offsetx;
      selectedObject.y = mousePosY - offsety;
      isDrag = true;
      canvas.onmousemove = myMove;
      invalidate();
      clear(canvasContext);
      return;
    }
  }
  selectedObject = null;
  // clear the ghost canvas for next time
  clear(canvasContext);
  // invalidate because we might need the selection border to disappear
  invalidate();
}

// Happens when the mouse is moving inside the canvas
function myMove(e){
  if (isDrag){
    getMouse(e);
    
    selectedObject.x = mousePosX - offsetx;
    selectedObject.y = mousePosY - offsety;   
    
    // something is changing position so we better invalidate the canvas!
    invalidate();
  }
}

function myUp(){
  isDrag = false;
  canvas.onmousemove = null;
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
    for (var i = 0; i < l; i++) {
        drawshape(canvasContext, Objects[i], Objects[i].fill);
    }
    
    // draw selection
    // right now this is just a stroke along the edge of the selected box
    if (selectedObject !== null) {
      canvasContext.strokeStyle = mySelColor;
      canvasContext.lineWidth = mySelWidth;
      canvasContext.strokeRect(selectedObject.x,selectedObject.y,selectedObject.w,selectedObject.h);
    }
    
    // Add stuff you want drawn on top all the time here
    
    
    canvasValid = true;
  }
}

function drawshape(context, shape, fill) {
  context.fillStyle = fill;
  
  // We can skip the drawing of elements that have moved off the screen:
  if (shape.x > width || shape.y > height) return; 
  if (shape.x + shape.w < 0 || shape.y + shape.h < 0) return;
  
  context.fillRect(shape.x,shape.y,shape.w,shape.h);
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
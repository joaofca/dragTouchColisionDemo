////////////////////////////////////////////////////////////////////////////////
/////// VARIAVEIS GLOBAIS //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var WIN = false;
var LOSE = false;
var SCORE = 0;
var MAXSCORE = 1000;
var TIMER = 60;

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

var mySelColor = '#CC0000';
var mySelWidth = 2;
var selectedObject = null; 

var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop; // Padding and border style widths for mouse offsets
var offsetx, offsety;

init();

////////////////////////////////////////////////////////////////////////////////
/////// OBJECTOS ///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

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
    this.selectable = true;
    this.inColision = false;
    this.colisionDetected = false;
    this.clicable = true;
    this.clicked = false;
    this.stickyClick = false;
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
    this.selectable = true;
    this.inColision = false;
    this.colisionDetected = false;
    this.clicable = true;
    this.clicked = false;
    this.stickyClick = false;
    this.imageId = "logo";
    this.visible = true;
}

function labelObject()
{
    this.type = "label";
    this.id = "imgObj";
    this.x = 0;    
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.fontSize = 10;
    this.font = "Arial";
    this.ghost = true;
    this.selectable = false;
    this.inColision = false;
    this.colisionDetected = false;
    this.clicable = true;
    this.clicked = false;
    this.stickyClick = false;
    this.visible = true;
    this.text = "Texto";
}

////////////////////////////////////////////////////////////////////////////////
/////// FUNÇÕES DE INICIALIZAÇÃO ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//Interface das funções de criação de objectos
//function addLabel(id, posX, posY, width, height, fontSize, text, font, ghost, selectable, visible, stickyClick, clicable)
//function addImage(id, posX, posY, width, height, imageId, ghost, selectable, visible, stickyClick, clicable)
//function addObject(id, posX, posY, width, height, fill, ghost, selectable, visible, stickyClick, clicable)

//Local onde são iniciados os objectos do jogo
function GameInit()
{
    addLabel("pergunta", 150, 420, 300, 100, 22, "Qual a mistura certa?", "22px verdana", true, false, true, true, false);
    addImage("blue", 120, 100, 300, 330, "blueBucket", true, false, true, true, false);
    addImage("green", 100, 500, 100, 110, "greenBucket", true, true, true, true, true);
    addImage("red", 220, 500, 100, 110, "redBucket", true, true, true, true, true);
    addImage("yellow", 340, 500, 100, 110, "yellowBucket", true, true, true, true, true);
    addLabel("respostaCerta", 125, 0, 300, 100, 22, "Muito bem azelha!!!", "40px verdana", true, false, false, true, false);
    addLabel("respostaErrada", 125, 0, 300, 100, 22, "Burro do quaralho!!!", "40px verdana", true, false, false, true, false);
//    addObject("square", 500, 200, 100, 100, '#FFC02B', false, true, true, false);
//    addObject("fork", 100, 100, 50, 100, '#2BB8FF', false, false, true, true);
//    addObject("fork", 200, 100, 50, 100, '#2BB8FF', false, false, true, true);
//    addObject("fork", 150, 150, 50, 200, '#2BB8FF', false, false, true, true);
//    addObject("fork", 50, 150, 50, 100, '#2BB8FF', false, false, true, true);
//    addObject("fork", 250, 150, 50, 100, '#2BB8FF', false, false, true, true);
//    addObject("fork", 100, 250, 50, 50, '#2BB8FF', false, false, true, true);
//    addObject("fork", 200, 250, 50, 50, '#2BB8FF', false, false, true, true);
//    addImage("robot", 275, 325, 150, 150, "logo", false, false, true, true);
//    addImage("animals", 200, 500, 150, 150, "beaver", false, false, true, true);
//    addLabel("pergunta", 0, 0, 300, 100, 22, "Qual é a coisa qual é ela?", "22px verdana", true, true, true, true);
}

//Função que verifica as regras do jogo, despoletando acções. É chamada no draw()
function GameRules()
{
    if(GetObjectWithId("red").clicked)
    {
        GetObjectWithId("respostaErrada").visible = true;
        LOSE = true;
    }
    else if(GetObjectWithId("yellow").clicked && GetObjectWithId("green").clicked)
    {
        GetObjectWithId("respostaCerta").visible = true;
        WIN = true;
    }
}

function init()
{
    canvas = document.getElementById("dragCanvas"); 
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasContext = canvas.getContext('2d');
    height = canvas.height;
    width = canvas.width;
    
    canvas.onmousedown = MouseDown;
    canvas.onmouseup = MouseUp;
    canvas.ondblclick = myDblClick;
    
    if (document.defaultView && document.defaultView.getComputedStyle) 
    {
        stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
        stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
        styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
        styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
    }
    
    setInterval(draw, refreshRate);
    
    GameInit();
};

function addLabel(id, posX, posY, width, height, fontSize, text, font, ghost, selectable, visible, stickyClick, clicable)
{
    var labelObj = new labelObject();
    labelObj.id = id;
    labelObj.x = posX;    
    labelObj.y = posY;
    labelObj.w = width;
    labelObj.h = height;
    labelObj.fontSize = fontSize;
    labelObj.font = font;
    labelObj.ghost = ghost;
    labelObj.selectable = selectable;
    labelObj.visible = visible;
    labelObj.text = text;
    labelObj.stickyClick = stickyClick;
    labelObj.clicable = clicable;
    Objects.push(labelObj);
    invalidate();
}

function addImage(id, posX, posY, width, height, imageId, ghost, selectable, visible, stickyClick, clicable)
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
    img.visible = visible;
    img.stickyClick = stickyClick;
    img.clicable = clicable;
    Objects.push(img);
    invalidate();
}

function addObject(id, posX, posY, width, height, fill, ghost, selectable, visible, stickyClick, clicable)
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
    obj.visible = visible;
    obj.stickyClick = stickyClick;
    obj.clicable = clicable;
    Objects.push(obj);
    invalidate();
}

////////////////////////////////////////////////////////////////////////////////
/////// FUNÇÕES DE CONTROLO ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function MouseDown(e)
{
    if(WIN === false && LOSE === false)
    {
        selectedObject = ClickedObject(e);

     if(selectedObject.clicable)
          selectedObject.clicked = !selectedObject.clicked;

       if(selectedObject !== null)
       {
           isDrag = true;
           offsetx = mousePosX - selectedObject.x;
           offsety = mousePosY - selectedObject.y;
           canvas.onmousemove = OnMouseMove;
       }
       invalidate();       
    }
}

function MouseUp()
{
    isDrag = false;
    canvas.onmousemove = null;
    if(!selectedObject.stickyClick)
        selectedObject.clicked = false;
    selectedObject = null;
    invalidate();
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
                            //if(!Objects[i].ghost)
                                return Objects[i];            
        }
    }
    return null;
}

function OnMouseMove(e){ //Eu estive aqui - JA
  if (isDrag && !selectedObject.ghost)
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



function myDblClick(e)
{
    
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

////////////////////////////////////////////////////////////////////////////////
/////// FUNÇÕES DE COLISÃO /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//Detecta colisões entre objectos
function ColisionDetection()
{
    for(var k = 0; k < Objects.length; k++)
    {
        for(var i = 0; i < Objects.length; i++)
        {
            var obj1 = Objects[k];
            var obj2 = Objects[i];
            
            if(obj1.id !== obj2.id && !obj1.ghost && !obj2.ghost)   //Se não pertencerem ao mesmo objecto complexo e não forem fantasmas
            {
                if(obj1.x + obj1.w > obj2.x && obj1.x < obj2.x)
                {
                    if(obj1.y < obj2.y && obj1.y + obj1.h > obj2.y)
                    {
                        SetColisionDetectionStatus(obj2.id, true);
                        SetColisionDetectionStatus(obj1.id, true);
                    }

                    if(obj1.y < obj2.y + obj2.h && obj1.y > obj2.y)
                    {
                        SetColisionDetectionStatus(obj2.id, true);
                        SetColisionDetectionStatus(obj1.id, true);
                    }
                }
            }
        }
    }
    
    for(var i = 0; i < Objects.length; i++) //colisionDetection reset
    {
        if(Objects[i].colisionDetected)
        {
            SetColisionStatus(Objects[i].id, true);
            Objects[i].colisionDetected = false;
        }
        else
        {
            SetColisionStatus(Objects[i].id, false);
        }
    }
}

//Coloca a flag de colisão para todos os objectos com o mesmo ID (objecto complexo) com o valor recebido
function SetColisionStatus(objId, inColision)
{
    for(var i = 0; i < Objects.length; i++)
        if(Objects[i].id === objId)
            Objects[i].inColision = inColision;
}

//Coloca a flag de colisionDetected com o status recebido para todos os objectos com o mesmo ID
function SetColisionDetectionStatus(id, status)
{
    for(var i = 0;i < Objects.length; i++)
        if(Objects[i].id === id)
            Objects[i].colisionDetected = status;
}

////////////////////////////////////////////////////////////////////////////////
/////// FUNÇÕES DE DESENHO /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

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
            if(Objects[i].type === "rectangle" && Objects[i].visible)
                drawshape(Objects[i]);
            else if(Objects[i].type === "image" && Objects[i].visible)
                drawimage(Objects[i]);
            else if(Objects[i].type === "label" && Objects[i].visible)
                drawLabel(Objects[i]);
        }
    }
    
    // draw selection
    // right now this is just a stroke along the edge of the selected box
//    if (selectedObject !== null && selectedObject.selectable) {
//      canvasContext.strokeStyle = mySelColor;
//      canvasContext.lineWidth = mySelWidth;
//      canvasContext.strokeRect(selectedObject.x,selectedObject.y,selectedObject.w,selectedObject.h);
//    }
    
    // Add stuff you want drawn on top all the time here
    
    GameRules();
    
    canvasValid = true;
  }
}

function drawLabel(labelObj)
{
    if(labelObj.visible)
    {
        canvasContext.font=labelObj.font;
        canvasContext.fillText(labelObj.text, labelObj.x, labelObj.y + labelObj.h/2, labelObj.w, labelObj.h);

        if(labelObj.inColision || labelObj.clicked)
        {
          canvasContext.strokeStyle = mySelColor;
          canvasContext.lineWidth = mySelWidth;
          canvasContext.fillText(labelObj.x,labelObj.y,labelObj.w,labelObj.h);
        }
    }
}

function drawimage(imageObj)
{
    var img = document.getElementById(imageObj.imageId);
    //img.src = "../img/scream.jpg";
   
    canvasContext.drawImage(img, imageObj.x, imageObj.y, imageObj.w, imageObj.h);
    
    if(imageObj.inColision || imageObj.clicked)
    {
      canvasContext.strokeStyle = mySelColor;
      canvasContext.lineWidth = mySelWidth;
      canvasContext.strokeRect(imageObj.x,imageObj.y,imageObj.w,imageObj.h);
    }
}

function drawshape(shape) 
{
    canvasContext.fillStyle = shape.fill;

    // We can skip the drawing of elements that have moved off the screen:
    if (shape.x > width || shape.y > height) return; 
    if (shape.x + shape.w < 0 || shape.y + shape.h < 0) return;

    canvasContext.fillRect(shape.x,shape.y,shape.w,shape.h);
    
    if(shape.inColision || shape.clicked)
    {
      canvasContext.strokeStyle = mySelColor;
      canvasContext.lineWidth = mySelWidth;
      canvasContext.strokeRect(shape.x,shape.y,shape.w,shape.h);
    }
}

function invalidate() {
  canvasValid = false;
}

function clear(c) {
  c.clearRect(0, 0, width, height);
}

////////////////////////////////////////////////////////////////////////////////
/////// FUNÇÕES DE PESQUISA ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//Devolve todos os objectos que têm o ID recebido (objecto complexo)
function GetObjectsWithId(id)
{
    var ObjectsTemp = [];
    
    for(var i = 0; i < Objects.length; i++)
        if(Objects[i].id === id)
            ObjectsTemp.push(Objects[i]);
    
    return ObjectsTemp;
}

//Devolve o 1º objecto que apareça como o ID recebido
function GetObjectWithId(id)
{
    for(var i = 0; i < Objects.length; i++)
        if(Objects[i].id === id)
            return Objects[i];
}
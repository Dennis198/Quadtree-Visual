import Rectangle from "../Methods/rectangle";

//Const Canvas Width and Heights
const CANVAS_WIDTH=800;
const CANVAS_HEIGHT=400;

//Resets the Canvas to the initial state
export function resetCanvas(){
    var canvas = document.getElementById("2d-plane");
    var context = canvas.getContext("2d");
    context.clearRect(0,0,canvas.width,canvas.height);
    context.beginPath();
    context.fillStyle = "#2F4F4F";
    context.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    context.stroke(); 
    var label = document.getElementById("points_in_square");
    label.innerHTML="Point In Square: "+0;
}

//Draws a Point to the Canvas where it was clicked and adds it to the points array
export function drawPointOnClick(e, points){
    var canvas = document.getElementById("2d-plane");
    var context = canvas.getContext("2d");
    var pos = getMousePos(canvas, e);
    let posX = Math.floor(pos.x);
    let posY = Math.floor(pos.y);
    context.fillStyle ="red";
    context.beginPath();
    context.arc(posX, posY, 2, 0, 2*Math.PI);
    context.fill();
    var newPoint=createPoint(posX,posY);
    points.push(newPoint);
    return points;
}

//Draws the Search Area and highlight the Points inside the area
export function drawSearchArea(e, qtree){
    var canvas = document.getElementById("2d-plane");
    var context = canvas.getContext("2d");
    var pos = getMousePos(canvas, e);
    resetCanvas();      
    qtree.draw();
    context.beginPath();
    context.strokeStyle="yellow";
    context.lineWidth=3;
    context.rect(pos.x-50,pos.y-50,100,100); 
    let range = new Rectangle(pos.x,pos.y,50,50);
    let points = [];
    qtree.query(range, points);
    var label = document.getElementById("points_in_square");
    label.innerHTML="Point In Square: "+points.length;
    context.stroke();
    context.lineWidth=1;
    for(let i=0;i<points.length;i++){
        context.beginPath();
        context.fillStyle="yellow";
        context.arc(points[i].x, points[i].y, 4, 0, 2*Math.PI);
        context.fill();
    }  
}

//Gets the Mouse position on the Canvas
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

//Creates a new Point with x,y,label for the array points
const createPoint=(x,y)=>{
    return {
        x:x,
        y:y,
    };
}


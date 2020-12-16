/*
Thise File Builds a Quadtree and handles querys
*/
import Rectangle from "./rectangle";
const MAX_DEPTH=14;

export default class QuadtreeConcrete{
    constructor(boundary, capacity, points=null, depth=0) {
        this.boundary=boundary;
        this.capacity=capacity;
        this.points=[]
        this.isDivided=false;
        this.depth=depth;
        if(points)
        this.insertFather(points);
    }

    insertFather(points){
        for(let i=0;i<points.length;i++){
            if(this.boundary.contains(points[i]))
            this.insert(points[i]);
        }
    }

    deletePointsIfSplit(){
        if(this.isDivided) this.points=[];
    }

    //Insert a Point in the Quadtree
    insert(point){
        if(!this.boundary.contains(point)){
            return false;
        } 
        if((this.points.length<this.capacity && !this.isDivided)||this.depth===MAX_DEPTH){
            this.points.push(point);
            return true;
        } else {
            if(!this.isDivided){
                this.subdivide();
            }
            
            if(this.northeast.insert(point)){
                return true;
            } else if(this.northwest.insert(point)){
                return true;
            } else if(this.southeast.insert(point)){
                return true;
            } else if(this.southwest.insert(point)){
                return true;
            }         
        }
    }

    //Subdivide a Node in the Quadtree if the capacity of a node is reached
    subdivide(){
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;
        let nw = new Rectangle(x-w/2,y-h/2,w/2,h/2);
        this.northwest = new QuadtreeConcrete(nw,this.capacity, this.points, this.depth+1);
        let ne = new Rectangle(x+w/2,y-h/2,w/2,h/2);
        this.northeast = new QuadtreeConcrete(ne,this.capacity, this.points,this.depth+1);
        let sw = new Rectangle(x-w/2,y+h/2,w/2,h/2);
        this.southwest = new QuadtreeConcrete(sw, this.capacity, this.points,this.depth+1);
        let se = new Rectangle(x+w/2,y+h/2,w/2,h/2);
        this.southeast = new QuadtreeConcrete(se,this.capacity, this.points,this.depth+1);
        this.isDivided=true;
        this.deletePointsIfSplit();
    }
    
    //Search for Points in the range
    query(range, found){
        if(!this.boundary.intersects(range)){
            //empty array
            return;
        } else {
            for(let i=0;i<this.points.length;i++){
                if(range.contains(this.points[i])){
                    found.push(this.points[i]);
                }
            }
        }
        //Recursive ask the children to search for points in range
        if(this.isDivided){
            this.northwest.query(range, found);
            this.northeast.query(range, found);
            this.southwest.query(range, found);
            this.southeast.query(range, found);
        }
    }

    //Draw the Boarder of a Node and the points in it
    draw(){
        var canvas = document.getElementById("2d-plane");
        var context = canvas.getContext("2d");
        context.beginPath();
        context.strokeStyle="white";
        context.rect(this.boundary.x-this.boundary.w,this.boundary.y-this.boundary.h,this.boundary.w*2,this.boundary.h*2);       
        context.stroke();
        //Draw recursive the children
        if(this.isDivided){
            this.northeast.draw();
            this.northwest.draw();
            this.southeast.draw();
            this.southwest.draw();
        }
        //Draw Points in Boarder
        for(let i=0;i<this.points.length;i++){
            context.beginPath();
            context.fillStyle="red";
            context.arc(this.points[i].x, this.points[i].y, 2, 0, 2*Math.PI);
            context.fill();
        }
}
}
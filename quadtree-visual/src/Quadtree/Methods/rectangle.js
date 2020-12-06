/*
Thise File Builds a Rectangle (Node) for the Quadtree
*/
export default class Rectangle{
    constructor(x,y,w,h) {
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
    }

    //Check if a point is Inside the rectangle
    contains(point){
        return (point.x >= this.x - this.w &&
            point.x <= this.x + this.w &&
            point.y >= this.y - this.h &&
            point.y <= this.y + this.h
            );
    }

    //Check if a Rectangle(Range) intersects with this rectangle
    intersects(range){
        return !(range.x - range.w > this.x + this.w
            || range.x + range.w < this.x - this.w
            || range.y - range.h > this.y + this.h
            || range.y + range.h < this.y - this.h
            );
    }
}
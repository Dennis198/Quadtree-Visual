import React from 'react';
import "./Quadtree.css";
import {resetCanvas, drawPointOnClick, drawSearchArea} from "./Canvas/methods";
import Rectangle from "./Methods/rectangle";
import QuadtreeConcrete from "./Methods/quadtreeConcrete";
import {Button, Slider} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';

 /**
  Code for the custom slider look
  * */ 
 function ValueLabelComponent(props) {
    const { children, open, value } = props;
  
    return (
      <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
        {children}
      </Tooltip>
    );
  }
  ValueLabelComponent.propTypes = {
    children: PropTypes.element.isRequired,
    open: PropTypes.bool.isRequired,
    value: PropTypes.number.isRequired,
  };

  const PrettoSlider = withStyles({
    root: {
      color: 'red',
      height: 8,
    },
    thumb: {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      marginTop: -8,
      marginLeft: -12,
      '&:focus, &:hover, &$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 4px)',
      top: 4,
      '& *': {
        background: 'transparent',
        color: 'red',
      },
    },
    track: {
      height: 8,
      borderRadius: 4,
    },
    rail: {
      height: 8,
      borderRadius: 4,
    },
  })(Slider);
/**End Slide Code */

//Constants Canvas "2dplane"
const CANVAS_WIDTH=800;
const CANVAS_HEIGHT=400;
const CAPACITY_DEFAULT=4;
const DRAW_MODE_ON_CLICK=0;
const DRAW_MODE_ON_SEARCH=1;
const DRAW_MODE_NONE=-1;

export default class Quadtree extends React.Component{
    intervalID=0;//Intervall for Add random points in Quadtree
    constructor(props){
        super(props);
        this.state = {
            drawMode:DRAW_MODE_ON_CLICK,//0 Points on Click, 1 Points on Move, 2 Draw Seach Area
            points: [],
            pointsInSquareCount:0,
            capacity:CAPACITY_DEFAULT,
            query:false,
            mouseDown: false,
            qtree:new QuadtreeConcrete(new Rectangle(CANVAS_WIDTH/2,CANVAS_HEIGHT/2,CANVAS_WIDTH/2,CANVAS_HEIGHT/2), CAPACITY_DEFAULT),
            addRandomPoints:true,
        }
    }

    componentDidMount(){ 
        resetCanvas();
    }

    //Resets the Canvas and the Quadtree
    reset(){
        resetCanvas();
        this.stopADDRandomPoints();
        this.setState({addRandomPoints:true,drawMode:0,pointsInSquare:[], points:[], qtree: new QuadtreeConcrete(new Rectangle(CANVAS_WIDTH/2,CANVAS_HEIGHT/2,CANVAS_WIDTH/2,CANVAS_HEIGHT/2), this.state.capacity)});   
    }

    //Draws a point on Canvas "2dplane" and save it in the array points
    drawPointOnMove(e){
      if(!this.state.mouseDown){
        return;
      }
        this.onClickEvent(e);
    }

    //Draws a point on Canvas "2dplane" and save it in the array points
    onClickEvent(e){
      if(this.state.drawMode===DRAW_MODE_ON_SEARCH) return; 
      let newPoints = drawPointOnClick(e,this.state.points, this.state.classMode);
      this.setState({points: newPoints});
      let qtree = this.state.qtree;
      qtree.insert(newPoints[newPoints.length-1]);
      this.setState({qtree:qtree});
      resetCanvas();
      qtree.draw();
    }

    //Sets the Variable on Mouse Down to true/ Mouse UP to false
    setsMouseIsDown(){
        this.setState({mouseDown: !this.state.mouseDown})
    }

    //Add random Points
    addRandomPoints(){
        this.setState({addRandomPoints:false, drawMode: DRAW_MODE_NONE});
        let qtree = this.state.qtree;
        let points = this.state.points;
        this.intervalID = setInterval(() => {         
            let newPoint = createPoint(Math.floor(Math.random()*CANVAS_WIDTH),Math.floor(Math.random()*CANVAS_HEIGHT));
            qtree.insert(newPoint);
            points.push(newPoint);
            this.setState({points:points, qtree: qtree});
            resetCanvas();
            qtree.draw();
            if(this.state.addRandomPoints) this.stopADDRandomPoints();
        },200);
    }

    //Stops the "Visual" Training
    stopADDRandomPoints(){
        this.setState({addRandomPoints:true});
        clearInterval(this.intervalID);
    }

    //Draw the Search Area for the Quadtree
    drawSearchArea(e){
        if(!this.state.addRandomPoints)return;
        drawSearchArea(e,this.state.qtree);
    }

    //handles the Capacity Change and reconstruct the quadtree
    handleCapacityChange(e, val){
        this.setState({capacity : val, addRandomPoints:true})
        resetCanvas();
        let qtree = new QuadtreeConcrete(new Rectangle(CANVAS_WIDTH/2,CANVAS_HEIGHT/2,CANVAS_WIDTH/2,CANVAS_HEIGHT/2), val);
        let points = this.state.points;
        for(let i=0;i<points.length;i++){
            qtree.insert(points[i]);
        }
        qtree.draw();
        this.setState({qtree: qtree});
    }

    render(){
        const {drawMode, points, pointsInSquareCount, addRandomPoints} = this.state;
        return(
            <div className="quadtree">
                <h1>Quadtree</h1>
                <Button color={!addRandomPoints ? "primary":"default"} variant="contained" onClick={addRandomPoints? () => this.addRandomPoints():() => this.stopADDRandomPoints()}>Draw Random Point</Button>
                <Button color={drawMode===DRAW_MODE_ON_CLICK ? "primary":"default"} variant="contained" onClick={() => {this.setState({drawMode: DRAW_MODE_ON_CLICK, addRandomPoints:true})}}>Draw Points Click</Button>
                <Button color={drawMode===DRAW_MODE_ON_SEARCH ? "primary":"default"} variant="contained" onClick={() => {this.setState({drawMode: DRAW_MODE_ON_SEARCH, addRandomPoints:true})}}>Search Area</Button>
                <Button variant="contained" onClick={() => this.reset()}>Reset</Button>
                <div className="quadtree__labels">
                    <h4>Point Count: {points.length}</h4>
                    <h4 id="points_in_square">Point In Square: {pointsInSquareCount}</h4>
                    <div className="quadtree__labels__slider">
                    <h4>Capacity Rectangle:</h4>
                        <PrettoSlider className="slider" valueLabelDisplay="on" aria-label="pretto slider" defaultValue={CAPACITY_DEFAULT} min={2} max={20} step={1}
                        onChange={(e, val) => this.handleCapacityChange(e, val)}  
                        />
                    </div>
                </div>
                <canvas className="quadtree__canvas__2dplane" id="2d-plane" width={CANVAS_WIDTH} height={CANVAS_HEIGHT}
                  onMouseDown={()=> this.setsMouseIsDown()}
                  onMouseUp={()=> this.setsMouseIsDown()}
                  onMouseMove={drawMode===DRAW_MODE_ON_CLICK?(e) => this.drawPointOnMove(e):(e) => this.drawSearchArea(e)}
                  onClick={(e) => this.onClickEvent(e)}
                ></canvas>               
            </div>
        );
    }
}

//Creates a new Point with x,y,label for the array points
const createPoint=(x,y)=>{
    return {
        x:x,
        y:y,
    };
}

/**
 *                  <canvas className="quadtree__canvas__2dplane" id="2d-plane" width={CANVAS_WIDTH} height={CANVAS_HEIGHT}
                        onClick={ (e) => this.drawPointOnClick(e)}
                    ></canvas>
 */

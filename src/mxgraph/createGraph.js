import { Graph } from './graph'
import * as mxgraph from 'mxgraph';
const { mxGraph, mxEventObject, mxRectangle } = mxgraph();

mxGraph.prototype.pageFormat = new mxRectangle(0,0,960,540)
mxGraph.prototype.pageScale = 1;
export default function (container,themes,model) {
  // console.log(themes);

  // let graph = new Graph(null, null, null, null, themes);
  // graph.transparentBackground = false;
  // graph.init(container);
  
  // let root = graph.view.getDrawPane().ownerSVGElement;
  // root.style.position = 'absolute';
	// console.log(graph)

  // 初始化画布
	// graph.gridEnabled = false;
	// graph.graphHandler.guidesEnabled = true;
	// graph.setTooltips(false);
	// graph.setConnectable(false);
	// graph.foldingEnabled = true;
	// graph.scrollbars = graph.defaultScrollbars;
	// graph.pageVisible = graph.defaultPageVisible;

	// graph.pageBreaksVisible = graph.pageVisible; 

	// graph.preferPageSize = graph.pageBreaksVisible;

	// graph.background = null;

	// graph.pageScale = mxGraph.prototype.pageScale;

	// graph.pageFormat = mxGraph.prototype.pageFormat;

	// graph.currentScale = 1;
	// graph.currentTranslate.x = 20;
	// graph.currentTranslate.y = 20;

	let graph = new mxGraph(container);
	let svg = graph.view.getDrawPane().ownerSVGElement;
	svg.style.position = 'absolute';
	
	// 设置画布居中
	let root = graph.view.getCanvas();
	console.log(root)
	root.style.transform = 'translate(10px,10px)'

	graph.pageVisible = true;
	graph.view.validateBackground();
	
  // graph.container.style.overflow = (graph.scrollbars) ? 'auto' : 'hidden';
  // graph.fireEvent(new mxEventObject('updateGraphComponents'));
	graph.view.setScale(1);
  return graph
}
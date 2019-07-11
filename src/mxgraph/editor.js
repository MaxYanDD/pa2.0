import * as mxgraph from 'mxgraph';
const {
  mxCell,
  mxEventObject,
  mxGeometry,
  mxEvent,
  mxUtils
} = mxgraph();

function Editor(bus) {
  this.$bus = bus;
}

/**
 * 编辑器初始化
 */
Editor.prototype.init = function(graphs,id) {
  this.graphs = graphs;
  this.activeGraph = this.graphs[id];

  this.graphs.map(graph => {
    graph.getSelectionModel().addListener(mxEvent.CHANGE, this.updateToolBarStates.bind(this));
    graph.getModel().addListener(mxEvent.CHANGE, this.updateToolBarStates.bind(this));
  })
}

/**
 * 切换画布
 */
Editor.prototype.switchGraph = function (id) {
  this.activeGraph = this.graphs[id]
}

/**
 * 创建文本框
 */
Editor.prototype.createText = function (evt) {
  let style = 'text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000'
  let width = 100;
  let height = 30;
  let value = '请输入文字';
  let title = 'Text';
  let showLabel = null;
  let allowCellsInserted = true;

  this.createShap(this.activeGraph, style, width, height, value, title, showLabel, allowCellsInserted,evt)
}

/**
 * 创建图形
 */
Editor.prototype.createShap = function (graph, style, width, height, value, title, showLabel, allowCellsInserted,evt) {
  var cells = [new mxCell((value != null) ? value : '', new mxGeometry(0, 0, width, height), style)];
  cells[0].vertex = true;
  var target = null;
  var allowSplit = true;

  var pt = graph.getFreeInsertPoint();
  var x = pt.x;
  var y = pt.y;

  cells = graph.getImportableCells(cells);
  if (cells.length > 0) {
    graph.stopEditing();

    // Holding alt while mouse is released ignores drop target
    var validDropTarget = (target != null && !mxEvent.isAltDown(evt)) ?
      graph.isValidDropTarget(target, cells, evt) : false;
    var select = null;

    // if (target != null && !validDropTarget) {
    //   target = null;
    // }
    if (!graph.isCellLocked(target || graph.getDefaultParent())) {
      graph.model.beginUpdate();
      try {
        x = Math.round(x);
        y = Math.round(y);

        // Splits the target edge or inserts into target group
        if (allowSplit && graph.isSplitTarget(target, cells, evt)) {
          var clones = graph.cloneCells(cells);
          graph.splitEdge(target, clones, null,
            x - bounds.width / 2, y - bounds.height / 2);
          select = clones;
        } else if (cells.length > 0) {

          select = graph.importCells(cells, x, y, target);
        }
        // Executes parent layout hooks for position/order
        if (graph.layoutManager != null) {
          var layout = graph.layoutManager.getLayout(target);

          if (layout != null) {
            var s = graph.view.scale;
            var tr = graph.view.translate;
            var tx = (x + tr.x) * s;
            var ty = (y + tr.y) * s;

            for (var i = 0; i < select.length; i++) {
              layout.moveCell(select[i], tx, ty);
            }
          }
        }

        if (allowCellsInserted && (evt == null || !mxEvent.isShiftDown(evt))) {
          graph.fireEvent(new mxEventObject('cellsInserted', 'cells', select));
        }
      } catch (e) {
        // TODO error handler
        console.log(e)
      } finally {
        graph.model.endUpdate();
      }

      if (select != null && select.length > 0) {
        // graph.scrollCellToVisible(select[0]);
        graph.setSelectionCells(select);
      }

      if (graph.editAfterInsert && evt != null && mxEvent.isMouseEvent(evt) &&
        select != null && select.length == 1) {
        window.setTimeout(function () {
          graph.startEditing(select[0]);
        }, 0);
      }
    }

    // if (this.editorUi.hoverIcons != null) {
    //   this.editorUi.hoverIcons.update(graph.view.getState(graph.getSelectionCell()));
    // }
  }
}

/**
 * 选中cell时，更新toolbar的状态
 */
Editor.prototype.updateToolBarStates = function(){
	var graph = this.activeGraph;
	var selected = !graph.isSelectionEmpty();
	var vertexSelected = false;
	var edgeSelected = false;

	var cells = graph.getSelectionCells();
	if (cells != null)
	{
    	for (var i = 0; i < cells.length; i++)
    	{
    		var cell = cells[i];
    		
    		if (graph.getModel().isEdge(cell))
    		{
    			edgeSelected = true;
    		}
    		
    		if (graph.getModel().isVertex(cell))
    		{
    			vertexSelected = true;
    		}
    		
    		if (edgeSelected && vertexSelected)
			{
				break;
			}
		}
  }

  var state = graph.view.getState(graph.getSelectionCell());

  this.$bus.$emit('updateToolBarStates',state)
}

export default Editor

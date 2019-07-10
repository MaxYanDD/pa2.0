import * as mxgraph from 'mxgraph';
const {
  mxCell,
  mxPoint,
  mxUtils,
  mxRectangle,
  mxGeometry
} = mxgraph();

function Editor(graph) {
  this.graph = graph;

}

Editor.prototype.switchGraph = function (graph) {
  this.graph = graph;
}

Editor.prototype.createText = function () {
  let style = ''
}

Editor.prototype.createShap = function (graph, style, width, height, value, title, showLabel, allowCellsInserted) {
  var cell = new mxCell((value != null) ? value : '', new mxGeometry(0, 0, width, height), style);
  cell.geometry.setTerminalPoint(new mxPoint(0, height), true);
  cell.geometry.setTerminalPoint(new mxPoint(width, 0), false);
  cell.geometry.relative = true;

  var pt = graph.getFreeInsertPoint();
  var x = pt.x;
  var y = pt.y;

  let cells = graph.getImportableCells([cells]);

  if (cells.length > 0) {
    graph.stopEditing();

    // Holding alt while mouse is released ignores drop target
    var validDropTarget = (target != null && !mxEvent.isAltDown(evt)) ?
      graph.isValidDropTarget(target, cells, evt) : false;
    var select = null;

    if (target != null && !validDropTarget) {
      target = null;
    }

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
        this.editorUi.handleError(e);
      } finally {
        graph.model.endUpdate();
      }

      if (select != null && select.length > 0) {
        graph.scrollCellToVisible(select[0]);
        graph.setSelectionCells(select);
      }

      if (graph.editAfterInsert && evt != null && mxEvent.isMouseEvent(evt) &&
        select != null && select.length == 1) {
        window.setTimeout(function () {
          graph.startEditing(select[0]);
        }, 0);
      }
    }

    if (this.editorUi.hoverIcons != null) {
      this.editorUi.hoverIcons.update(graph.view.getState(graph.getSelectionCell()));
    }

  }

}


export default Editor

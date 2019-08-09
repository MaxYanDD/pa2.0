import * as mxgraph from 'mxgraph';

const { mxClient, mxKeyHandler, mxCell, mxEventObject, mxGeometry, mxEvent, mxTemporaryCellStates, mxResources, mxUtils, mxConstants, mxPoint, mxCodec, mxPrintPreview, mxUndoManager, mxClipboard, mxRectangle } = mxgraph();

function Editor(bus) {
  this.$bus = bus;
  this.activeGraph = null;
}

/**
 * 编辑器初始化
 */
Editor.prototype.init = function(graphs, id) {
  this.loadGraphs(graphs,id)
  // 绑定键盘事件
  this.keyHandler = this.bindKeyHandler();
};

Editor.prototype.loadGraphs = function(graphs,id){
  this.graphs = graphs;
  this.switchGraph(id);
  //创建事务管理
  this.undoManager = this.createUndoManager();

  this.graphs.map(graph => {
    graph.getSelectionModel().addListener(mxEvent.CHANGE, this.updateToolBarStates.bind(this));
    graph.getModel().addListener(mxEvent.CHANGE, this.updateToolBarStates.bind(this));
    // graph.addListener('cellsInserted', (sender, evt) => {
    //   this.insertHandler(evt.getProperty('cells'));
    // });
    // TODO styleChanged 有什么用？
    // graph.addListener('styleChanged', (sender, evt) => {
    //   this.styleChanged(evt)
    // })
    if(graph.myXml){
      this.loadGraphXml(graph.myXml, graph);
    }

  });
}

Editor.prototype.addGraph = function(graph){
  this.graphs.push(graph);
  graph.getSelectionModel().addListener(mxEvent.CHANGE, this.updateToolBarStates.bind(this));
  graph.getModel().addListener(mxEvent.CHANGE, this.updateToolBarStates.bind(this));
  if(graph.myXml){
    this.loadGraphXml(graph.myXml, graph);
  }
}
/**
 * 切换画布
 */
Editor.prototype.switchGraph = function(id) {
  // for (let i = 0; i < this.graphs.length; i++) {
  //   if (this.graphs[i].id == id) {
  //     this.activeGraph = this.graphs[id];
  //     break;
  //   }
  // }



  for (let i = 0; i < this.graphs.length; i++) {
    if (this.graphs[i].container.dataset.id == id) {
      this.activeGraph = this.graphs[i];
      break;
    }
  }

  return this.activeGraph.id
  
};
/**
 * createKeyHandler 绑定键盘事件
 */
Editor.prototype.bindKeyHandler = function(graph) {
  var graph = this.activeGraph;
  var keyHandler = new mxKeyHandler(graph);

  keyHandler.bindKey(46, this.deletCells.bind(this)); // 删除
  keyHandler.bindControlKey(90, this.undo.bind(this)); // 撤销操作
  keyHandler.bindControlShiftKey(90, this.redo.bind(this)); // 重做
  keyHandler.bindControlKey(67, this.copy.bind(this)); // 复制
  keyHandler.bindControlKey(88, this.cut.bind(this)); // 剪切
  keyHandler.bindControlKey(86, this.pasteHere.bind(this)); // 粘贴
  keyHandler.bindControlKey(38, this.toFront.bind(this));
  keyHandler.bindControlKey(40, this.toBack.bind(this));
  keyHandler.bindControlKey(65, this.selectAll.bind(this));
  keyHandler.bindControlKey(76, this.toggleLock.bind(this));
  return keyHandler;
};

/**
 * 撤销操作
 */
Editor.prototype.undo = function() {
  try {
    var graph = this.activeGraph;
    //如果在编辑文字，撤销的话就撤销输入，如果不在编辑，就撤销操作

    if (graph.isEditing()) {
      var value = graph.cellEditor.textarea.innerHTML;
      document.execCommand('undo', false, null);

      if (value == graph.cellEditor.textarea.innerHTML) {
        // 如果文本框内没有文本
        graph.stopEditing(true);
        this.undoManager.undo(graph.id);
      }
    } else {
      this.undoManager.undo(graph.id);
    }
  } catch (e) {
    // ignore all errors
  }
};

Editor.prototype.getGraphById = function(id){
  let graph;
  for (let i = 0; i < this.graphs.length; i++) {
    if (this.graphs[i].id == id) {
      graph = this.graphs[id];
      break;
    }
  }
  return graph
}
/**
 * 重做
 */
Editor.prototype.redo = function() {
  try {
    var graph = this.activeGraph;

    if (graph.isEditing()) {
      document.execCommand('redo', false, null);
    } else {
      this.undoManager.redo(graph.id);
    }
  } catch (e) {
    // ignore all errors
  }
};

/**
 * createUndoManager
 */
Editor.prototype.createUndoManager = function() {
  var undoMgr = new mxUndoManager(100,this);

  this.undoListener = function(sender, evt) {
    evt.properties.edit.graphId = this.activeGraph.id;
    undoMgr.undoableEditHappened(evt.getProperty('edit'));// 每次编辑都会把
  };

  // Installs the command history
  var listener = mxUtils.bind(this, function(sender, evt) {
    this.undoListener.apply(this, arguments);
  });

  this.graphs.forEach(graph => {
    graph.getModel().addListener(mxEvent.UNDO, listener);
    graph.getView().addListener(mxEvent.UNDO, listener);
  })

  var graph = this.activeGraph;

  // Keeps the selection in sync with the history
  var undoHandler = function(sender, evt) {
    var cand = graph.getSelectionCellsForChanges(evt.getProperty('edit').changes);
    var cells = [];

    for (var i = 0; i < cand.length; i++) {
      if (graph.view.getState(cand[i]) != null) {
        cells.push(cand[i]);
      }
    }

    graph.setSelectionCells(cells);
  };

  undoMgr.addListener(mxEvent.UNDO, undoHandler);
  undoMgr.addListener(mxEvent.REDO, undoHandler);

  return undoMgr;
};


/**
 * 删除mxcells;
 */
Editor.prototype.deletCells = function(evt) {
  var graph = this.activeGraph;
  graph.escape();
  var cells = graph.getDeletableCells(graph.getSelectionCells());

  if (cells != null && cells.length > 0) {
    var parents = graph.model.getParents(cells);
    graph.removeCells(cells, evt != null && mxEvent.isShiftDown(evt));

    // Selects parents for easier editing of groups
    if (parents != null) {
      var select = [];

      for (var i = 0; i < parents.length; i++) {
        if (graph.model.contains(parents[i]) && (graph.model.isVertex(parents[i]) || graph.model.isEdge(parents[i]))) {
          select.push(parents[i]);
        }
      }

      graph.setSelectionCells(select);
    }
  }
};

/**
 * copy;
 */
Editor.prototype.copy = function() {
  mxClipboard.copy(this.activeGraph);
};

/**
 * cut;
 */
Editor.prototype.cut = function() {
  mxClipboard.cut(this.activeGraph);
};

/**
 * paste;
 */
Editor.prototype.paste = function() {
  var graph = this.activeGraph;
  if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent())) {
    mxClipboard.paste(graph);
  }
};

/**
 * selectAll;
 */
Editor.prototype.selectAll = function() {
  this.activeGraph.selectAll(null, true);
};

Editor.prototype.toFront = function() {
  this.activeGraph.orderCells(false);
};

Editor.prototype.toBack = function() {
  this.activeGraph.orderCells(true);
};
Editor.prototype.toggleLock = function() {
  var graph = this.activeGraph;
  if (!graph.isSelectionEmpty()) {
    graph.getModel().beginUpdate();
    try {
      var defaultValue = graph.isCellMovable(graph.getSelectionCell()) ? 1 : 0;
      graph.toggleCellStyles(mxConstants.STYLE_MOVABLE, defaultValue);
      graph.toggleCellStyles(mxConstants.STYLE_RESIZABLE, defaultValue);
      graph.toggleCellStyles(mxConstants.STYLE_ROTATABLE, defaultValue);
      graph.toggleCellStyles(mxConstants.STYLE_DELETABLE, defaultValue);
      graph.toggleCellStyles(mxConstants.STYLE_EDITABLE, defaultValue);
      graph.toggleCellStyles('connectable', defaultValue);
    } finally {
      graph.getModel().endUpdate();
    }
  }
};
/**
 * pasteHere;
 */
Editor.prototype.pasteHere = function() {
  var graph = this.activeGraph;
  if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent())) {
    graph.getModel().beginUpdate();
    try {
      var cells = mxClipboard.paste(graph);

      if (cells != null) {
        var includeEdges = true;

        for (var i = 0; i < cells.length && includeEdges; i++) {
          includeEdges = includeEdges && graph.model.isEdge(cells[i]);
        }

        var t = graph.view.translate;
        var s = graph.view.scale;
        var dx = t.x;
        var dy = t.y;
        var bb = null;

        if (cells.length == 1 && includeEdges) {
          var geo = graph.getCellGeometry(cells[0]);

          if (geo != null) {
            bb = geo.getTerminalPoint(true);
          }
        }

        bb = bb != null ? bb : graph.getBoundingBoxFromGeometry(cells, includeEdges);

        if (bb != null) {
          var x = Math.round(graph.snap(graph.popupMenuHandler.triggerX / s - dx));
          var y = Math.round(graph.snap(graph.popupMenuHandler.triggerY / s - dy));

          graph.cellsMoved(cells, x - bb.x, y - bb.y);
        }
      }
    } finally {
      graph.getModel().endUpdate();
    }
  }
};

Editor.prototype.onKeyDown = function(evt) {
  var graph = this.activeGraph;
  if (evt.which == 9 && graph.isEnabled() && !mxEvent.isAltDown(evt)) {
    if (graph.isEditing()) {
      graph.stopEditing(false);
    } else {
      graph.selectCell(!mxEvent.isShiftDown(evt));
    }
    mxEvent.consume(evt);
  }
};

Editor.prototype.onKeyPress = function(evt) {
  var graph = this.activeGraph;

  // KNOWN: Focus does not work if label is empty in quirks mode
  if (!graph.isEditing() && !graph.isSelectionEmpty() && evt.which !== 0 && !mxEvent.isAltDown(evt) && !mxEvent.isControlDown(evt) && !mxEvent.isMetaDown(evt)) {
    graph.escape();
    graph.startEditing();

    // Workaround for FF where char is lost if cursor is placed before char
    if (mxClient.IS_FF) {
      var ce = graph.cellEditor;
      ce.textarea.innerHTML = String.fromCharCode(evt.which);

      // Moves cursor to end of textarea
      var range = document.createRange();
      range.selectNodeContents(ce.textarea);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
};



/**
 * 创建文本框
 */
Editor.prototype.insertText = function(evt) {
  var style = 'text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000';
  var width = 150;
  var height = 60;
  var value = '双击可输入文本';
  var title = 'Text';
  var showLabel = null;
  var allowCellsInserted = true;

  this.createShape(style, width, height, value, title, showLabel, allowCellsInserted, evt);
};

/**
 * 插入图片
 */
Editor.prototype.insertImage = function(imgUrl) {
  var graph = this.activeGraph;
  var img = new Image();

  img.onload = function() {
    var w = img.width;
    var h = img.height;

    if (imgUrl != null && (imgUrl.length > 0 || cells.length > 0)) {
      var select = null;
      graph.getModel().beginUpdate();
      try {
        var pt = graph.getFreeInsertPoint();
        var cells = [graph.insertVertex(graph.getDefaultParent(), null, '', pt.x, pt.y, w, h, 'shape=image;imageAspect=0;aspect=aspect;verticalLabelPosition=bottom;verticalAlign=top;')];
        select = cells;
        graph.fireEvent(new mxEventObject('cellsInserted', 'cells', select));
        // }

        graph.setCellStyles(mxConstants.STYLE_IMAGE, imgUrl.length > 0 ? imgUrl : null, cells);
      } finally {
        graph.getModel().endUpdate();
      }

      if (select != null) {
        graph.setSelectionCells(select);
      }
    }
  };

  img.src = imgUrl;
};

/**
 * 更换图片
 */
Editor.prototype.changeImage = function(imgUrl) {
  var graph = this.activeGraph;
  var img = new Image();

  img.onload = function() {
    var w = img.width;
    var h = img.height;

    var cells = graph.getSelectionCells();
    if (imgUrl != null && (imgUrl.length > 0 || cells.length > 0)) {
      var select = null;
      graph.getModel().beginUpdate();
      try {
        graph.setCellStyles(mxConstants.STYLE_IMAGE, imgUrl.length > 0 ? imgUrl : null, cells);

        // Sets shape only if not already shape with image (label or image)
        var state = graph.view.getState(cells[0]);
        var style = state != null ? state.style : graph.getCellStyle(cells[0]);

        if (style[mxConstants.STYLE_SHAPE] !== 'image' && style[mxConstants.STYLE_SHAPE] !== 'label') {
          graph.setCellStyles(mxConstants.STYLE_SHAPE, 'image', cells);
        } else if (imgUrl.length === 0) {
          graph.setCellStyles(mxConstants.STYLE_SHAPE, null, cells);
        }

        if (graph.getSelectionCount() === 1) {
          if (w != null && h != null) {
            var cell = cells[0];
            var geo = graph.getModel().getGeometry(cell);

            if (geo != null) {
              geo = geo.clone();
              geo.width = w;
              geo.height = h;
              graph.getModel().setGeometry(cell, geo);
            }
          }
        }
      } finally {
        graph.getModel().endUpdate();
      }
    }
    // }
  };

  img.src = imgUrl;
};

/**
 * 插入线
 */
Editor.prototype.insertLine = function(evt) {
  var style = 'endArrow=none;html=1;';
  var width = 150;
  var height = 0;
  var value = '';
  var title = 'Line';
  var showLabel = null;
  var allowCellsInserted = true;
  this.createEdge(style, width, height, value, title, showLabel, allowCellsInserted, evt);
};

/**
 * 插入表格
 */
Editor.prototype.insertTable = function(DomString, w, h) {
  this.createShape('text;html=1;strokeColor=none;fill=none;overflow=fill;rounded=0;', w, h, DomString, 'Table', null, true, null);
};

/*
 * 创建图形
 */
Editor.prototype.createShape = function(style, width, height, value, title, showLabel, allowCellsInserted, evt) {
  var graph = this.activeGraph;
  var cells = [new mxCell(value != null ? value : '', new mxGeometry(0, 0, width, height), style)];
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
    var validDropTarget = target != null && !mxEvent.isAltDown(evt) ? graph.isValidDropTarget(target, cells, evt) : false;
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
          graph.splitEdge(target, clones, null, x - bounds.width / 2, y - bounds.height / 2);
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
        console.log(e);
      } finally {
        graph.model.endUpdate();
      }

      if (select != null && select.length > 0) {
        // graph.scrollCellToVisible(select[0]);
        graph.setSelectionCells(select);
      }

      if (graph.editAfterInsert && evt != null && mxEvent.isMouseEvent(evt) && select != null && select.length === 1) {
        window.setTimeout(function() {
          graph.startEditing(select[0]);
        }, 0);
      }
    }

    // if (this.editorUi.hoverIcons != null) {
    //   this.editorUi.hoverIcons.update(graph.view.getState(graph.getSelectionCell()));
    // }
  }
};

Editor.prototype.createEdge = function(style, width, height, value, title, showLabel, allowCellsInserted, evt) {
  var graph = this.activeGraph;
  var cell = new mxCell(value != null ? value : '', new mxGeometry(0, 0, width, height), style);
  cell.geometry.setTerminalPoint(new mxPoint(0, height), true);
  cell.geometry.setTerminalPoint(new mxPoint(width, 0), false);
  cell.geometry.relative = true;
  cell.edge = true;

  var target = null;
  var allowSplit = false;

  var pt = graph.getFreeInsertPoint();
  var x = pt.x;
  var y = pt.y;

  var cells = graph.getImportableCells([cell]);
  if (cells.length > 0) {
    graph.stopEditing();

    // Holding alt while mouse is released ignores drop target
    var validDropTarget = target != null && !mxEvent.isAltDown(evt) ? graph.isValidDropTarget(target, cells, evt) : false;
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
          graph.splitEdge(target, clones, null, x - bounds.width / 2, y - bounds.height / 2);
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
        console.log(e);
      } finally {
        graph.model.endUpdate();
      }

      if (select != null && select.length > 0) {
        // graph.scrollCellToVisible(select[0]);
        graph.setSelectionCells(select);
      }

      if (graph.editAfterInsert && evt != null && mxEvent.isMouseEvent(evt) && select != null && select.length == 1) {
        window.setTimeout(function() {
          graph.startEditing(select[0]);
        }, 0);
      }
    }

    // if (this.editorUi.hoverIcons != null) {
    //   this.editorUi.hoverIcons.update(graph.view.getState(graph.getSelectionCell()));
    // }
  }
};

/**
 * 选中cell时，更新toolbar的状态
 */
Editor.prototype.updateToolBarStates = function() {
  var graph = this.activeGraph;
  var selected = !graph.isSelectionEmpty();
  var vertexSelected = false;
  var edgeSelected = false;

  if (graph.cellEditor.isContentEditing()) {
    this.keyHandler.setEnabled(false);
  }

  var cells = graph.getSelectionCells();
  if (cells != null) {
    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];

      if (graph.getModel().isEdge(cell)) {
        edgeSelected = true;
      }

      if (graph.getModel().isVertex(cell)) {
        vertexSelected = true;
      }

      if (edgeSelected && vertexSelected) {
        break;
      }
    }
  }

  var state = graph.view.getState(graph.getSelectionCell());

  this.$bus.$emit('updateToolBarStates', state, vertexSelected, edgeSelected);
};

/**
 * 为新建cell添加style
 */
Editor.prototype.insertHandler = function(cells, asText) {
  var styles = ['rounded', 'shadow', 'glass', 'dashed', 'dashPattern', 'comic', 'labelBackgroundColor'];
  var connectStyles = ['shape', 'edgeStyle', 'curved', 'rounded', 'elbow', 'comic', 'jumpStyle', 'jumpSize'];
  var valueStyles = ['fontFamily', 'fontSize', 'fontColor'];

  // Keys that always update the current edge style regardless of selection
  var alwaysEdgeStyles = ['edgeStyle', 'startArrow', 'startFill', 'startSize', 'endArrow', 'endFill', 'endSize'];

  // Keys that are ignored together (if one appears all are ignored)
  var keyGroups = [['startArrow', 'startFill', 'startSize', 'sourcePerimeterSpacing', 'endArrow', 'endFill', 'endSize', 'targetPerimeterSpacing'], ['strokeColor', 'strokeWidth'], ['fillColor', 'gradientColor'], valueStyles, ['opacity'], ['align'], ['html']];

  // Adds all keys used above to the styles array
  for (var i = 0; i < keyGroups.length; i++) {
    for (var j = 0; j < keyGroups[i].length; j++) {
      styles.push(keyGroups[i][j]);
    }
  }

  for (var i = 0; i < connectStyles.length; i++) {
    if (mxUtils.indexOf(styles, connectStyles[i]) < 0) {
      styles.push(connectStyles[i]);
    }
  }

  var graph = this.activeGraph;
  var model = graph.getModel();

  model.beginUpdate();
  try {
    // Applies only basic text styles
    if (asText) {
      var edge = model.isEdge(cell);
      var current = edge ? graph.currentEdgeStyle : graph.currentVertexStyle;
      var textStyles = ['fontSize', 'fontFamily', 'fontColor'];

      for (var j = 0; j < textStyles.length; j++) {
        var value = current[textStyles[j]];

        if (value != null) {
          graph.setCellStyles(textStyles[j], value, cells);
        }
      }
    } else {
      for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];

        // Removes styles defined in the cell style from the styles to be applied
        var cellStyle = model.getStyle(cell);
        var tokens = cellStyle != null ? cellStyle.split(';') : [];
        var appliedStyles = styles.slice();

        for (var j = 0; j < tokens.length; j++) {
          var tmp = tokens[j];
          var pos = tmp.indexOf('=');

          if (pos >= 0) {
            var key = tmp.substring(0, pos);
            var index = mxUtils.indexOf(appliedStyles, key);

            if (index >= 0) {
              appliedStyles.splice(index, 1);
            }

            // Handles special cases where one defined style ignores other styles
            for (var k = 0; k < keyGroups.length; k++) {
              var group = keyGroups[k];

              if (mxUtils.indexOf(group, key) >= 0) {
                for (var l = 0; l < group.length; l++) {
                  var index2 = mxUtils.indexOf(appliedStyles, group[l]);

                  if (index2 >= 0) {
                    appliedStyles.splice(index2, 1);
                  }
                }
              }
            }
          }
        }

        // Applies the current style to the cell
        var edge = model.isEdge(cell);
        var current = edge ? graph.currentEdgeStyle : graph.currentVertexStyle;
        var newStyle = model.getStyle(cell);

        for (var j = 0; j < appliedStyles.length; j++) {
          var key = appliedStyles[j];
          var styleValue = current[key];

          if (styleValue != null && (key != 'shape' || edge)) {
            // Special case: Connect styles are not applied here but in the connection handler
            if (!edge || mxUtils.indexOf(connectStyles, key) < 0) {
              newStyle = mxUtils.setStyle(newStyle, key, styleValue);
              console.log('here', key, styleValue);
            }
          }
        }

        model.setStyle(cell, newStyle);
      }
    }
  } finally {
    model.endUpdate();
  }
};

/**
 * 改变mxcell样式
 */
Editor.prototype.changeStyle = function(key, value) {
  var graph = this.activeGraph;
  if (!Array.isArray(key)) {
    key = [key];
    value = [value];
  }

  graph.getModel().beginUpdate();
  try {
    if (graph.cellEditor.isContentEditing()) {
      if (key[0] == 'fontColor') {
        document.execCommand('foreColor', false, value[0]);
      }
    } else {
      for (var i = 0; i < key.length; i++) {
        graph.setCellStyles(key[i], value[i]);
      }

      graph.fireEvent(new mxEventObject('styleChanged', 'keys', key, 'values', value, 'cells', graph.getSelectionCells()));
    }
  } finally {
    graph.getModel().endUpdate();
  }
};

/**
 * 切换字体样式，粗体，斜体，下划线
 */
Editor.prototype.toggleFontStyle = function(style) {
  var graph = this.activeGraph;
  var fontStyle = {
    bold: 1,
    italic: 2,
    underline: 4
  };
  if (graph.cellEditor.isContentEditing()) {
    document.execCommand(style, true, null);
  } else {
    graph.stopEditing(false);

    graph.getModel().beginUpdate();
    try {
      graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, fontStyle[style]);

      // Removes bold and italic tags and CSS styles inside labels
      if ((fontStyle[style] & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD) {
        graph.updateLabelElements(graph.getSelectionCells(), function(elt) {
          elt.style.fontWeight = null;

          if (elt.nodeName == 'B') {
            graph.replaceElement(elt);
          }
        });
      } else if ((fontStyle[style] & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC) {
        graph.updateLabelElements(graph.getSelectionCells(), function(elt) {
          elt.style.fontStyle = null;

          if (elt.nodeName == 'I') {
            graph.replaceElement(elt);
          }
        });
      } else if ((fontStyle[style] & mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE) {
        graph.updateLabelElements(graph.getSelectionCells(), function(elt) {
          elt.style.textDecoration = null;

          if (elt.nodeName == 'U') {
            graph.replaceElement(elt);
          }
        });
      }
    } finally {
      graph.getModel().endUpdate();
    }
  }
};

/**
 * 设置行高
 */
Editor.prototype.setLineHeight = function(value) {
  var graph = this.activeGraph;
  var selectedElement = graph.getSelectedElement();
  var node = selectedElement;
  var cells = graph.getSelectionCells();
  console.log(node);

  while (node != null && node.nodeType != 1) {
    node = node.parentNode;
  }

  if (node != null && node == graph.cellEditor.textarea && graph.cellEditor.textarea.firstChild != null) {
    if (graph.cellEditor.textarea.firstChild.nodeName != 'P') {
      graph.cellEditor.textarea.innerHTML = '<p>' + graph.cellEditor.textarea.innerHTML + '</p>';
    }

    node = graph.cellEditor.textarea.firstChild;
  }

  if (node != null && node != graph.cellEditor.textarea && graph.cellEditor.textarea.contains(node)) {
    node.style.lineHeight = value;
  }
};

/**
 * 样式改变了后执行
 */
Editor.prototype.styleChanged = function(evt) {
  var cells = evt.getProperty('cells');
  var graph = this.activeGraph;
  var vertex = false;
  var edge = false;
  if (cells.length > 0) {
    for (var i = 0; i < cells.length; i++) {
      vertex = graph.getModel().isVertex(cells[i]) || vertex;
      edge = graph.getModel().isEdge(cells[i]) || edge;
      if (edge && vertex) {
        break;
      }
    }
  } else {
    vertex = true;
    edge = true;
  }

  var keys = evt.getProperty('keys');
  var values = evt.getProperty('values');

  for (var i = 0; i < keys.length; i++) {
    var common = mxUtils.indexOf(valueStyles, keys[i]) >= 0;

    // Ignores transparent stroke colors
    if (keys[i] != 'strokeColor' || (values[i] != null && values[i] != 'none')) {
      // Special case: Edge style and shape
      if (mxUtils.indexOf(connectStyles, keys[i]) >= 0) {
        if (edge || mxUtils.indexOf(alwaysEdgeStyles, keys[i]) >= 0) {
          if (values[i] == null) {
            delete graph.currentEdgeStyle[keys[i]];
          } else {
            graph.currentEdgeStyle[keys[i]] = values[i];
          }
        }
        // Uses style for vertex if defined in styles
        else if (vertex && mxUtils.indexOf(styles, keys[i]) >= 0) {
          if (values[i] == null) {
            delete graph.currentVertexStyle[keys[i]];
          } else {
            graph.currentVertexStyle[keys[i]] = values[i];
          }
        }
      } else if (mxUtils.indexOf(styles, keys[i]) >= 0) {
        if (vertex || common) {
          if (values[i] == null) {
            delete graph.currentVertexStyle[keys[i]];
          } else {
            graph.currentVertexStyle[keys[i]] = values[i];
          }
        }

        if (edge || common || mxUtils.indexOf(alwaysEdgeStyles, keys[i]) >= 0) {
          if (values[i] == null) {
            delete graph.currentEdgeStyle[keys[i]];
          } else {
            graph.currentEdgeStyle[keys[i]] = values[i];
          }
        }
      }
    }
  }
};

/**
 * 获取graph的xml
 */
Editor.prototype.getGraphXml = function(graph) {
  // ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
  // var node = null;

  // if (ignoreSelection)
  // {
  var enc = new mxCodec(mxUtils.createXmlDocument());
  var node = enc.encode(graph.getModel());
  // }
  // else
  // {
  // 	node = graph.encodeCells(mxUtils.sortCells(graph.model.getTopmostCells(
  // 		graph.getSelectionCells())));
  // }
  if (graph.view.translate.x != 0 || graph.view.translate.y != 0) {
    node.setAttribute('dx', Math.round(graph.view.translate.x * 100) / 100);
    node.setAttribute('dy', Math.round(graph.view.translate.y * 100) / 100);
  }

  node.setAttribute('grid', graph.isGridEnabled() ? '1' : '0');
  node.setAttribute('gridSize', graph.gridSize);
  node.setAttribute('guides', graph.graphHandler.guidesEnabled ? '1' : '0');
  node.setAttribute('tooltips', graph.tooltipHandler.isEnabled() ? '1' : '0');
  node.setAttribute('connect', graph.connectionHandler.isEnabled() ? '1' : '0');
  node.setAttribute('arrows', graph.connectionArrowsEnabled ? '1' : '0');
  node.setAttribute('fold', graph.foldingEnabled ? '1' : '0');
  node.setAttribute('page', graph.pageVisible ? '1' : '0');
  node.setAttribute('pageScale', graph.pageScale);
  node.setAttribute('pageWidth', graph.pageFormat.width);
  node.setAttribute('pageHeight', graph.pageFormat.height);

  if (graph.background != null) {
    node.setAttribute('background', graph.background);
  }

  return mxUtils.getXml(node);
};

/**
 * 回填xml格式page
 */
Editor.prototype.loadGraphXml = function(xml, graph) {
  if (xml) {
    var doc = mxUtils.parseXml(xml);
    graph.importGraphModel(doc.documentElement);
  }
};

/**
 * 预览
 */
Editor.prototype.preview = function() {
  var graph = this.activeGraph;
  var autoOrigin = false;
  var printScale = 1;

  if (isNaN(printScale)) {
    printScale = 1;
    pageScaleInput.value = '100%';
  }

  // Workaround to match available paper size in actual print output
  // printScale *= 1;

  var pf = graph.pageFormat || mxConstants.PAGE_FORMAT_A4_PORTRAIT;
  var scale = 1 / graph.pageScale;

  if (autoOrigin) {
    var pageCount = onePageCheckBox.checked ? 1 : parseInt(pageCountInput.value);

    if (!isNaN(pageCount)) {
      scale = mxUtils.getScaleForPageCount(pageCount, graph, pf);
    }
  }

  // Negative coordinates are cropped or shifted if page visible
  var gb = graph.getGraphBounds();
  var border = 0;
  var x0 = 0;
  var y0 = 0;

  // Applies print scale
  pf = mxRectangle.fromRectangle(pf);
  pf.width = Math.ceil(pf.width * printScale);
  pf.height = Math.ceil(pf.height * printScale);
  scale *= printScale;

  // Starts at first visible page
  if (!autoOrigin && graph.pageVisible) {
    var layout = graph.getPageLayout();
    x0 -= layout.x * pf.width;
    y0 -= layout.y * pf.height;
  } else {
    autoOrigin = true;
  }

  var preview = this.createPrintPreview(graph, scale, pf, border, x0, y0, autoOrigin);
  preview.open();
};

Editor.prototype.createPrintPreview = function(graph, scale, pf, border, x0, y0, autoOrigin) {
  var preview = new mxPrintPreview(graph, scale, pf, border, x0, y0);
  preview.title = mxResources.get('preview');
  preview.printBackgroundImage = false;
  preview.autoOrigin = autoOrigin;
  var bg = graph.background;

  if (bg == null || bg == '' || bg == mxConstants.NONE) {
    bg = '#ffffff';
  }

  preview.backgroundColor = bg;

  var writeHead = preview.writeHead;

  // Adds a border in the preview
  preview.writeHead = function(doc) {
    writeHead.apply(this, arguments);

    doc.writeln('<style type="text/css">');
    doc.writeln('@media screen {');
    doc.writeln('  body > div { box-sizing:content-box; }');
    doc.writeln('}');
    doc.writeln(`
      @media print {
        * {
          margin: 0;
        }
        @page {
          margin: 0;
          position: relative;
        }
        body > div {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100% !important;
        }
      }
    `);
    doc.writeln('</style>');
  };

  return preview;
};

/**
 * 创建预览DOM节点列表
 */
Editor.prototype.createSvgStr = function() {

  // var wrapDiv = document.createElement('div');
  // wrapDiv.style.cssText = `
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   z-index: -20;
  // `;
  // document.body.appendChild(wrapDiv);
  var pageStrList = [];
  this.graphs.forEach(graph => {
    var div = document.createElement('div');
    div.style.cssText = `
     overflow: hidden; break-inside: avoid; break-after: avoid;background:#fff;
     width: 1100px;height:742.5px;transform: scale(1.45);transform-origin: 0 0;
    `;
    this.addGraphFragment(div, graph);
    pageStrList.push(div.outerHTML);
  });


  console.log(pageStrList);
  return pageStrList
};

Editor.prototype.addGraphFragment = function(div, graph) {
  var scale = 1;
  var dx = 0;
  var dy = 0;
  var clip = graph.pageFormat;
  var view = graph.getView();
  var previousContainer = graph.container;
  graph.container = div;

  var canvas = view.getCanvas();
  var backgroundPane = view.getBackgroundPane();
  var drawPane = view.getDrawPane();
  var overlayPane = view.getOverlayPane();

  if (graph.dialect == mxConstants.DIALECT_SVG) {
    view.createSvg();

    // Uses CSS transform for scaling
    if (!mxClient.NO_FO) {
      var g = view.getDrawPane().parentNode;
      var prev = g.getAttribute('transform');
      g.setAttribute('transformOrigin', '0 0');
      g.setAttribute('transform', 'scale(' + scale + ',' + scale + ')' + 'translate(' + dx + ',' + dy + ')');

      scale = 1;
      dx = 0;
      dy = 0;
    }
  } else if (graph.dialect == mxConstants.DIALECT_VML) {
    view.createVml();
  } else {
    view.createHtml();
  }

  // Disables events on the view
  var eventsEnabled = view.isEventsEnabled();
  view.setEventsEnabled(false);

  // Disables the graph to avoid cursors
  var graphEnabled = graph.isEnabled();
  graph.setEnabled(false);

  // Resets the translation
  var translate = view.getTranslate();
  view.translate = new mxPoint(dx, dy);

  // Redraws only states that intersect the clip
  var redraw = graph.cellRenderer.redraw;
  var states = view.states;
  var s = view.scale;

  // Gets the transformed clip for intersection check below
  if (this.clipping) {
    var tempClip = new mxRectangle((clip.x + translate.x) * s, (clip.y + translate.y) * s, (clip.width * s) / scale, (clip.height * s) / scale);

    // Checks clipping rectangle for speedup
    // Must create terminal states for edge clipping even if terminal outside of clip
    graph.cellRenderer.redraw = function(state, force, rendering) {
      if (state != null) {
        // Gets original state from graph to find bounding box
        var orig = states.get(state.cell);

        if (orig != null) {
          var bbox = view.getBoundingBox(orig, false);

          // Stops rendering if outside clip for speedup
          if (bbox != null && !mxUtils.intersects(tempClip, bbox)) {
            //return;
          }
        }
      }

      redraw.apply(this, arguments);
    };
  }

  var temp = null;

  try {
    // Creates the temporary cell states in the view and
    // draws them onto the temporary DOM nodes in the view
    var cells = [graph.getModel().getRoot()];
    temp = new mxTemporaryCellStates(
      view,
      scale,
      cells,
      null,
      mxUtils.bind(this, function(state) {
        return graph.getLinkForCell(state.cell);
      })
    );
  } finally {
    // Removes overlay pane with selection handles
    // controls and icons from the print output
    if (mxClient.IS_IE) {
      view.overlayPane.innerHTML = '';
      view.canvas.style.overflow = 'hidden';
      view.canvas.style.position = 'relative';
      view.canvas.style.top = this.marginTop + 'px';
      view.canvas.style.width = clip.width + 'px';
      view.canvas.style.height = clip.height + 'px';
    } else {
      // Removes everything but the SVG node
      var tmp = div.firstChild;

      while (tmp != null) {
        var next = tmp.nextSibling;
        var name = tmp.nodeName.toLowerCase();

        // Note: Width and height are required in FF 11
        if (name == 'svg') {
          tmp.style.overflow = 'hidden';
          tmp.style.position = 'relative';
          tmp.style.top = this.marginTop + 'px';
          tmp.setAttribute('width', clip.width);
          tmp.setAttribute('height', clip.height);
          tmp.style.width = '';
          tmp.style.height = '';
        }
        // Tries to fetch all text labels and only text labels
        else if (tmp.style.cursor != 'default' && name != 'div') {
          tmp.parentNode.removeChild(tmp);
        }

        tmp = next;
      }
    }

    // Puts background image behind SVG output
    if (this.printBackgroundImage) {
      var svgs = div.getElementsByTagName('svg');

      if (svgs.length > 0) {
        svgs[0].style.position = 'absolute';
      }
    }

    // // Completely removes the overlay pane to remove more handles
    // view.overlayPane.parentNode.removeChild(view.overlayPane);

    // // Restores the state of the view
    graph.setEnabled(graphEnabled);
    graph.container = previousContainer;
    graph.cellRenderer.redraw = redraw;
    view.canvas = canvas;
    view.backgroundPane = backgroundPane;
    view.drawPane = drawPane;
    view.overlayPane = overlayPane;
    view.translate = translate;
    temp.destroy();
    view.setEventsEnabled(eventsEnabled);
  }
};

export default Editor;

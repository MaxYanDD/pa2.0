import * as mxgraph from 'mxgraph'

const {
    mxCell,
    mxEventObject,
    mxGeometry,
    mxEvent,
    mxUtils,
    mxConstants,
    mxPoint
} = mxgraph();

function Editor(bus) {
    this.$bus = bus
}

/**
 * 编辑器初始化
 */
Editor.prototype.init = function (graphs, id) {
    this.graphs = graphs;
    this.activeGraph = this.graphs[id];

    this.graphs.map(graph => {
        graph
            .getSelectionModel()
            .addListener(mxEvent.CHANGE, this.updateToolBarStates.bind(this));
        // graph.getModel().addListener(mxEvent.CHANGE, this.updateToolBarStates.bind(this));
        graph.addListener('cellsInserted', (sender, evt) => {
            this.insertHandler(evt.getProperty('cells'))
        })
        // TODO styleChanged 有什么用？
        // graph.addListener('styleChanged', (sender, evt) => {
        //   this.styleChanged(evt)
        // })
    })
}

/**
 * 切换画布
 */
Editor.prototype.switchGraph = function (id) {
    this.activeGraph = this.graphs[id]
};

/**
 * 创建文本框
 */
Editor.prototype.insertText = function (evt) {
    var style =
        'text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000'
    var width = 150;
    var height = 60;
    var value = '双击输入文字';
    var title = 'Text';
    var showLabel = null;
    var allowCellsInserted = true;

    this.createShape(
        style,
        width,
        height,
        value,
        title,
        showLabel,
        allowCellsInserted,
        evt
    )
};

/**
 * 插入图片
 */
Editor.prototype.insertImage = function (imgUrl) {
    var graph = this.activeGraph;
    var img = new Image();

    img.onload = function () {
        var w = img.width;
        var h = img.height;

        if (imgUrl != null && (imgUrl.length > 0 || cells.length > 0)) {
            var select = null;
            graph.getModel().beginUpdate();
            try {
                var pt = graph.getFreeInsertPoint();
                var cells = [
                    graph.insertVertex(
                        graph.getDefaultParent(),
                        null,
                        '',
                        pt.x,
                        pt.y,
                        w,
                        h,
                        'shape=image;imageAspect=0;aspect=aspect;verticalLabelPosition=bottom;verticalAlign=top;'
                    )
                ];
                select = cells;
                graph.fireEvent(new mxEventObject('cellsInserted', 'cells', select));
                // }

                graph.setCellStyles(
                    mxConstants.STYLE_IMAGE,
                    imgUrl.length > 0 ? imgUrl : null,
                    cells
                )
            } finally {
                graph.getModel().endUpdate()
            }

            if (select != null) {
                graph.setSelectionCells(select)
            }
        }
    };

    img.src = imgUrl
};

/**
 * 更换图片
 */
Editor.prototype.changeImage = function (imgUrl) {
    var graph = this.activeGraph;
    var img = new Image();

    img.onload = function () {
        var w = img.width;
        var h = img.height;

        var cells = graph.getSelectionCells();
        if (imgUrl != null && (imgUrl.length > 0 || cells.length > 0)) {
            var select = null;
            graph.getModel().beginUpdate();
            try {

                graph.setCellStyles(
                    mxConstants.STYLE_IMAGE,
                    imgUrl.length > 0 ? imgUrl : null,
                    cells
                );

                // Sets shape only if not already shape with image (label or image)
                var state = graph.view.getState(cells[0]);
                var style = state != null ? state.style : graph.getCellStyle(cells[0]);

                if (
                    style[mxConstants.STYLE_SHAPE] !== 'image' &&
                    style[mxConstants.STYLE_SHAPE] !== 'label'
                ) {
                    graph.setCellStyles(mxConstants.STYLE_SHAPE, 'image', cells)
                } else if (imgUrl.length === 0) {
                    graph.setCellStyles(mxConstants.STYLE_SHAPE, null, cells)
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
 * 插入线条
 */
Editor.prototype.insertLine = function (evt) {
    var style = 'endArrow=none;html=1;';
    var width = 150;
    var height = 0;
    var value = '';
    var title = 'Line';
    var showLabel = null;
    var allowCellsInserted = true;
    this.createEdge(
        style,
        width,
        height,
        value,
        title,
        showLabel,
        allowCellsInserted,
        evt
    )
};

/**
 * 创建图形
 */
Editor.prototype.createShape = function (
    style,
    width,
    height,
    value,
    title,
    showLabel,
    allowCellsInserted,
    evt
) {
    var graph = this.activeGraph;
    var cells = [
        new mxCell(
            value != null ? value : '',
            new mxGeometry(0, 0, width, height),
            style
        )
    ];
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
        var validDropTarget =
            target != null && !mxEvent.isAltDown(evt)
                ? graph.isValidDropTarget(target, cells, evt)
                : false
        var select = null

        // if (target != null && !validDropTarget) {
        //   target = null;
        // }
        if (!graph.isCellLocked(target || graph.getDefaultParent())) {
            graph.model.beginUpdate()
            try {
                x = Math.round(x)
                y = Math.round(y)

                // Splits the target edge or inserts into target group
                if (allowSplit && graph.isSplitTarget(target, cells, evt)) {
                    var clones = graph.cloneCells(cells)
                    graph.splitEdge(
                        target,
                        clones,
                        null,
                        x - bounds.width / 2,
                        y - bounds.height / 2
                    )
                    select = clones
                } else if (cells.length > 0) {
                    select = graph.importCells(cells, x, y, target)
                }
                // Executes parent layout hooks for position/order
                if (graph.layoutManager != null) {
                    var layout = graph.layoutManager.getLayout(target)

                    if (layout != null) {
                        var s = graph.view.scale
                        var tr = graph.view.translate
                        var tx = (x + tr.x) * s
                        var ty = (y + tr.y) * s

                        for (var i = 0; i < select.length; i++) {
                            layout.moveCell(select[i], tx, ty)
                        }
                    }
                }

                if (allowCellsInserted && (evt == null || !mxEvent.isShiftDown(evt))) {
                    graph.fireEvent(new mxEventObject('cellsInserted', 'cells', select))
                }
            } catch (e) {
                // TODO error handler
                console.log(e)
            } finally {
                graph.model.endUpdate()
            }

            if (select != null && select.length > 0) {
                // graph.scrollCellToVisible(select[0]);
                graph.setSelectionCells(select)
            }

            if (
                graph.editAfterInsert &&
                evt != null &&
                mxEvent.isMouseEvent(evt) &&
                select != null &&
                select.length == 1
            ) {
                window.setTimeout(function () {
                    graph.startEditing(select[0])
                }, 0)
            }
        }

        // if (this.editorUi.hoverIcons != null) {
        //   this.editorUi.hoverIcons.update(graph.view.getState(graph.getSelectionCell()));
        // }
    }
}

Editor.prototype.createEdge = function (
    style,
    width,
    height,
    value,
    title,
    showLabel,
    allowCellsInserted,
    evt
) {
    var graph = this.activeGraph
    var cell = new mxCell(
        value != null ? value : '',
        new mxGeometry(0, 0, width, height),
        style
    )
    cell.geometry.setTerminalPoint(new mxPoint(0, height), true)
    cell.geometry.setTerminalPoint(new mxPoint(width, 0), false)
    cell.geometry.relative = true
    cell.edge = true

    var target = null
    var allowSplit = false

    var pt = graph.getFreeInsertPoint()
    var x = pt.x
    var y = pt.y

    var cells = graph.getImportableCells([cell])
    if (cells.length > 0) {
        graph.stopEditing()

        // Holding alt while mouse is released ignores drop target
        var validDropTarget =
            target != null && !mxEvent.isAltDown(evt)
                ? graph.isValidDropTarget(target, cells, evt)
                : false
        var select = null

        // if (target != null && !validDropTarget) {
        //   target = null;
        // }
        if (!graph.isCellLocked(target || graph.getDefaultParent())) {
            graph.model.beginUpdate()
            try {
                x = Math.round(x)
                y = Math.round(y)

                // Splits the target edge or inserts into target group
                if (allowSplit && graph.isSplitTarget(target, cells, evt)) {
                    var clones = graph.cloneCells(cells)
                    graph.splitEdge(
                        target,
                        clones,
                        null,
                        x - bounds.width / 2,
                        y - bounds.height / 2
                    )
                    select = clones
                } else if (cells.length > 0) {
                    select = graph.importCells(cells, x, y, target)
                }
                // Executes parent layout hooks for position/order
                if (graph.layoutManager != null) {
                    var layout = graph.layoutManager.getLayout(target)

                    if (layout != null) {
                        var s = graph.view.scale
                        var tr = graph.view.translate
                        var tx = (x + tr.x) * s
                        var ty = (y + tr.y) * s

                        for (var i = 0; i < select.length; i++) {
                            layout.moveCell(select[i], tx, ty)
                        }
                    }
                }

                if (allowCellsInserted && (evt == null || !mxEvent.isShiftDown(evt))) {
                    graph.fireEvent(new mxEventObject('cellsInserted', 'cells', select))
                }
            } catch (e) {
                // TODO error handler
                console.log(e)
            } finally {
                graph.model.endUpdate()
            }

            if (select != null && select.length > 0) {
                // graph.scrollCellToVisible(select[0]);
                graph.setSelectionCells(select)
            }

            if (
                graph.editAfterInsert &&
                evt != null &&
                mxEvent.isMouseEvent(evt) &&
                select != null &&
                select.length == 1
            ) {
                window.setTimeout(function () {
                    graph.startEditing(select[0])
                }, 0)
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
Editor.prototype.updateToolBarStates = function () {
    var graph = this.activeGraph
    var selected = !graph.isSelectionEmpty()
    var vertexSelected = false
    var edgeSelected = false

    var cells = graph.getSelectionCells()
    if (cells != null) {
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i]

            if (graph.getModel().isEdge(cell)) {
                edgeSelected = true
            }

            if (graph.getModel().isVertex(cell)) {
                vertexSelected = true
            }

            if (edgeSelected && vertexSelected) {
                break
            }
        }
    }

    var state = graph.view.getState(graph.getSelectionCell())

    this.$bus.$emit('updateToolBarStates', state, vertexSelected, edgeSelected)
}

/**
 * 为新建cell添加style
 */
Editor.prototype.insertHandler = function (cells, asText) {
    var styles = [
        'rounded',
        'shadow',
        'glass',
        'dashed',
        'dashPattern',
        'comic',
        'labelBackgroundColor'
    ]
    var connectStyles = [
        'shape',
        'edgeStyle',
        'curved',
        'rounded',
        'elbow',
        'comic',
        'jumpStyle',
        'jumpSize'
    ]
    var valueStyles = ['fontFamily', 'fontSize', 'fontColor']

    // Keys that always update the current edge style regardless of selection
    var alwaysEdgeStyles = [
        'edgeStyle',
        'startArrow',
        'startFill',
        'startSize',
        'endArrow',
        'endFill',
        'endSize'
    ]

    // Keys that are ignored together (if one appears all are ignored)
    var keyGroups = [
        [
            'startArrow',
            'startFill',
            'startSize',
            'sourcePerimeterSpacing',
            'endArrow',
            'endFill',
            'endSize',
            'targetPerimeterSpacing'
        ],
        ['strokeColor', 'strokeWidth'],
        ['fillColor', 'gradientColor'],
        valueStyles,
        ['opacity'],
        ['align'],
        ['html']
    ]

    // Adds all keys used above to the styles array
    for (var i = 0; i < keyGroups.length; i++) {
        for (var j = 0; j < keyGroups[i].length; j++) {
            styles.push(keyGroups[i][j])
        }
    }

    for (var i = 0; i < connectStyles.length; i++) {
        if (mxUtils.indexOf(styles, connectStyles[i]) < 0) {
            styles.push(connectStyles[i])
        }
    }

    var graph = this.activeGraph
    var model = graph.getModel()

    model.beginUpdate()
    try {
        // Applies only basic text styles
        if (asText) {
            var edge = model.isEdge(cell)
            var current = edge ? graph.currentEdgeStyle : graph.currentVertexStyle
            var textStyles = ['fontSize', 'fontFamily', 'fontColor']

            for (var j = 0; j < textStyles.length; j++) {
                var value = current[textStyles[j]]

                if (value != null) {
                    graph.setCellStyles(textStyles[j], value, cells)
                }
            }
        } else {
            for (var i = 0; i < cells.length; i++) {
                var cell = cells[i]

                // Removes styles defined in the cell style from the styles to be applied
                var cellStyle = model.getStyle(cell)
                var tokens = cellStyle != null ? cellStyle.split(';') : []
                var appliedStyles = styles.slice()

                for (var j = 0; j < tokens.length; j++) {
                    var tmp = tokens[j]
                    var pos = tmp.indexOf('=')

                    if (pos >= 0) {
                        var key = tmp.substring(0, pos)
                        var index = mxUtils.indexOf(appliedStyles, key)

                        if (index >= 0) {
                            appliedStyles.splice(index, 1)
                        }

                        // Handles special cases where one defined style ignores other styles
                        for (var k = 0; k < keyGroups.length; k++) {
                            var group = keyGroups[k]

                            if (mxUtils.indexOf(group, key) >= 0) {
                                for (var l = 0; l < group.length; l++) {
                                    var index2 = mxUtils.indexOf(appliedStyles, group[l])

                                    if (index2 >= 0) {
                                        appliedStyles.splice(index2, 1)
                                    }
                                }
                            }
                        }
                    }
                }

                // Applies the current style to the cell
                var edge = model.isEdge(cell)
                var current = edge ? graph.currentEdgeStyle : graph.currentVertexStyle
                var newStyle = model.getStyle(cell)

                for (var j = 0; j < appliedStyles.length; j++) {
                    var key = appliedStyles[j]
                    var styleValue = current[key]

                    if (styleValue != null && (key != 'shape' || edge)) {
                        // Special case: Connect styles are not applied here but in the connection handler
                        if (!edge || mxUtils.indexOf(connectStyles, key) < 0) {
                            newStyle = mxUtils.setStyle(newStyle, key, styleValue)
                            console.log('here', key, styleValue)
                        }
                    }
                }

                model.setStyle(cell, newStyle)
            }
        }
    } finally {
        model.endUpdate()
    }
}

/**
 * 改变样式
 */
Editor.prototype.changeStyle = function (key, value) {
    var graph = this.activeGraph
    if (!Array.isArray(key)) {
        key = [key]
        value = [value]
    }

    graph.stopEditing(false)
    graph.getModel().beginUpdate()
    try {
        for (var i = 0; i < key.length; i++) {
            graph.setCellStyles(key[i], value[i])
        }

        graph.fireEvent(
            new mxEventObject(
                'styleChanged',
                'keys',
                key,
                'values',
                value,
                'cells',
                graph.getSelectionCells()
            )
        )
    } finally {
        graph.getModel().endUpdate()
    }
}

/**
 * 切换字体样式，粗体，斜体，下划线
 */
Editor.prototype.toggleFontStyle = function (style) {
    var graph = this.activeGraph
    var fontStyle = {
        bold: 1,
        italic: 2,
        underline: 4
    }
    if (graph.cellEditor.isContentEditing()) {
        document.execCommand(style, true, null)
    } else {
        graph.stopEditing(false)

        graph.getModel().beginUpdate()
        try {
            graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, fontStyle[style])

            // Removes bold and italic tags and CSS styles inside labels
            if ((fontStyle[style] & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD) {
                graph.updateLabelElements(graph.getSelectionCells(), function (elt) {
                    elt.style.fontWeight = null

                    if (elt.nodeName == 'B') {
                        graph.replaceElement(elt)
                    }
                })
            } else if (
                (fontStyle[style] & mxConstants.FONT_ITALIC) ==
                mxConstants.FONT_ITALIC
            ) {
                graph.updateLabelElements(graph.getSelectionCells(), function (elt) {
                    elt.style.fontStyle = null

                    if (elt.nodeName == 'I') {
                        graph.replaceElement(elt)
                    }
                })
            } else if (
                (fontStyle[style] & mxConstants.FONT_UNDERLINE) ==
                mxConstants.FONT_UNDERLINE
            ) {
                graph.updateLabelElements(graph.getSelectionCells(), function (elt) {
                    elt.style.textDecoration = null

                    if (elt.nodeName == 'U') {
                        graph.replaceElement(elt)
                    }
                })
            }
        } finally {
            graph.getModel().endUpdate()
        }
    }
}

/**
 * 样式改变了后执行
 */
Editor.prototype.styleChanged = function (evt) {
    var cells = evt.getProperty('cells')
    var graph = this.activeGraph
    var vertex = false
    var edge = false
    if (cells.length > 0) {
        for (var i = 0; i < cells.length; i++) {
            vertex = graph.getModel().isVertex(cells[i]) || vertex
            edge = graph.getModel().isEdge(cells[i]) || edge
            if (edge && vertex) {
                break
            }
        }
    } else {
        vertex = true
        edge = true
    }

    var keys = evt.getProperty('keys')
    var values = evt.getProperty('values')

    for (var i = 0; i < keys.length; i++) {
        var common = mxUtils.indexOf(valueStyles, keys[i]) >= 0

        // Ignores transparent stroke colors
        if (
            keys[i] != 'strokeColor' ||
            (values[i] != null && values[i] != 'none')
        ) {
            // Special case: Edge style and shape
            if (mxUtils.indexOf(connectStyles, keys[i]) >= 0) {
                if (edge || mxUtils.indexOf(alwaysEdgeStyles, keys[i]) >= 0) {
                    if (values[i] == null) {
                        delete graph.currentEdgeStyle[keys[i]]
                    } else {
                        graph.currentEdgeStyle[keys[i]] = values[i]
                    }
                }
                // Uses style for vertex if defined in styles
                else if (vertex && mxUtils.indexOf(styles, keys[i]) >= 0) {
                    if (values[i] == null) {
                        delete graph.currentVertexStyle[keys[i]]
                    } else {
                        graph.currentVertexStyle[keys[i]] = values[i]
                    }
                }
            } else if (mxUtils.indexOf(styles, keys[i]) >= 0) {
                if (vertex || common) {
                    if (values[i] == null) {
                        delete graph.currentVertexStyle[keys[i]]
                    } else {
                        graph.currentVertexStyle[keys[i]] = values[i]
                    }
                }

                if (edge || common || mxUtils.indexOf(alwaysEdgeStyles, keys[i]) >= 0) {
                    if (values[i] == null) {
                        delete graph.currentEdgeStyle[keys[i]]
                    } else {
                        graph.currentEdgeStyle[keys[i]] = values[i]
                    }
                }
            }
        }
    }
}

export default Editor

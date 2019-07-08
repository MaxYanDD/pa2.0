import * as mxgraph from 'mxgraph';
import EditorUi from './editorUi';
import {
  Editor
} from './editor'
import { Graph } from './graph'
const {
  mxUtils,
  mxResources,
  mxGraphView
} = mxgraph();
console.dir(mxGraphView);

export default function main() {
  var editorUiInit = EditorUi.prototype.init;
  EditorUi.prototype.init = function () { // 设置File
    editorUiInit.apply(this, arguments);
    this.actions.get('export').setEnabled(false);
    // Updates action states which require a backend
    if (!Editor.useLocalStorage) {
      mxUtils.post(OPEN_URL, '', mxUtils.bind(this, function (req) {
        var enabled = req.getStatus() != 404;
        this.actions.get('open').setEnabled(enabled || Graph.fileSupport);
        this.actions.get('import').setEnabled(enabled || Graph.fileSupport);
        this.actions.get('save').setEnabled(enabled);
        this.actions.get('saveAs').setEnabled(enabled);
        this.actions.get('export').setEnabled(enabled);
      }));
    }
  };

  // Adds required resources (disables loading of fallback properties, this can only
  // be used if we know that all keys are defined in the language specific file)
  mxResources.loadDefaultBundle = false;
  // var bundle = mxResources.getDefaultBundle(RESOURCE_BASE, mxLanguage) ||
  //   mxResources.getSpecialBundle(RESOURCE_BASE, mxLanguage);

  // Fixes possible asynchronous requests
  mxUtils.getAll(['/static/grapheditor_zh.txt', STYLE_PATH + '/static/default.xml'], function (xhr) { //获取语言设置请求，和默认配置请求
    // Adds bundle text to resources

    mxResources.parse(xhr[0].getText()); // 挂载到mxResources.resource

    // Configures the default graph theme
    var themes = new Object();
    themes[Graph.prototype.defaultThemeName] = xhr[1].getDocumentElement();

    // Main
    new EditorUi(new Editor(urlParams['chrome'] == '0', themes)); // 这里的themes是xml结构的，<mxStylesheet> ... </mxStylesheet>
  }, function () {
    document.body.innerHTML =
      '<center style="margin-top:10%;">Error loading resource files. Please check browser console.</center>';
  });
}

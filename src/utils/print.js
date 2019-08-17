import * as jsPDF from 'jspdf'
import domtoimage from 'dom-to-image';

class pdfPrint {
  constructor(container){
    this.progress = 0;
    this.container = container;
  }

  converToBase64(){

  }
}

export default async function print(name) {
  let printDom = document.querySelector('.print-wrap');
  let nodes = document.querySelectorAll('.print-wrap > div')
  let svgImages = printDom.querySelectorAll('image');

  // 先将svg中image标签的href转为base64;
  if(svgImages.length > 0){
    let converToBase64pormiseList = [];
    svgImages.forEach(image => {
      converToBase64pormiseList.push(converToBase64(image));
    });
  }

  // 将图片转换为base64,不管有没有成功，都会往下走
  await Promise.all(converToBase64pormiseList.map(p => p.catch(e => {console.log('图片未加载成功')})));

  let doc = new jsPDF({ orientation: 'landscape', format: 'a3', unit: 'mm' });
  
  let promiseList = [];
  nodes.forEach(node => {
    promiseList.push(domtoimage.toJpeg(node, { quality: 1 }));
  });

  // 执行domtoimg
  const dataUrlList = await Promise.all(promiseList.map(p => p.catch(e => {console.log(e)})));

  dataUrlList.forEach((dataUrl, index) => {
    doc.addImage(dataUrl, 'JPEG', 0, 0, 420, 297);
    if (index < dataUrlList.length - 1) {
      doc.addPage('a3', 'landscape');
    }
  });

  doc.save(name + '.pdf');
}


function converToBase64(svgimg) {
  return new Promise((resolve,reject) => {
    let imgsrc = svgimg.href.baseVal;
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    let img = new Image();
    img.setAttribute('crossOrigin', 'Anonymous');
    img.onload = () => {
      console.log('img onload')
      const { width, height } = img;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      svgimg.href.baseVal = canvas.toDataURL('image/png');
      resolve()
      canvas = null;
    };
    img.onerror = () => {
      console.log('img onerror')
      reject();
    }

    // 加上时间戳阻止缓存
    img.src = imgsrc + "?timeStamp="+new Date();
  })
  
}

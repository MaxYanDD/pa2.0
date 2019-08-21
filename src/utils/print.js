import * as jsPDF from 'jspdf'
import domtoimage from 'dom-to-image';


function pdfPrint(){
  this.progress = 0;
}

pdfPrint.prototype.setPro = function(val){
  this.progress = val;
}

pdfPrint.prototype.getPro = function(){
  return this.progress;
}

pdfPrint.prototype.print = async function(name){
  let printDom = document.querySelector('.print-wrap');
  let nodes = document.querySelectorAll('.print-wrap > div')
  let svgImages = printDom.querySelectorAll('image');
  let nodestep = 60 / nodes.length
  let imgstep = 30/ svgImages.length;
  // 先将svg中image标签的href转为base64;
  if(svgImages.length > 0){
    let converToBase64pormiseList = [];
    svgImages.forEach(image => {
      converToBase64pormiseList.push(this.converToBase64(image,imgstep));
    });

  // 将图片转换为base64,不管有没有成功，都会往下走
    await Promise.all(converToBase64pormiseList.map(p => p.then((url) => {this.setPro(this.progress + imgstep);return url}).catch(e => {console.log('图片未加载成功')})));
  }

  this.setPro(30)


  let doc = new jsPDF({ orientation: 'landscape', format: 'a3', unit: 'mm' });
  
  let promiseList = [];
  nodes.forEach(node => {
    promiseList.push(domtoimage.toJpeg(node, { quality: 1 }));
  });

  
  // 执行domtoimg
  const dataUrlList = await Promise.all(promiseList.map(p => p.then((url) => {this.setPro(this.progress + nodestep);return url}).catch(e => {console.log(e)})));
  this.setPro(90);
  dataUrlList.forEach((dataUrl, index) => {
    doc.addImage(dataUrl, 'JPEG', 0, 0, 420, 297);
    if (index < dataUrlList.length - 1) {
      doc.addPage('a3', 'landscape');
    }
  });

  doc.save(name + '.pdf');
  this.setPro(100)
}

pdfPrint.prototype.converToBase64 = function(svgimg,imgstep) {
  return new Promise((resolve,reject) => {
    let imgsrc = svgimg.href.baseVal;
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let scale = 2;

    let img = new Image();
    img.setAttribute('crossOrigin', 'Anonymous');
    img.onload = () => {
      scale = /\.svg/.test(imgsrc) ? 4 : 2;
      const { width, height } = img;
      canvas.width = width*scale;
      canvas.height = height*scale;
      ctx.drawImage(img, 0, 0, width*scale, height*scale);
      svgimg.href.baseVal = canvas.toDataURL('image/png');
      resolve()
      canvas = null;
      this.setPro(this.progress + imgstep)
    };
    img.onerror = () => {
      console.log('img onerror')
      reject();
    }

    // 加上时间戳阻止缓存
    img.src = imgsrc + "?timeStamp="+Date.now();
  })
  
}




// export default async function print(name) {
//   let printDom = document.querySelector('.print-wrap');
//   let nodes = document.querySelectorAll('.print-wrap > div')
//   let svgImages = printDom.querySelectorAll('image');

//   // 先将svg中image标签的href转为base64;
//   if(svgImages.length > 0){
//     let converToBase64pormiseList = [];
//     svgImages.forEach(image => {
//       converToBase64pormiseList.push(converToBase64(image));
//     });
//     await Promise.all(converToBase64pormiseList.map(p => p.catch(e => {console.log('图片未加载成功')})));
//   }

//   // 将图片转换为base64,不管有没有成功，都会往下走

//   let doc = new jsPDF({ orientation: 'landscape', format: 'a3', unit: 'mm' });
  
//   let promiseList = [];
//   nodes.forEach(node => {
//     promiseList.push(domtoimage.toJpeg(node, { quality: 1 }));
//   });

//   // 执行domtoimg
//   const dataUrlList = await Promise.all(promiseList.map(p => p.catch(e => {console.log(e)})));

//   dataUrlList.forEach((dataUrl, index) => {
//     doc.addImage(dataUrl, 'JPEG', 0, 0, 420, 297);
//     if (index < dataUrlList.length - 1) {
//       doc.addPage('a3', 'landscape');
//     }
//   });

//   doc.save(name + '.pdf');
// }


export default pdfPrint
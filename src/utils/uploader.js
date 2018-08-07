// 全局对象，不同function使用传递数据
const imgFile = {};
const uploader = {
  upload: function (file, callback) {
      // 判断是否是ios
      if(!!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
        // iOS
        this.transformFileToFormData(file);
        return;
      }

      // 图片压缩之旅
      this.transformFileToDataUrl(file, callback);
    },
    transformFileToFormData: function (file, callback) {  // 将File append进 FormData
      const formData = new FormData();
      // 自定义formData中的内容
      // type
      formData.append('type', file.type);
      // size
      formData.append('size', file.size || "image/jpeg");
      // name
      formData.append('name', file.name);
      // lastModifiedDate
      formData.append('lastModifiedDate', file.lastModifiedDate);
      // append 文件
      formData.append('file', file);
      // 上传图片
      this.uploadImg(formData, callback);
    },
    transformFileToDataUrl: function (file, callback) {
      const imgCompassMaxSize = 200 * 1024; // 超过 200k 就压缩

      // 存储文件相关信息
      imgFile.type = file.type || 'image/jpeg'; // 部分安卓出现获取不到type的情况
      imgFile.size = file.size;
      imgFile.name = file.name;
      imgFile.lastModifiedDate = file.lastModifiedDate;

      // 封装好的函数
      const reader = new FileReader();

      // file转dataUrl是个异步函数，要将代码写在回调里
      reader.onload = function(e) {
        const result = e.target.result;

        if(result.length < imgCompassMaxSize) {
          this.compress(result, false,callback);    // 图片不压缩
        } else {
          this.compress(result, callback);            // 图片压缩
        }
      };

      reader.readAsDataURL(file);
    },
    compress: function(dataURL, shouldCompress = true, callback) {
      const img = new window.Image();

      img.src = dataURL;

      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        let compressedDataUrl;

        if(shouldCompress){
          compressedDataUrl = canvas.toDataURL(imgFile.type, 0.2);
        } else {
          compressedDataUrl = canvas.toDataURL(imgFile.type, 1);
        }

        this.processData(compressedDataUrl, callback);
      }
    },
    processData: function(dataURL, callback) {
      // 这里使用二进制方式处理dataUrl
      const binaryString = window.atob(dataUrl.split(',')[1]);
      const arrayBuffer = new ArrayBuffer(binaryString.length);
      const intArray = new Uint8Array(arrayBuffer);
      const imgFile = this.imgFile;

      for (let i = 0, j = binaryString.length; i < j; i++) {
        intArray[i] = binaryString.charCodeAt(i);
      }

      const data = [intArray];

      let blob;

      try {
        blob = new Blob(data, { type: imgFile.type });
      } catch (error) {
        window.BlobBuilder = window.BlobBuilder ||
          window.WebKitBlobBuilder ||
          window.MozBlobBuilder ||
          window.MSBlobBuilder;
        if (error.name === 'TypeError' && window.BlobBuilder){
          const builder = new BlobBuilder();
          builder.append(arrayBuffer);
          blob = builder.getBlob(imgFile.type);
        } else {
          // Toast.error("版本过低，不支持上传图片", 2000, undefined, false);
          throw new Error('版本过低，不支持上传图片');
        }
      }

      // blob 转file
      const fileOfBlob = new File([blob], imgFile.name);
      const formData = new FormData();

      // type
      formData.append('type', imgFile.type);
      // size
      formData.append('size', fileOfBlob.size);
      // name
      formData.append('name', imgFile.name);
      // lastModifiedDate
      formData.append('lastModifiedDate', imgFile.lastModifiedDate);
      // append 文件
      formData.append('file', fileOfBlob);

      this.uploadImg(formData, callback);
    },
    uploadImg:function(formData, callback) {
      const xhr = new XMLHttpRequest();

      // 进度监听
      xhr.upload.addEventListener('progress', (e)=>{console.log(e.loaded / e.total)}, false);
      // 加载监听
      // xhr.addEventListener('load', ()=>{console.log("加载中");}, false);
      // 错误监听
      xhr.addEventListener('error', ()=>{console.log("上传失败！", 2000, undefined, false);}, false);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          const result = JSON.parse(xhr.responseText);
          if (xhr.status === 200) {
            // 上传成功
            callback('success');
          } else {
            // 上传失败
            callback('error');
          }
        }
      };
      xhr.open('POST', '/uploadUrl' , true);
      xhr.send(formData);
    }
}

export default uploader;

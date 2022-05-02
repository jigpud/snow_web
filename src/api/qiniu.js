import http from "../http/axios";
import * as qiniu from "qiniu-js";

// 获取景点照片的upload token
export function getAttractionImgUploadToken(onSuccess, onFailed) {
  const token = localStorage.getItem('token');
  http.get("/upload/token/attraction", {
    headers: {
      Authorization: token,
    },
  })
  .then(response => {
    const data = response.data;
    if (data.code === 200) {
      onSuccess(data.data);
    } else {
      onFailed(data.message);
    }
  })
  .catch(reason => {
    console.log(reason);
    onFailed("获取上传凭证失败！");
  });
}

// 获取美食照片的upload token
export function getFoodImgUploadToken(onSuccess, onFailed) {
  const token = localStorage.getItem('token');
  http.get("/upload/token/food", {
    headers: {
      Authorization: token,
    },
  })
  .then(response => {
    const data = response.data;
    if (data.code === 200) {
      onSuccess(data.data);
    } else {
      onFailed(data.message);
    }
  })
  .catch(reason => {
    console.log(reason);
    onFailed("获取上传凭证失败！");
  });
}

// 上传图片
export function uploadImg(file, key, uploadToken, onSuccess, onFailed, onProgress) {
  return qiniu.upload(file, key, uploadToken)
  .subscribe(res => {
    onProgress(res.total.percent);
  }, reason => {
    console.log(reason);
    onFailed("上传图片失败！");
  }, res => {
    onSuccess(res.url);
  })
}

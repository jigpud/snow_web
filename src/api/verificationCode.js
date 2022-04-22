import http from "../http/axios";

// 发送短信验证码
export function getVerificationCode(username, onSuccess, onFailed) {
    const formBody = new FormData();
    formBody.append("username", username);
    http.post("/verificationCode", formBody)
    .then(response => {
      const data = response.data;
      if (data.code === 200) {
        onSuccess();
      } else {
        onFailed(data.message);
      }
    })
    .catch(reason => {
      console.log(reason);
      onFailed("获取短信验证码失败！");
    });
  }

import http from "../http/axios";

// admin登录
export function login(username, verificationCode, onSuccess, onFailed) {
  const formBody = new FormData();
  formBody.append("username", username);
  formBody.append("verificationCode", verificationCode);
  http.post("/admin/login", formBody)
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
    onFailed("登录失败！");
  });
}

// 查询用户
export function queryUser(username, nickname, pageSize, currentPage, onSuccess, onFailed) {
  const token = localStorage.getItem("token");
  const formBody = new FormData();
  formBody.append("username", username);
  formBody.append("nickname", nickname);
  formBody.append("pageSize", pageSize);
  formBody.append("currentPage", currentPage);
  http.post("/admin/user/query", formBody, {
    headers: {
      Authorization: token,
    },
  })
  .then(response => {
    const data = response.data;
    if (data.code === 200) {
      onSuccess(data.data.records, data.data.currentPage, data.data.totalPage);
    } else {
      onFailed(data.message);
    }
  })
  .catch(reason => {
    console.log(reason);
    onFailed("查询用户失败！");
  });
}

// 创建新用户
export function createUser(username, password, onSuccess, onFailed) {
  const token = localStorage.getItem("token");
  const forBody = new FormData();
  forBody.append("username", username);
  forBody.append("password", password);
  http.post("/admin/user/create", forBody, {
    headers: {
      Authorization: token,
    },
  })
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
    onFailed("创建用户失败！");
  })
}

// 删除用户
export function deleteUser(userid, onSuccess, onFailed) {
  const token = localStorage.getItem("token");
  const formBody = new FormData();
  formBody.append("userid", userid);
  http.post("/admin/user/delete", formBody, {
    headers: {
      Authorization: token,
    },
  })
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
    onFailed("删除用户失败！");
  });
}

// 更新用户信息
export function updateUser(user, onSuccess, onFailed) {
  const token = localStorage.getItem("token");
  http.post("/admin/user/update", user, {
    headers: {
      Authorization: token,
    },
  })
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
    onFailed("更新用户信息失败！");
  });
}

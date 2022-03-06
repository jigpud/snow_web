import http from "../http/axios";

// 查询用户
export function queryUser(username, nickname, pageCount, page, onSuccess, onFailed) {
  const token = localStorage.getItem("token");
  const formBody = new FormData();
  formBody.append("username", username);
  formBody.append("nickname", nickname);
  formBody.append("pageCount", pageCount);
  formBody.append("page", page);
  http.post("/user/query", formBody, {
    headers: {
      "Authorization": token,
    },
  })
  .then(response => {
    const data = response.data;
    if (data.code === 200) {
      onSuccess(data.data.records, data.data.current, data.data.pages);
    } else {
      onFailed(data.message);
    }
  })
  .catch(reason => {
    console.log(reason);
    onFailed("查询失败！");
  });
}

// 创建新用户
export function createUser(username, password, onSuccess, onFailed) {
  const token = localStorage.getItem("token");
  const forBody = new FormData();
  forBody.append("username", username);
  forBody.append("password", password);
  http.post("/user/create", forBody, {
    headers: {
      "Authorization": token,
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
  http.post("/user/delete", formBody, {
    headers: {
      "Authorization": token,
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
    onFailed("删除失败！");
  });
}

// 更新用户信息
export function updateUser(user, onSuccess, onFailed) {
  const token = localStorage.getItem("token");
  http.post("/user/update", user, {
    headers: {
      "Authorization": token,
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
    onFailed("更新失败！");
  });
}

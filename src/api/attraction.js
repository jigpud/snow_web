import http from "../http/axios";

// 创建景点
export function createAttraction(name, description, location, tags, onSuccess, onFailed) {
  const token = localStorage.getItem("token");
  const formBody = new FormData();
  formBody.append("name", name);
  formBody.append("description", description);
  formBody.append("location", location);
  tags.forEach(tag => formBody.append("tags", tag));
  http.post("/admin/attraction/create", formBody, {
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
    onFailed("创建景点失败！");
  })
}

// 删除景点
export function deleteAttraction(attractionId, onSuccess, onFailed) {
  const token = localStorage.getItem("token");
  const formBody = new FormData();
  formBody.append("attractionId", attractionId);
  http.post("/admin/attraction/delete", formBody, {
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
    onFailed("删除景点失败！");
  })
}

// 更新景点信息
export function updateAttraction(attraction, onSuccess, onFailed) {
  const token = localStorage.getItem("token");
  http.post("/admin/attraction/update", attraction, {
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
    onFailed("更新景点信息失败!");
  })
}

// 查询景点
export function queryAttraction(attractionName, pageSize, currentPage, onSuccess, onFailed) {
  const token = localStorage.getItem("token");
  const formBody = new FormData();
  formBody.append("name", attractionName);
  formBody.append("pageSize", pageSize);
  formBody.append("currentPage", currentPage);
  http.post("/admin/attraction/query", formBody, {
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
    onFailed("查询景点失败！");
  })
}

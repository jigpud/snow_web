import http from "../http/axios";

// 创建美食
export function createFood(name, description, onSuccess, onFailed) {
  const token = localStorage.getItem("token");
  const formBody = new FormData();
  formBody.append("name", name);
  formBody.append("description", description);
  http.post("/admin/food/create", formBody, {
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
    onFailed("创建美食失败！");
  })
}

// 删除美食
export function deleteFood(foodId, onSuccess, onFailed) {
  const token = localStorage.getItem("token");
  const formBody = new FormData();
  formBody.append("foodId", foodId);
  http.post("/admin/food/delete", formBody, {
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
    onFailed("删除美食失败！");
  })
}

// 更新美食信息
export function updateFood(food, onSuccess, onFailed) {
  const token  = localStorage.getItem("token");
  http.post("/admin/food/update", food, {
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
    onFailed("更新美食信息失败！");
  })
}

// 查询美食
export function queryFood(foodName, pageSize, currentPage, onSuccess, onFailed) {
  const token = localStorage.getItem("token");
  const formBody = new FormData();
  formBody.append("name", foodName);
  formBody.append("pageSize", pageSize);
  formBody.append("currentPage", currentPage);
  http.post("/admin/food/query", formBody, {
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
    onFailed("查询美食失败！");
  })
}

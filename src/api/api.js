import { redirect } from "react-router-dom";
import { baseApi } from "./base";

async function getApi({ url, options }) {
  return baseApi.get(url, options).then((res) => {
    if (res.status === 200) {
      return res.data;
    }

    throw redirect(url);
  });
}

export { getApi };

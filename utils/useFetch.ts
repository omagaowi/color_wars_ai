import axios from "axios";

const runFetch = async (url: string, body: any, headers: any, type: string) => {
  switch (type) {
    case "post":
      try {
        const response = await axios.post(url, body, { headers: headers });
        const payload = await response.data;

        return payload;
      } catch (err) {
        throw err;
      }
    case "get":
      try {
        const response = await axios.get(url, { headers: headers });
        const payload = await response.data;
        return payload;
      } catch (err) {
        throw err;
      }
    case "delete":
      try {
        const response = await axios.delete(url, { headers: headers });
        const payload = await response.data;
        return payload;
      } catch (err) {
        throw err;
      }
    case "put":
      try {
        const response = await axios.put(url, body, { headers: headers });
        const payload = await response.data;

        return payload;
      } catch (err) {
        throw err;
      }
  }
};

export default runFetch;

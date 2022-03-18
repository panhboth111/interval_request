//the package used to make HTTP get requests
const axios = require("axios").default;

//dummy api endpoint
const apiUrl = "https://jsonplaceholder.typicode.com/todos";

//configure interceptors to measure the amount of time the request took (in milliseconds)
axios.interceptors.request.use(
  (config) => {
    const newConfig = { ...config };
    newConfig.metadata = { startTime: new Date() };
    return newConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  (response) => {
    const newRes = { ...response };
    newRes.config.metadata.endTime = new Date();
    newRes.duration =
      newRes.config.metadata.endTime - newRes.config.metadata.startTime;
    return newRes;
  },
  (error) => {
    const newError = { ...error };
    newError.config.metadata.endTime = new Date();
    newError.duration =
      newError.config.metadata.endTime - newError.config.metadata.startTime;
    return Promise.reject(newError);
  }
);

//function to send request to the api
function sendRequest() {
  //send the request every 1.5 second
  setInterval(async () => {
    const response = await axios.get(apiUrl);
    const currentDate = new Date().toISOString().slice(0, 10);
    // if the request took longer than 5000 milliseconds (5 seconds)
    if (response.duration > 5000) {
      console.log(
        `${currentDate} - request took ${response.duration} ms (longer than 5 seconds)`
      );
      return;
    }
    //if it took less than 5 seconds
    console.log(
      `${currentDate} - request took ${response.duration} ms (less than 5 seconds)`
    );
  }, 1500); //1500 miliseconds (1.5 second)
}

sendRequest();

import axios from "axios";
const instance=axios.create({
    baseURL:'http://localhost/React%20Project/ecommerce-php/api/',
    headers:{"Authorization": "Bearer "+localStorage.getItem("JWT-Token"),
    "Content-Type": "application/json",
    timeout:15000
},
})
export default instance;
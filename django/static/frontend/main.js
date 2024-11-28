import * as routing from "./router/router.js"

document.addEventListener("DOMContentLoaded", routing.router);
window.addEventListener("hashchange", routing.router);


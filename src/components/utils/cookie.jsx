function getCookie() {
    const value = `; ${document.cookie}`;
    console.log(value);
    const parts = value.split(`; accessToken=`);
    console.log(parts);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  export {getCookie};
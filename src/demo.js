gradientPicker({
    el: '.show-picker',
    colors: ["red", "green", "blue"],
    onChange: (data) => {
        document.querySelector("body").style.background = data;
        document.querySelector("#css-preview").innerText = data;
    },
    onLoaded: (data) => {
        document.querySelector("body").style.background = data;
        document.querySelector("#css-preview").innerText = data;
    }
});
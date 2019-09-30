import "./../main.scss";
import '@simonwep/pickr/dist/themes/nano.min.css';
import Picker from "./picker";

const gradientPicker = (options) => {
    options.el = document.querySelector(options.el);
    return new Picker(options);
}

export default gradientPicker;
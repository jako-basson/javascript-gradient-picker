import * as utils from "./utils/utils";
import Pickr from "@simonwep/pickr";

class Picker {
    constructor(opt) {
        this.options = Object.assign(
            {
                styles: [
                    { type: "linear", option: "0deg" },
                    { type: "linear", option: "45deg" },
                    { type: "linear", option: "90deg" },
                    { type: "linear", option: "135deg" },
                    { type: "linear", option: "180deg" },
                    { type: "linear", option: "225deg" },
                    { type: "linear", option: "270deg" },
                    { type: "radial", option: "ellipse" },
                    { type: "radial", option: "circle" }
                ],
                colors: ["#000000", "#ffffff"],
                onChange: function() {},
                onLoaded: function() {}
            },
            opt
        );

        this.selected = {
            style: this.options.styles[0]
        };

        this._state = {
            styleOptions: [],
            colors: [],
            pickrs: [],
            pickerEl: null,
            actionEl: null
        };

        this._setupHtml();
        this._createPicker();
        this.options.onLoaded(this._getGradientCss());
    }

    _setupHtml(){
        const wrapperEl = utils.createElementFromString(
            `<div style="position:relative;margin:10px;"></div>`
        );

        utils.wrapElement(this.options.el, wrapperEl);

        this._state.actionEl = utils.createElementFromString(`<a class="gradient-action"></a>`);

        wrapperEl.appendChild(this._state.actionEl);

        this.options.el.style.display = "none";
        this.options.el = wrapperEl;

        this._state.pickerEl = utils.createElementFromString(
            `<div style="display:none" class="gradient-picker"></div>`
        );

        wrapperEl.appendChild(this._state.pickerEl);
    }

    _createPicker() {
        this._createColorSelector();
        this._createStyleSelector();

        this._state.actionEl.addEventListener("click", event => {
            this._state.pickerEl.style.display = this._state.pickerEl.style.display === "none" ? "flex" : "none";
        });

        this._updateGradientCss();
    }

    _createPanel(cssClass, text) {
        const panelEl = utils.createElementFromString(
            `<div class="${cssClass}"></div>`
        );
        const contentEl = utils.createElementFromString(
            `<div class="content"><div class="head">${text}</div></div>`
        );
        panelEl.appendChild(contentEl);
        this._state.pickerEl.appendChild(panelEl);
        return { el: panelEl, contentEl: contentEl };
    }

    _createStyleSelector() {
        const panel = this._createPanel("style-selector", "select style");

        for (const [i, style] of this.options.styles.entries()) {
            this._appendStyleOption(panel.contentEl, i, style);
        }

        this._state.styleOptions[0].el.classList.add("active");
    }

    _appendStyleOption(parentEl, id, style) {
        const el = utils.createElementFromString(
            `<div class="style-option" data-index="${id}"></div>`
        );

        parentEl.appendChild(el);

        el.addEventListener("click", event => {
            event.stopPropagation();
            document
                .querySelectorAll(".style-option")
                .forEach(el => el.classList.remove("active"));
            event.target.classList.add("active");
            this.selected.style = this.options.styles[
                event.target.dataset.index
            ];
            this._triggerOnChange();
        });

        this._state.styleOptions.push({ el: el, style: style });
    }

    _createColorSelector() {
        const panel = this._createPanel("color-selector", "select colors");

        const addColorEl = utils.createElementFromString(
            `<button class="add-color">add color</button>`
        );

        addColorEl.addEventListener("click", event => {
            event.stopPropagation();

            const ids = this._state.colors.map(c => c.id);
            let highestId = Math.max(...ids);

            this._appendColorOption(
                panel.contentEl,
                ++highestId,
                utils.generateColor()
            );

            this._triggerOnChange();
        });

        for (const [i, color] of this.options.colors.entries()) {
            this._appendColorOption(panel.contentEl, i, color);
        }

        panel.el.appendChild(addColorEl);
    }

    _appendColorOption(parentEl, id, color) {
        const el = utils.createElementFromString(
            `<div class="color-selector-item"><span class="color-picker${id}"></span></div>`
        );

        let valueEl = utils.createElementFromString(
            `<div class="color-value">${color}</div>`
        );
        el.appendChild(valueEl);

        let deleteEl = utils.createElementFromString(
            `<a data-color-id="${id}" class="delete-color"></a>`
        );
        el.appendChild(deleteEl);

        parentEl.appendChild(el);

        this._initColorPicker(`color-picker${id}`, color, id);

        deleteEl.addEventListener("click", evt => this._handleDeleteColor(evt));

        this._state.colors.push({
            id: id,
            color: color,
            el: el,
            valueEl: valueEl
        });
    }

    _handleDeleteColor(event) {
        if (this._state.colors.length <= 2) return;

        let color = this._state.colors.find(item => item.id == event.target.dataset.colorId)
        color.el.remove();
        this._state.colors = this._state.colors.filter(function(item) {
            return item.id != event.target.dataset.colorId;
        });

        this._triggerOnChange();
    }

    _initColorPicker(cssClass, color, index) {
        var pickr = Pickr.create({
            el: `.${cssClass}`,
            theme: "nano",
            default: color,
            swatches: [
                "#007bff",
                "#6610f2",
                "#6f42c1",
                "#e83e8c",
                "#dc3545",
                "#fd7e14",
                "#ffc107",
                "#28a745",
                "#20c997",
                "#17a2b8",
                "#fff",
                "#6c757d",
                "#343a40",
                "#007bff",
                "#6c757d",
                "#28a745",
                "#17a2b8",
                "#ffc107",
                "#dc3545",
                "#D9D9D9",
                "#343a40"
            ],
            id: index,
            components: {
                preview: false,
                opacity: true,
                hue: true,
                interaction: {
                    input: true,
                    save: true
                }
            }
        });

        pickr.on("save", (color, instance) => {
            this._state.colors.forEach(item => {
                if (item.id === instance.options.id) {
                    item.valueEl.innerText = color.toHEXA().toString();
                    item.color = color.toHEXA().toString();
                }
            });

            this._triggerOnChange();
        });

        return pickr;
    }

    _updateGradientCss() {
        this._state.styleOptions.forEach(opt => {
            opt.el.style.background = this._getGradientCss(opt.style);
        });

        this._state.actionEl.style.background = this._getGradientCss();
    }

    _getGradientCss(style) {
        if (style === undefined) style = this.selected.style;
        return `${style.type}-gradient(${
            style.option
        }, ${this._state.colors.map(e => e.color).join(",")})`;
    }

    _triggerOnChange() {
        this._updateGradientCss();
        this.options.onChange(this._getGradientCss());
    }
}

export default Picker;

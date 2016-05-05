import {ElementComponent} from "../../lib/component";
import $ from "jquery";

export class ChatFormComponent extends ElementComponent{
    constructor() {
        super("div");
        this.$element.addClass("chat-form");
    }
}

import {ElementComponent} from "../../lib/component";

export class PlaylistToolbarComponent extends ElementComponent{
    constructor() {
        super("ul");
        this.$element.addClass("toolbar");
    }
}

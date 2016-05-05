import {ElementComponent} from "../../lib/component";

export class PlaylistContextMenuComponent extends ElementComponent{
    constructor() {
        super("ul");
        this.$element.addClass("context-menu");
    }
}

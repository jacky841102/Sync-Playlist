import {Observable} from "rxjs";
import {ElementComponent} from "../../lib/component";
import $ from "jquery";

export class PlaylistToolbarComponent extends ElementComponent{
    constructor(playlistStore) {
        super("div");
        this.$element.addClass("toolbar");
        this._playlist = playlistStore;
    }

    _onAttach() {
        const $addButton = $(`
            <a href="#" class="add-button">
                <i class="fa fa-plus-square" /> next
            </a>`).appendTo(this.$element);

        Observable.fromEventNoDefault($addButton, "click")
            .flatMap(() => Observable.fromPrompt("Enter the URL of the video"))
            .filter(url => url && url.trim().length)
            .flatMap(url => this._playlist.addSource$(url).catchWrap())
            .comSubscribe(this, result => {
                if(result && result.error)
                    alert(result.error.message || "Unkown error");
            });
    }
}

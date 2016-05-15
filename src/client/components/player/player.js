import {ElementComponent} from "../../lib/component";
import {YoutubePlayer} from "./players/youtube";
import {Observable} from "rxjs";
import $ from "jquery";
import _ from "lodash";
import "./player.scss";

import {playlistStore} from "../../services";

class PlayerComponent extends ElementComponent {
    constructor(playlistStore){
        super();
        this._playlist = playlistStore;
        this.$element.addClass("players");
    }

    _onAttach() {
        const $title = this._$mount.find("h1");

        this._players = {
            youtube: new YoutubePlayer()
        };

        const initList = _.map(this._players, player => player.init$());

        for (let type in this._players) {
            this._players[type].attach(this.$element);
        }

        Observable.merge(...initList)
            .toArray()
            .comSubscribe(this, this._playersAttached.bind(this));

        this._playlist.serverTime$
            .comSubscribe(this, ({source}) => {
                if(!source)
                    return;

                $title.text(source.title);
            });
    }

    _playersAttached() {
        let lastSource = null,
            lastPlayer = null;

        this._playlist.serverTime$
            .comSubscribe(this, ({source, time}) => {
                if (!source) {
                    if (lastSource) {
                        lastSource.stop();
                        lastPlayer = lastSource = null;
                    }
                    return;
                }

                const player = this._players[source.type];
                if (source != lastSource) {
                    if (lastPlayer && player != lastPlayer) {
                        lastPlayer.stop();
                    }

                    lastSource = source;
                    lastPlayer = player;
                    player.play(source, time);
                }
                else if (Math.abs(time - player.currentTime) > 2)
                    player.seek(time);
            });


    }
}

let component;
try{
    component = new PlayerComponent(playlistStore);
    component.attach($("section.player"));
}catch(e){
    console.error(e);
    if(component)
        component.detach();
}finally{
    if(module.hot){
        module.hot.accept();
        module.hot.dispose( () => component && component.detach());
    }
}

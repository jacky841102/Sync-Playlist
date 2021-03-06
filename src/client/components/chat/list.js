import {ElementComponent} from "../../lib/component";
import $ from "jquery";
import moment from "moment";
import {Observable} from "rxjs";

export class ChatListComponent extends ElementComponent{
    constructor(server, usersStore, chatStore) {
        super("ul");
        this._server = server;
        this._users = usersStore;
        this._chat = chatStore;
        this.$element.addClass("chat-messages");
    }

    _onAttach() {
        Observable.merge(
            this._chat.message$.map(chatMessageFactory),
            this._users.state$.map(userActionFactory),
            this._server.status$.map(serverStatusFactory))
            .filter(m => m)
            .comSubscribe(this, $newElement => {
                this.$element.append($newElement);
                this.$element[0].scrollTop = this.$element[0].scrollHeight;
            });
    }
}

function serverStatusFactory({isConnected, isReconnecting, attempt}) {
    let statusMessage = null;
    if (isConnected) statusMessage = "connected";
    else if (isReconnecting) statusMessage = `reconnecting (attemp ${attempt})`;
    else statusMessage = "it's died";

    if (statusMessage == null)
        return null;

    return $(`<li class="server-status" />`).append([
        $(`<span class="author">`).text("system"),
        $(`<span class="message">`).text(statusMessage),
        $(`<time />`).text(moment().format("h:mm:ss a"))
    ]);
}

function userActionFactory({type, user}) {
    if (type !== "add" && type !== "remove")
        return null;

    return $(`<li class="user-action ${type}" />`).append([
        $(`<span class="author" />`).text(user.name).css("color", user.color),
        $(`<span class="message" />`).text(type === "add" ?  "Joined" : "Left"),
        $(`<time />`).text(moment().format("h:mm:ss a"))
    ]);
}

function chatMessageFactory({user, message, type, time}) {
    return $(`<li class="message ${type}">`)
        .data("user", user.name)
        .append([
            $(`<span class="author" />`).text(user.name).css("color", user.color),
            $(`<span class="message" />`).text(message),
            $(`<time />`).text(moment(time).format("h:mm:ss a"))
        ]);
}

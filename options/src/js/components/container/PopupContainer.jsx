import React, { Component } from "react";
import ReactDOM from "react-dom";
class PopupContainer extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <>
                <ul>
                    <li>
                        <button onClick={() => {
                            chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
                                var activeTab = tabs[0];
                                chrome.tabs.sendMessage(activeTab.id, {"message": "start"});
                            });
                        }}>Start</button>
                    </li>
                    <li>
                        <button onClick={() => {
                            chrome.runtime.openOptionsPage()
                        }}>
                            Options
                        </button>
                    </li>
                </ul>

            </>
        );
    }
}
export default PopupContainer;

document.addEventListener("DOMContentLoaded", function() {
    const wrapper = document.getElementById("popup-container");
    wrapper ? ReactDOM.render(<PopupContainer />, wrapper) : false;
});
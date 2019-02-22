import browser from "webextension-polyfill";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
                            browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
                                let activeTab = tabs[0];
                                browser.tabs.sendMessage(activeTab.id, {'message': 'start'});
                            });
                        }}>Start</button>
                    </li>
                    <li>
                        <button onClick={() => {
                            browser.runtime.openOptionsPage()
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

document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.getElementById('popup-container');
    wrapper ? ReactDOM.render(<PopupContainer />, wrapper) : false;
});
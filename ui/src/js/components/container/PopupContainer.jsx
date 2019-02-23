import browser from "webextension-polyfill";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'semantic-ui-react'

class PopupContainer extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div >
                <Button.Group vertical style={{
                    display: 'inline-block'
                }}>
                    <Button
                        fluid
                        color='green'
                        onClick={() => {
                            browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
                                let activeTab = tabs[0];
                                browser.tabs.sendMessage(activeTab.id, {'message': 'start'});
                            });
                        }}
                    >
                        Starta spellista
                    </Button>
                    <Button
                        fluid
                        onClick={() => {
                            browser.runtime.openOptionsPage()
                        }}
                    >
                        Gå till inställningar
                    </Button>
                </Button.Group>
            </div>
        );
    }
}
export default PopupContainer;

document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.getElementById('popup-container');
    wrapper ? ReactDOM.render(<PopupContainer />, wrapper) : false;
});
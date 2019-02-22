import browser from "webextension-polyfill";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
    SortableContainer,
    SortableElement,
    arrayMove,
} from 'react-sortable-hoc';
import { List, Segment, Button, Form } from 'semantic-ui-react'

const SortableItem = SortableElement(({value, sortIndex, onRemove}) =>
    <List.Item>
        <List.Content>
        {value}
        </List.Content>
        <List.Content floated='right'>
            <Button onClick={onRemove}>Radera</Button>
        </List.Content>
    </List.Item>);

const SortableList = SortableContainer(({items, onRemove}) => {
    return (
        <Segment>
            <List divided relaxed>
            {items.map((value, index) => (
                <SortableItem
                    key={`item-${index}`}
                    index={index} value={value}
                    onRemove={onRemove}
                    sortIndex={index}
                />
            ))}
            </List>
        </Segment>
    );
});

class OptionsContainer extends Component {
    constructor() {
        super();
        this.state = {
            playlist: [],
            newPlaylistItem: ''
        };
        this.onInputChange = this.onInputChange.bind(this);
        this.onSortEnd = this.onSortEnd.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onRemove = this.onRemove.bind(this);
        browser.storage.sync.get = browser.storage.sync.get.bind(this);
        browser.storage.sync.set = browser.storage.sync.set.bind(this);
    }

    restore(){
        browser.storage.sync.get('playlist')
            .then((result) => {
                this.setState({
                    playlist: result.playlist || [],
                    newPlaylistItem: ''
                });
            });
    }

    componentDidMount() {
        this.restore()
    }

    onInputChange(e, { name, value }) {
        this.setState({[name]: value})
    }

    onRemove(index) {
        const { playlist } = this.state;

        browser.storage.sync.set({
            playlist: [...playlist.slice(0, index), ...playlist.slice(index + 1)]
        }).then(() => {
            this.restore()
        });
    }

    onSave() {
        const { playlist, newPlaylistItem } = this.state;

        browser.storage.sync.set({
            playlist: [...playlist, newPlaylistItem]
        }).then(() => {
            this.restore()
        });
    }

    onSortEnd({oldIndex, newIndex}) {
        this.setState(({playlist = []}) => ({
            playlist: arrayMove(playlist, oldIndex, newIndex),
        }), () => {
            browser.storage.sync.set({
                playlist: this.state.playlist
            });
        });
    };

    render() {
        const { playlist, newPlaylistItem } = this.state;
        return (
            <>
                <SortableList items={playlist} onSortEnd={this.onSortEnd} onRemove={this.onRemove}/>
                <Form onSubmit={this.onSave}>
                    <Form.Group>
                        <Form.Input placeholder='url' name='newPlaylistItem' label='Lägg till adress' value={newPlaylistItem} onChange={this.onInputChange} />
                        <Form.Button content='Submit' />
                    </Form.Group>
                </Form>
            </>
        );
    }
}
export default OptionsContainer;

const wrapper = document.getElementById("options-container");
wrapper ? ReactDOM.render(<OptionsContainer />, wrapper) : false;
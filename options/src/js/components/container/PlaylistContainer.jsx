import React, { Component } from "react";
import ReactDOM from "react-dom";
import Input from "../presentational/Input.jsx";
import {
    SortableContainer,
    SortableElement,
    arrayMove,
} from 'react-sortable-hoc';

const SortableItem = SortableElement(({value, sortIndex, onRemove}) => <li>
    {value} <button onClick={() => {
        onRemove(sortIndex)
    }}>Ta bort</button>
    </li>);

const SortableList = SortableContainer(({items, onRemove}) => {
    return (
        <ul>
            {items.map((value, index) => (
                <SortableItem key={`item-${index}`} index={index} value={value} onRemove={onRemove} sortIndex={index}
                />
            ))}
        </ul>
    );
});

class PlaylistContainer extends Component {
    constructor() {
        super();
        this.state = {
            playlist: [],
            newItem: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.onSortEnd = this.onSortEnd.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    restore(){
        let that = this;
        console.log('restore', that.state)
        chrome.storage.sync.get('playlist', (result) => {
            that.setState({
                playlist: result.playlist || []
            });
        });
    }

    componentDidMount() {
        this.restore()
    }

    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }

    handleRemove(index) {
        console.log('handle remove', index)
        let that = this;
        const { playlist } = this.state;
        console.log('handleRemove', index, playlist)

        chrome.storage.sync.set({
            playlist: [...playlist.slice(0, index), ...playlist.slice(index + 1)]
        }, function() {
            that.restore()
        });
    }

    handleAdd() {
        let that = this;
        const { playlist, newItem } = this.state;

        chrome.storage.sync.set({
            playlist: [...playlist, newItem]
        }, function() {
            that.restore()
        });
    }

    onSortEnd({oldIndex, newIndex}) {
        let that = this;

        this.setState(({playlist = []}) => ({
            playlist: arrayMove(playlist, oldIndex, newIndex),
        }), () => {
            chrome.storage.sync.set({
                playlist: that.state.playlist
            });
        });
    };

    render() {
        const { playlist, newItem } = this.state;
        return (
            <>
                <SortableList items={playlist} onSortEnd={this.onSortEnd} onRemove={this.handleRemove}/>

                <Input
                    text="URL"
                    label="url"
                    type="text"
                    id="newItem"
                    value={newItem}
                    handleChange={this.handleChange}
                />
                <button onClick={this.handleAdd}>Lägg till</button>
            </>
        );
    }
}
export default PlaylistContainer;

const wrapper = document.getElementById("playlist-container");
wrapper ? ReactDOM.render(<PlaylistContainer />, wrapper) : false;
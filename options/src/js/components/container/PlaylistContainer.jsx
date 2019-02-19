import React, { Component } from "react";
import ReactDOM from "react-dom";
import Input from "../presentational/Input.jsx";
class PlaylistContainer extends Component {
    constructor() {
        super();
        this.state = {
            playlist: [],
            newItem: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
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

    render() {
        const { playlist, newItem } = this.state;
        return (
            <>
                <ul>
                    {playlist.map((item, i) =>
                        <li key={i}>
                            {item} <button onClick={() => {
                                this.handleRemove(i)
                        }}>Ta bort</button>
                        </li>)}
                </ul>
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
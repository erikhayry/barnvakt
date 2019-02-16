function saveOptions(e) {
    chrome.storage.sync.set({
        colour: document.querySelector("#colour").value
    }, function() {
        console.log('Value is set');
        restoreOptions()
    });
    e.preventDefault();
}

function restoreOptions() {
    chrome.storage.sync.get('colour', function(result) {
        console.log(result)
        document.querySelector("#colour-out").value = result.colour;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: ['1','2','3'],
            colours: ""
        };
    }

    componentDidMount() {
        let that = this;
        chrome.storage.sync.get('colour', function (result) {
            that.setState({
                colours: result.colour
            });
        });
    }

    render() {
        return React.createElement("ul", null, React.createElement("li", null, this.state.colours), this.state.items.map((item, i) => React.createElement("li", {
            key: i
        }, item)));
    }

}

ReactDOM.render(React.createElement(List, null), document.getElementById('root'));
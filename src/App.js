import React, { Component } from 'react';
import './App.css';


class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			term: '',
			items: []
		};
	}

	componentDidMount() {
		if (localStorage.getItem('items')) {
			this.setState({items: JSON.parse(localStorage.getItem('items'))});
		}else{
			this.setState({items: []});
		}
	}

	onChange = (event) => {
		this.setState({ term: event.target.value });
	}

	onSubmit = (event) => {
		event.preventDefault();
		this.state.items.push(this.state.term);
		var items = JSON.stringify(this.state.items)
		localStorage.setItem('items', items);
		this.setState({term: '', items: JSON.parse(localStorage.getItem('items'))})
	}

	deleteItem = (idx) => () => {
		this.setState({items: this.state.items.filter((s, sidx) => idx !== sidx)}, () => {
			var items = JSON.stringify(this.state.items)
			localStorage.setItem('items', items);
		});
	}

	render() {
		console.log(localStorage.getItem('items'))
		return (
			<div className="todo-wrapper">
				<form className="form" onSubmit={this.onSubmit}>
					<input value={this.state.term} onChange={this.onChange} type="text" id="input" placeholder="What needs to be done?" />
				</form>

				<ul id="myUL">
					{this.state.items.map((item, index) => 
						<li key={index}>{item} <span  onClick={this.deleteItem(index)} className="close">×</span></li> 
					)}

				</ul>
			</div>
		);
	}
}

export default App;

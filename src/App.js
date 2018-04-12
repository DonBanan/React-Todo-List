import React, { Component } from 'react';
import './App.css';


class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			term: '',
			date: '',
			is_done: false,
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

	handleChange = (evt) => {
		this.setState({ [evt.target.name]: evt.target.value });
	}

	onSubmit = (event) => {
		event.preventDefault();
		var d = new Date();
		var curr_date = d.getDate();
		var curr_month = d.getMonth() + 1;
		var curr_year = d.getFullYear();

		event.preventDefault();
		this.state.items.unshift({"title": this.state.term, is_done: this.state.is_done, "date": curr_date + "-" + curr_month + "-" + curr_year});
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

	doneItem = (idx) => (evt) => {
		const newShareholders = this.state.items.map((item, sidx) => {
			if (idx !== sidx) return item;
				item.is_done = true
		});
		this.setState({items: this.state.items})
		var items = JSON.stringify(this.state.items)
		localStorage.setItem('items', items);
    }

	render() {
		return (
			<div className="todo-wrapper">
				<form className="form" onSubmit={this.onSubmit}>
					<input value={this.state.term} onChange={this.handleChange} name="term" type="text" id="input" placeholder="What needs to be done?" />
				</form>

				<ul id="myUL">
					{this.state.items.map((item, index) => 
						<li key={index} className={item.is_done ? 'done' : '' }>{item.title} <span onClick={item.is_done ? this.deleteItem(index) : this.doneItem(index)} className={item.is_done ? 'close_done': 'close'} >×</span></li> 
					)}

				</ul>
			</div>
		);
	}
}

export default App;



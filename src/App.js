import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import notifications_icon from './notifications.png'
import red_notifications_icon from './red_notifications.png'

import 'react-datepicker/dist/react-datepicker.css';

import './App.css';


class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			text: '',
			startDate: moment(),
			notifications: false,
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

	handleChangeText = (evt) => {
		this.setState({ [evt.target.name]: evt.target.value });
	}

	handleChangeDate = (date) => {
		this.setState({
			startDate: date
		});
	}

	onSubmit = (event) => {
		event.preventDefault();
		this.state.items.unshift({"title": this.state.text, "is_done": this.state.is_done, "notifications": this.state.notifications, "date": this.state.startDate.format('DD MMMM')});
		var items = JSON.stringify(this.state.items)
		localStorage.setItem('items', items);
		this.setState({text: '', items: JSON.parse(localStorage.getItem('items'))})
	}

	doneItem = (idx) => (evt) => {
		this.state.items.map((item, sidx) => {
			if (idx !== sidx) return item;
				item.is_done = true
				return item.is_done
		});
		this.setState({items: this.state.items})
		var items = JSON.stringify(this.state.items)
		localStorage.setItem('items', items);
		setTimeout(() => {
			this.setState({items: this.state.items.filter((s, sidx) => idx !== sidx)}, () => {
				var items = JSON.stringify(this.state.items)
				localStorage.setItem('items', items);
			});
		}, 500);
    }

	render() {
		const today = moment().format('DD MMMM')
		return (
			<div className="todo-wrapper">
				<div id="myDIV" className="form-header">
					<form onSubmit={this.onSubmit}>
						<DatePicker dateFormat="DD MMMM" selected={this.state.startDate} calendarClassName="form-input__date" onChange={this.handleChangeDate} placeholder={this.state.startDate} locale="ru" />
						<input className="form-input__text" value={this.state.text} onChange={this.handleChangeText} name="text" type="text" id="input" placeholder="What should be done?" required/>
						<button className="form-btn">Add</button>
					</form>
				</div>

				<ul className="todo-list">
					{this.state.items.map((item, index) => 
						<li key={index} className={item.is_done ? 'done todo-item' : 'todo-item' }>
							{item.title}
							<span className="todo-item__date">{item.date}</span>
							{item.date === today ? 
								<img src={red_notifications_icon} className="img-responsive todo-item__notification" title="Need close the task today" alt="Need close the task today"/>
								: 
								<img src={notifications_icon} className="img-responsive todo-item__notification" title="There is still time to deal with the task" alt="There is still time to deal with the task"/>
							}
							<span onClick={this.doneItem(index)} className="close">×</span>
						</li> 
					)}
				</ul>

			</div>
		);
	}
}

export default App;



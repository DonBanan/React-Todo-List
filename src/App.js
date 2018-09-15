import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'moment/locale/ru';

import 'react-datepicker/dist/react-datepicker.css';

import './App.css';


class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			text: '',
			startDate: moment(),
			days: 0,
			notifications: false,
			is_done: false,
			items: [],
			category: 'personal',
			categories: [
				{"id": 1, "name": "all"},
				{"id": 2, "name": "personal"},
				{"id": 3, "name": "workers"},
				{"id": 4, "name": "assignments"},
				{"id": 5, "name": "purchases"}
			]
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
		console.log(evt.target.value)
		this.setState({ [evt.target.name]: evt.target.value });
	}

	handleChangeText = (evt) => {
		console.log(evt.target.value)
		this.setState({ [evt.target.name]: evt.target.value });
	}

	handleChangeDate = (date) => {
		var dt1 = new Date(moment().format('DD MMMM Y'));
		var dt2 = new Date(date);
		var days = Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
		console.log(days)

		this.setState({
			startDate: date,
			days: days
		});
	}

	handleChangeCategory = (event) => {
		this.setState({category: event.target.value});
	}

	filterCategory = (category) => {
		var myItems = JSON.parse(localStorage.getItem('items'))
		if (category['name'] === 'all') {
			this.setState({items: myItems, category: category['name']})
		} else {
			const newArray = myItems.filter(item => item.category === category['name'])
			this.setState({items: newArray, category: category['name'], is_done: ''})
		}
	}

	filterStatus = (status) => {
		var myItems = JSON.parse(localStorage.getItem('items'))
		const newArray = myItems.filter(item => item.is_done === status)
		this.setState({items: newArray, is_done: status, category: ''})
	}

	onSubmit = (event) => {
		event.preventDefault();
		console.log('213')
		this.state.items.unshift({"title": this.state.text, "category": this.state.category, "is_done": this.state.is_done, "notifications": this.state.notifications, "date": this.state.startDate.format('DD MMMM Y'), "days": this.state.days});
		var items = JSON.stringify(this.state.items)
		localStorage.setItem('items', items);
		this.setState({text: '', items: JSON.parse(localStorage.getItem('items'))})
	}

	doneItem = (idx) => (evt) => {
		console.log(evt.terget)
		this.state.items.map((item, sidx) => {
			if (idx !== sidx) return item;
				if (item.is_done) {
					item.is_done = false
				}else {
					item.is_done = true
				}
				return item.is_done
		});
		this.setState({items: this.state.items})
		var items = JSON.stringify(this.state.items)
		localStorage.setItem('items', items);
    }

	deleteItem = (idx) => (evt) => {
		setTimeout(() => {
			this.setState({items: this.state.items.filter((s, sidx) => idx !== sidx)}, () => {
				var items = JSON.stringify(this.state.items)
				localStorage.setItem('items', items);
			});
		}, 500);
    }

	render() {
		return (
			<div id="demo">
				<h1>All my tasks</h1>
				<form onSubmit={this.onSubmit}>
					<div className="form-group">
						<input type="text" name="text" value={this.state.text} onChange={this.handleChangeText} className="input_text" placeholder="Add new task" required />
						<select id="categories" name="categories" value={this.state.value} onChange={this.handleChangeCategory}>
							{this.state.categories.map((category, index) =>
								<option key={index} value={category.name}>{category.name}</option>
							)}
						</select>
						<DatePicker 
							dateFormat="DD MMMM Y"
							selected={this.state.startDate}
							className="input_date"
							onChange={this.handleChangeDate}
							placeholder={this.state.startDate}
							minDate={moment()}
							locale="ru"
	  						maxDate={moment().add(5, "months")}
							showDisabledMonthNavigation
							withPortal
						/>
					</div>
					<button className="btn red"><span>Add task</span></button>
				</form>
				<div className="table-categories">
					{this.state.categories.map((category, index) =>
						<p key={index} className={this.state.category === category.name ? "table-filter-category active" : "table-filter-category"} onClick={(e) => this.filterCategory(category, e)}>{category.name}</p>
					)}
				</div>
				<div className="table-status">
					<p className={this.state.is_done === true ? "table-filter-status active" : "table-filter-status"} onClick={(e) => this.filterStatus(true, e)}>Completed</p>
					<p className={this.state.is_done === false ? "table-filter-status active" : "table-filter-status"} onClick={(e) => this.filterStatus(false, e)}>In progress</p>
				</div>
				{this.state.items.length > 0 ?
					<div className="table-responsive-vertical shadow-z-1">
						<table id="table" className="table table-hover table-mc-light-blue">
							<thead>
								<tr>
									<th>#</th>
									<th>Text</th>
									<th>Category</th>
									<th>Date</th>
									<th>Days left</th>
									<th>Status</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{this.state.items.map((item, index) => 
									<tr key={index} onClick={this.doneItem(index)}>
										<td data-title="ID">{index}</td>
										<td data-title="Name">{item.title}</td>
										<td data-title="Name">{item.category}</td>
										<td data-title="Date">{item.date}</td>
										<td data-title="Date">
											{item.days > 0 ? item.days + ' days':
											item.days === 0 ? 'Today' :
											item.days < 0 ?  <span className="in_progress">Overdue task</span> :
											''
											}
										</td>
										{item.is_done ? 
											<td data-title="Status" className="completed">Completed</td> :
											<td data-title="Status" className="in_progress">In progress</td>
										}
										<td data-title="Delete" className="in_progress" onClick={this.deleteItem(index)}>Delete</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
					:
					''
				}
			</div>

		);
	}
}

export default App;

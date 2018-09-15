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
			complite_items: [],
			category: 'личные',
			categories: [
				{"id": 1, "name": "личные"},
				{"id": 2, "name": "рабочие"},
				{"id": 3, "name": "прочие"},
			]
		};
	}

	componentDidMount() {
		// localStorage.setItem('items', [])
		// localStorage.setItem('complite_items', [])
		if (localStorage.getItem('items')) {
			this.setState({items: JSON.parse(localStorage.getItem('items'))});
		}else{
			this.setState({items: []});
		}
	}

	handleChange = (evt) => {
		this.setState({ [evt.target.name]: evt.target.value });
	}

	handleChangeDate = (date) => {
		var dt1 = new Date(moment().format('DD MMMM Y'));
		var dt2 = new Date(date);
		var days = Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
		this.setState({
			startDate: date,
			days: days
		});
	}

	onSubmit = (event) => {
		event.preventDefault();
		this.state.items.unshift({"id": this.state.items.length + 1, "title": this.state.text, "category": this.state.category, "is_done": this.state.is_done, "date": this.state.startDate.format('DD MMMM Y')});
		var items = JSON.stringify(this.state.items)
		localStorage.setItem('items', items);
		this.setState({text: '', category: 'личные', startDate: moment(), items: JSON.parse(localStorage.getItem('items'))})
	}

	// doneItem = (idx) => (evt) => {
	// 	this.state.items.map((item, sidx) => {
	// 		if (idx !== sidx) return item;
	// 		item.is_done = true
	// 		return item.is_done
	// 	});
		
	// 	const newArrayFalse = this.state.items.filter(item => item.is_done === false)
	// 	this.setState({items: newArrayFalse})
	// 	var items = JSON.stringify(newArrayFalse)
	// 	localStorage.setItem('items', newArrayFalse);
 //    }

	deleteItem = (idx) => (evt) => {
		setTimeout(() => {
			this.setState({items: this.state.items.filter((s, sidx) => idx !== sidx)}, () => {
				var items = JSON.stringify(this.state.items)
				localStorage.setItem('items', items);
			});
		}, 1);
    }

	render() {
		return (
			<div id="demo">
				<form onSubmit={this.onSubmit}>
					<div className="form-group">
						<input type="text" name="text" value={this.state.text} onChange={this.handleChange} className="input_text" placeholder="новая задача..." required />
						<select id="categories" name="category" value={this.state.category} onChange={this.handleChange}>
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
					<button className="btn red"><span>Добавить</span></button>
				</form>
				{this.state.items.length > 0 ?
					<div className="table-responsive-vertical shadow-z-1">
						<h1>Задачи в работе</h1>
						<table id="table" className="table table-hover table-mc-light-blue">
							<thead>
								<tr>
									<th>#</th>
									<th>Текст</th>
									<th>Категория</th>
									<th>Дата</th>
									<th>Опции</th>
								</tr>
							</thead>
							<tbody>
								{this.state.items.map((item, index) => 
									<tr key={index}>
										<td data-title="ID">{item.id}</td>
										<td data-title="Name">{item.title}</td>
										<td data-title="Name">{item.category}</td>
										<td data-title="Date">{item.date}</td>
										<td data-title="Delete" className="in_progress" onClick={this.deleteItem(index)}>Выполнено</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
					:
					''
				}
				{this.state.complite_items.length > 0 ?
					<div className="table-responsive-vertical shadow-z-1">
						<h1>Выполнено</h1>
						<table id="table" className="table table-hover table-mc-light-blue">
							<thead>
								<tr>
									<th>#</th>
									<th>Текст</th>
									<th>Категория</th>
									<th>Дата</th>
									<th>Опции</th>
								</tr>
							</thead>
							<tbody>
								{this.state.complite_items.map((item, index) => 
									<tr key={index}>
										<td data-title="ID">{item.id}</td>
										<td data-title="Name">{item.title} - {item.is_done ? 'true' : 'false'}</td>
										<td data-title="Name">{item.category}</td>
										<td data-title="Date">{item.date}</td>
										<td data-title="Complite" className="in_progress" onClick={this.doneItem(index)}>Выполнено</td>
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


import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import FontAwesome from 'react-fontawesome'

export default class DropdownField extends React.Component{

	constructor(props){
		super(props);

		this.state = {
			expanded: false
		}

		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount(){		
		window.addEventListener("click", this.handleClick, false);
	}

	componentWillUnmount(){		
		window.removeEventListener("click", this.handleClick, false);
	}

	handleClick(e){
		// TODO: remove dependency on jQuery and explore the performance of this functionality
		if ($(e.target).closest('.dropdown-field').data('key') != this.props.name.replace(' ','_').toLowerCase() && this.state.expanded){
			this.setState({
				expanded: false
			});
		}
	}

	handleChange(value, is_selected){

		if (this.isMultiSelect()){
			if (value == 'select-all'){
				var new_value = [];
				for (var i = 0; i < this.props.options.length; i++){
					new_value.push(this.props.options[i].value);
				}
				return this.props.handleChange(new_value);
			}
		} else {			
			this.setState({
				expanded: !this.state.expanded
			});
		}

		var current_value = this.props.value;
		if (this.isMultiSelect()){
			if (is_selected){
				var index = current_value.indexOf(value);
				current_value.splice(index, 1);
				var new_value = current_value;
			} else {
				current_value.push(value);
				var new_value = current_value;
			}
		} else {
			var new_value = value;
		}

		return this.props.handleChange(new_value);
	}

	handleToggle(){
		this.setState({
			expanded: !this.state.expanded
		});
	}

	isMultiSelect(){
		return this.props.value instanceof Array;
	}

	render(){
		if (!this.props.options){
			return null;
		}

		var className = 'dropdown-field';
		if (this.state.expanded){
			className += ' expanded';
		}
		if (this.props.no_status_icon){
			className += ' no-status-icon';
		}
		if (this.props.no_label){
			className += ' no-label';
		}
		if (this.props.button){
			className += ' buttonify';
		}
		if (this.props.className){
			className += ' '+this.props.className;
		}
		var current_value = null;
		if (this.props.value){
			current_value = this.props.value;
		} else if (this.props.options.length > 0){
			current_value = this.props.options[0].value;
		}

		var selected_icon = <FontAwesome name="check" />
		if (this.props.selected_icon){
			selected_icon = <FontAwesome name={this.props.selected_icon} />
		}

		var options = Object.assign([], this.props.options);
		if (this.isMultiSelect()){
			options.push({
				value: 'select-all',
				label: 'Select all',
				className: 'grey-text'
			});
		}

		return (
			<div className={className} data-key={this.props.name.replace(' ','_').toLowerCase()}>
				<div className={"label"+(this.props.button ? " button "+this.props.button : "")} onClick={e => this.handleToggle()}>
					{this.props.icon ? <span><FontAwesome name={this.props.icon} />&nbsp; </span> : null}
					<span className="text">
						{this.props.name}
						{this.isMultiSelect() ? ' ('+current_value.length+')' : null}
					</span>
				</div>
				<div className="options">
					{
						options.map(option => {
							if (this.isMultiSelect()){
								var is_selected = current_value.indexOf(option.value) > -1;
							} else {
								var is_selected = current_value == option.value;
							}
							return (
								<div className={"option "+(option.className ? option.className : '')} key={option.value} onClick={e => this.handleChange(option.value, is_selected)}>
									{!this.props.no_status_icon && is_selected ? selected_icon : null}
									{option.label}
								</div>
							)
						})
					}
				</div>
			</div>
		)
	}
}
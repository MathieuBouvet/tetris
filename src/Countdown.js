import React, { Component } from "react";
import "./Countdown.css";

class Countdown extends Component {
	constructor(props){
		super(props);
		this.state = {
			count: 3,
		}
	}
	componentDidMount(){
		this.countingDown = setInterval(() => {
			let { count } = this.state;
			this.setState({
				count: --count,
			});
			if(count < 0){
				clearInterval(this.countingDown);
				this.props.onFinish();
			}
		},1000);
	}
	componentWillUnmount(){
		clearInterval(this.countingDown);
	}
	render(){
		return (
			<div className="countdown">
				{ this.state.count > 0 ? this.state.count :"GO!" }
			</div>
		)
	}
}

export default Countdown;
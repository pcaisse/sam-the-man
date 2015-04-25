var React = require('react');

Man = React.createClass({
	getInitialState: function(){
		return {
			top: 0,
			left: 0
		}
	},
    render: function() {
    	var styles = {
    		top: this.state.top + 'px',
    		left: this.state.left + 'px'
    	};
        return (
            <div id="man" className="run-r" alt="{this.props.name}" style={styles}></div>
        );
    },
    componentDidMount: function() {
    	this.walk(true);
    },
    walk: function(direction) {
    	var that = this;
    	var newLeft;
    	var walkId = setInterval(function() {
    		newLeft = direction ? this.state.left + 1 : this.state.left - 1
    		this.setState({
    			left: newLeft
    		});
    	}.bind(this), 100);
    }
});

React.render(
    <Man name={"Sam"} />, 
    document.getElementById('app')
);

module.exports = Man;

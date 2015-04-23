var React = require('react');

Man = React.createClass({
    render: function() {
        return (
            <div id="man" className="run-r" alt="{this.props.name}"></div>
        );
    }
});

React.render(
    <Man name={"Sam"} />, 
    document.getElementById('app')
);

module.exports = Man;

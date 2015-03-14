var React    = require('react');
var Fluxxor  = require('fluxxor');
var markdown = require('markdown').markdown;

var actions = {
  updateMessage: function(text) {
    this.dispatch("UPDATE_MESSAGE", { text: text });
  }
};

var MessageStore = Fluxxor.createStore({
  initialize: function() {
    this.message = "";
    this.bindActions(
      "UPDATE_MESSAGE", this.onUpdateMessage
    );
  },
  onUpdateMessage: function(payload) {
    this.message = payload.text;
    this.emit("change");
  },
  getState: function() {
    return { message: this.message };
  }
});

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var App = React.createClass({
  mixins: [ FluxMixin, StoreWatchMixin("MessageStore") ],
  getInitialState: function() {
    return {};
  },
  getStateFromFlux: function() {
    return this.getFlux().store("MessageStore").getState();
  },
  onChangeText: function(e) {
    this.getFlux().actions.updateMessage(e.target.value);
  },
  render: function() {
    return (
      <div>
        <h1>Hello, React</h1>
        <textarea onChange={this.onChangeText} />
        <Content markdown={this.state.message} />
      </div>
    );
  }
});

var Content = React.createClass({
  propTypes: {
    markdown: React.PropTypes.string
  },
  render: function() {
    var html = markdown.toHTML(this.props.markdown);
    return (
      <div dangerouslySetInnerHTML={{__html:html}} />
    );
  }
});

var stores = {
  MessageStore: new MessageStore()
};
var flux = new Fluxxor.Flux(stores, actions);

React.render(
  <App flux={flux} />,
  document.getElementById('app-container')
);

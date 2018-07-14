// checked 68
import React, { Component } from 'react';
import './App.css';
import Modal from 'react-modal';

const OptionModal=(props)=>(
  <Modal
  isOpen={!!props.selectedOption}
  onRequestClose={props.handleClearSelectedOption}
  contentLabel="Selaected option"
  closeTimeoutMS={100}
  className="modal">
   <h3 className="modal__title"> Selected option</h3>
   {props.selectedOption && <p className="modal__body">{props.selectedOption} </p>}
   <button className="button" onClick={props.handleClearSelectedOption}>Okay </button>
  </Modal>
)
  

class IndecisionApp extends React.Component {
  constructor(props) {
    super(props);
    this.handleDeleteOptions = this.handleDeleteOptions.bind(this);
    this.handlePick = this.handlePick.bind(this);
    this.handleAddOption = this.handleAddOption.bind(this);
    this.handleDeleteOption = this.handleDeleteOption.bind(this);
    this.handleClearSelectedOption=this.handleClearSelectedOption.bind(this);

    this.state = {
      selectedOption:undefined,
      options: props.options
    };
  }
  componentDidMount() {
    try {
      const json = localStorage.getItem('options');
      const options = JSON.parse(json);

      if (options) {
        this.setState(() => ({ options }));
      }
    } catch (e) {
      
    }
  }
  handleClearSelectedOption =()=>{
    this.setState(()=>({selectedOption:undefined}))
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.options.length !== this.state.options.length) {
      const json = JSON.stringify(this.state.options);
      localStorage.setItem('options', json);
    }
  }
  componentWillUnmount() {
    console.log('componentWillUnmount');
  }
  handleDeleteOptions() {
    this.setState(() => ({ options: [] }));
  }
  handleDeleteOption(optionToRemove) {
    this.setState((prevState) => ({
      options: prevState.options.filter((option) => optionToRemove !== option)
    }));
  }
  handlePick() {
    const randomNum = Math.floor(Math.random() * this.state.options.length);
    const option = this.state.options[randomNum];
    this.setState(()=>(
      {selectedOption:option}
    ))
  }
  handleAddOption(option) {
    if (!option) {
      return 'Enter valid value to add item';
    } else if (this.state.options.indexOf(option) > -1) {
      return 'This option already exists';
    }

    this.setState((prevState) => ({
      options: prevState.options.concat(option)
    }));
  }
  render() {
    const subtitle = 'Put your life in the hands of a computer';

    return (
      <div>
        <Header subtitle={subtitle} title="Indecision"/>
        <div className="container">
        <Action
        hasOptions={this.state.options.length > 0}
        handlePick={this.handlePick}
      />
      <div className="widget">
      <Options
        options={this.state.options}
        handleDeleteOptions={this.handleDeleteOptions}
        handleDeleteOption={this.handleDeleteOption}
      />
      <AddOption
        handleAddOption={this.handleAddOption}
      />
      </div>
        </div>
        
        <OptionModal 
        selectedOption={this.state.selectedOption}
        
        handleClearSelectedOption={this.handleClearSelectedOption}
        />
      </div>
    );
  }
}

IndecisionApp.defaultProps = {
  options: []
};

const Header = (props) => {
  return (
    <div className="header">
    <div className="container">
    <h1 className="header__title">{props.title}</h1>
    {props.subtitle && <h2 className="header__subtitle">{props.subtitle}</h2>}
    </div>
      
    </div>
  );
};


const Action = (props) => {
  return (
    <div>
      <button
        onClick={props.handlePick}
        disabled={!props.hasOptions}
        className="big-button"
      >
        What should I do?
      </button>
    </div>
  );
};

const Options = (props) => {
  return (
    <div>
     <div className="widget-header">
     <h3 className="widget-header__title"> Your options </h3>
     <button onClick={props.handleDeleteOptions}
     className="small-button button--link">Remove All</button>
     
     </div>
     {props.options.length === 0 && <p className="widget__message">Please add an option to get started!</p>}
      {
        props.options.map((option) => (
          <Option
            key={option}
            optionText={option}
            handleDeleteOption={props.handleDeleteOption}
          />
        ))
      }
    </div>
  );
};

const Option = (props) => {
  return (
    <div className="option">
      <p className="option__text"> {props.optionText}</p>
      <button
        className="small-button button--link"
        onClick={(e) => {
          props.handleDeleteOption(props.optionText);
        }}
      >
        remove
      </button>
    </div>
  );
};

class AddOption extends React.Component {
  constructor(props) {
    super(props);
    this.handleAddOption = this.handleAddOption.bind(this);
    this.state = {
      error: undefined
    };
  }
  handleAddOption(e) {
    e.preventDefault();

    const option = e.target.elements.option.value.trim();
    const error = this.props.handleAddOption(option);

    this.setState(() => ({ error }));

    if (!error) {
      e.target.elements.option.value = '';
    }
  }
  render() {
    return (
      <div>
        {this.state.error && <p className="add-option-error">{this.state.error}</p>}
        <form onSubmit={this.handleAddOption} className="add-option">
          <input type="text" name="option" className="add-option__input" />
          <button className="small-button">Add Option</button>
        </form>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
     <IndecisionApp />
    );
  }
}

export default App;

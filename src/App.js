import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
const axios = require('axios');

class TodoCreate extends Component {
  constructor(props){
    super(props);
    this.state = {
      newTodoText: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  handleChange(event){
    const newTodoText = event.target.value;
    this.setState({
      newTodoText
    })
  }

  handleSubmit(event){
    event.preventDefault();
    this.props.addTodo(this.state.newTodoText);
    this.handleClear();
  }

  handleClear(){
    const newTodoText = '';
    this.setState({ newTodoText });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type='text' name='text'
          value={this.state.newTodoText}
          onChange={this.handleChange}
        />
        <input type='submit' />
      </form>
    );
  }
}

class TodoDetails extends Component {
  constructor(props){
    super(props);
    this.state = {
      edit: false,
      text: this.props.item.text,
      editedText: this.props.item.text
    }
    this.toggleEdit = this.toggleEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  toggleEdit(){
    this.setState({
      edit: !this.state.edit,
    })
  }

  handleChange(event){
    const editedText = event.target.value;
    this.setState({
      editedText
    })
  }

  handleSubmit(){
    this.props.updateTodo(this.props.item.id, this.state.editedText)
    this.setState({
      edit: false
    })
  }

  render(){
    return ( 
      <li>
        {this.props.item.id} - {this.props.item.text} - {this.props.item.completed.toString()} 
        {
          this.props.item.completed ? 
          <button onClick={ () => { this.props.toggleCompleted(this.props.item.id, this.props.item.completed)} }>Mark Incomplete</button> : 
          <button onClick={ () => { this.props.toggleCompleted(this.props.item.id, this.props.item.completed)} }>Mark Complete</button>
        }
        <button onClick={ () => { this.props.removeTodo(this.props.item.id) } }>Remove</button>
        <button onClick={this.toggleEdit}>Edit</button>
        {
          this.state.edit ?

          <form onSubmit={this.handleSubmit}>
            <input type='text' name='editedText'
              value={this.state.editedText}
              onChange={this.handleChange}
            />
            <input type='submit' />
          </form>
          
          :

          null
        }
      </li>
    );
  }
}

class TodoList extends Component {

  constructor(props){
    super(props);

  }
  render(){
    return (
      <ul>
        {this.props.items.map((item, index) => {
          return <TodoDetails 
                  key={index} 
                  item={item} 
                  updateTodo={this.props.updateTodo} 
                  toggleCompleted={this.props.toggleCompleted} 
                />
        })}
      </ul>
    );
  }
};



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      filter: 'all'
    }
    this.addTodo = this.addTodo.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.removeTodo = this.removeTodo.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.toggleCompleted = this.toggleCompleted.bind(this);
    this.retrieveTodos();
  }

  retrieveTodos() {
    axios.get('https://5b563fd4503d920014688894.mockapi.io/api/v1/todos')
    .then( (response) => {
      console.log(response)
      this.setState({
        items: response.data
      });
    } )
  }

  addTodo(text) {
    axios.post('https://5b563fd4503d920014688894.mockapi.io/api/v1/todos', {text, completed: false})
    .then( (response) => {
      this.retrieveTodos();
    })
  }

  updateTodo(id, text) {
    axios.put('https://5b563fd4503d920014688894.mockapi.io/api/v1/todos/'+id, {text: text})
    .then( (response) => {
      this.retrieveTodos();
    })

  }

  removeTodo(todoId) {
    axios.delete('https://5b563fd4503d920014688894.mockapi.io/api/v1/todos/'+todoId)
    .then( (response) => {
      this.retrieveTodos();
    })
  }

  toggleCompleted(id, completedStatus) {
    axios.put('https://5b563fd4503d920014688894.mockapi.io/api/v1/todos/'+id, {completed: !completedStatus})
    .then( (response) => {
      this.retrieveTodos();
    })
  }

  updateFilter(filter) {

  }

  render() {
    return (
      <div>
        <TodoCreate
          addTodo={this.addTodo}
        />
        <TodoList
          items={this.state.items}
          updateTodo={this.updateTodo}
          removeTodo={this.removeTodo}
          toggleCompleted={this.toggleCompleted}
        />
      </div>
    );
  }
}

export default App;

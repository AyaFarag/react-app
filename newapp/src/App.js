import React, { Component } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Category from './route/Category';
import Posts from './route/Posts';
import Login from './route/Login';
import Signup from './route/Signup';
import { BrowserRouter, Route } from 'react-router-dom';
 

class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <div>
        
        <Navbar /> 

        <Route path="/category" component={Category} />
        <Route path="/posts" component={Posts} />
        <Route path="/login" component={Login} />
        <Route path='/signup' component={Signup} />

      </div>
      </BrowserRouter>
    );
  }
}

export default App;

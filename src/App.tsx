import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Header } from './components/Header';
import { Animals } from './components/Animals';
import { AnAnimal } from './components/AnAnimal';
import { PageNotFound } from './components/PageNotFound';

function App() {
  return (
    <div className="app-container">
      <Header></Header>
      <Router>
        <Switch>
          <Route exact path="/">
            <Animals></Animals>
          </Route>
          <Route path="/AnAnimal/:id">
            <AnAnimal></AnAnimal>
          </Route>
          <Route path="*">
            <PageNotFound></PageNotFound>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

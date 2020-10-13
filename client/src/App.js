import React from "react";
import "./PagesCss/Login.css";
import "./PagesCss/Dashboard.css";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import ErrorPage from "./Pages/Error";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./Components/Routes/PrivateRoute";
import PublicRoute from "./Components/Routes/PublicRoute";
import Home from "./Components/Home/Home";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <PublicRoute path="/" exact component={Login} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <Route path="/error" exact component={ErrorPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Home from "./components/home";
import Login from "./components/login";
import Register from "./components/register";
import Header from "./components/header";
import ProjectHome from "./components/projects";
import Sounds from "./components/sounds";
import Contact from "./components/contact";
import jwtDecode from "jwt-decode";
import About from "./components/about";
import ProjectEditor from "./components/projectEditor";
import Performance from "./components/performance";
import Cookies from "universal-cookie";
import Projects from "./components/projects/editor";
import { removePerformance } from "./components/performance/actions";
import { showToastr, showToastrError } from "./actions/common";

const cookies = new Cookies();
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    try {
      const jwt = cookies.get("token");
      const user = jwtDecode(jwt);
      this.setState({ user: user });
    } catch (ex) {}
  }
  leavingProjectEditor = () => {
    if (this.props.location.pathname.split("/")[1] !== "project-editor") {
      this.props.dispatch({
        type: "CLEAR_STATE",
        value: undefined
      });
    }
  };

  leavingPerformance = () => {
    let path = this.props.location.pathname.split("/");
    let performanceId = path[2];
    if (path[1] !== "performance") {
      removePerformance({ performanceId })
        .then(res => {
          showToastr("success", res.message);
        })
        .catch(error => {
          showToastrError(error);
        });
    }
  };

  render() {
    const { user } = this.state;
    return (
      <div>
        <Header user={user} name={cookies.get("name")} />
        <Switch>
          <Route path="/signIn" component={Login} />
          <Route
            path="/project-editor/:id"
            component={ProjectEditor}
            // onLeave={this.leavingProjectEditor()}
          />
          <Route
            path="/performance/:id"
            component={Performance}
            // onLeave={this.leavingPerformance()}
          />
          <Route path="/register" component={Register} />
          <Route path="/home" component={Home} />
          <Route
            exact
            path="/projects"
            component={() => <ProjectHome user={user} />}
          />
          <Route
            exact
            path="/projectsList"
            component={() => <Projects user={user} />}
          />
          <Route
            exact
            path="/sounds"
            component={() => <Sounds user={user} />}
          />
          <Route exact path="/contact" component={Contact} />
          <Route
            exact
            path="/about"
            component={() => (
              <About
                leaders={[
                  {
                    id: 1,
                    name: "Roger Dannenberg",
                    description: "description"
                  },
                  {
                    id: 2,
                    name: "Jorge Sastre Martinez",
                    description: "description"
                  },
                  { id: 3, name: "Amit Meena", description: "description" },
                  { id: 4, name: "Ankit Joshi", description: "description" },
                  { id: 5, name: "Manuel Alcañiz", description: "description" },
                  { id: 6, name: "Huan Zhang", description: "description" }
                ]}
              />
            )}
          />
          <Route path="/" component={Home} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  blocks: state.blocks
});

export default withRouter(connect(mapStateToProps)(Main));

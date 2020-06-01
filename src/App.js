// Main to render in Index.js

// JS pakages imported from web
import React, { Component } from "react";
import Particles from "react-particles-js";

// JS created by itself
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
// CSS file for styling
import "./App.css";

// Particles Background function
const particleOpt = {
  number: {
    value: 20,
    desnsity: {
      enable: true,
      value_area: 800,
    },
  },
};

const intialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
};
// Main APP class to contain all the components
class App extends Component {
  // constructor with states
  constructor() {
    super();
    this.state = intialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  // returns cordinates of Face location
  calculateFaceLocation = (data) => {
    const clariFaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clariFaiFace.left_col * width,
      topRow: clariFaiFace.top_row * height,
      rightCol: width - clariFaiFace.right_col * width,
      bottomRow: height - clariFaiFace.bottom_row * height,
    };
  };
  // Sets generated cordinates into box state which will be given to Facecognition component to show box around face
  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  // Takes text from input flied to set the state
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };
  // get input state text and copy it as URL, also calls checkAPI function to detect faces
  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch("https://pacific-everglades-79262.herokuapp.com/imageurl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: this.state.input,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status.description === "Ok") {
          fetch("https://pacific-everglades-79262.herokuapp.com/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch(console.log);
          this.displayFaceBox(this.calculateFaceLocation(response));
        }
      })
      .catch((err) => console.log(err));
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(intialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, box, route } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particleOpt} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />

        {route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition imageUrl={imageUrl} box={box} />
          </div>
        ) : this.state.route === "register" ? (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        ) : (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;

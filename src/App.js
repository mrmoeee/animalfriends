import React, { Component } from 'react';
import './App.css';

import firebase, { auth, provider } from './firebase.js';

class App extends Component {

  constructor() {
    super();
    this.state = {
      username: '',
      currentItem: '',
      items: [],
      user: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    // on page load render all the items already in the database
    // itemReferences 
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState( {user} );
      }
    });
    const itemRefs = firebase.database().ref('items');
    // what is value, snapshot callback to re-render when new items are added to database
    itemRefs.on('value', (snapshot) =>  {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user
        })
      }
      this.setState({
        items: newState
      })
    });
  }

  logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  } 
  
  login() {
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
      });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let itemsRef = firebase.database().ref('items');
    let item = {
      title: this.state.currentItem,
      user: this.state.user.displayName || this.state.user.email
    }
    itemsRef.push(item);
    // resets state when item is pushed into database
    // reset input field 
    this.setState({
      currentItem: '',
      username: ''
    });
  }

  removeItem(itemId) {
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();
  }

  render() {
    return (
      <div className='app'>
        <header>
            <div className='wrapper'>
              <h1>Animal Friends</h1>
              {this.state.user ?
                <button onClick={this.logout}>Log Out</button>
                :
                <button onClick={this.login}>Log In</button>
              }
            </div>
        </header>
        {this.state.user ?
          <div>
            <div className='user-profile'>
              <img src={this.state.user.photoURL} alt='profile-pic'/>
            </div>
            <div className='container'>
              <section className='add-item'>
                <form onSubmit={this.handleSubmit}>
                  <input type="text" name="username" placeholder="What's your name?" onChange={this.handleChange} value={this.state.user.displayName || this.state.user.email} readOnly />
                  <input type="text" name="currentItem" placeholder="What animal are you adding?" onChange={this.handleChange} value={this.state.currentItem} />
                  <button>Add Animal</button>
                </form>
              </section>
              <section className='display-item'>
                <div className="wrapper">
                  <ul>
                    {this.state.items.map((item) => {
                      return (
                        <li key={item.id}>
                          <h3>{item.title}</h3>
                          <p>listed by: {item.user}
                             {item.user === this.state.user.displayName || item.user === this.state.user.email ? 
                             <button onClick={() => this.removeItem(item.id)}>Remove Item</button> : null}
                          </p>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </section>
            </div>
          </div>
          :
          <div className='wrapper'>
            <p> You must be logged in to see the Animals</p>
          </div>
        }
        
      </div>
    );
  }
}
export default App;

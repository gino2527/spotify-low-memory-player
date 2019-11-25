import React from 'react';

import axios from 'axios';
import queryString from 'query-string';

// npm components
import {
  Button,
  Image
} from 'react-bootstrap';

// scss
import '../scss/App.scss';

const params = {
  client_id: '21414b52ec3b448c9eff4c6de5d7048b',
  response_type: 'token',
  redirect_uri: `${window.location.origin}${window.location.pathname}`
  // scope: 'user-read-currently-playing user-read-playback-state user-modify-playback-state'
};

const spotifyUrl = `https://accounts.spotify.com/authorize?${queryString.stringify(params)}`;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      access_token: '',
      artists: [],
      playing: {},
      user_type: 'user'
    };

    this.fetchUser = this.fetchUser.bind(this);
    this.handleClickNextSong = this.handleClickNextSong.bind(this);
    this.handleClickPrevSong = this.handleClickPrevSong.bind(this);
  }

  componentDidMount() {
    const hash = window.location.hash;

    if (hash) {
      const hashObject = queryString.parse(hash.slice(1));
      const { access_token } = hashObject;

      this.setState({ access_token }, () => {
        this.fetchUser();
      });
    }
  }

  fetchUser() {
    const { access_token } = this.state;

    axios.get(
      'https://api.spotify.com/v1/me/player', {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    ).then(({ data }) => {
      const { item } = data;

      this.setState({
        artists: item.artists,
        playing: item
      });
    }).catch(() => {
      // window.location = '/';
    })
  }

  handleClickNextSong() {
    const { access_token } = this.state;

    axios.post(
      'https://api.spotify.com/v1/me/player/next', {}, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    ).then(() => {
      setTimeout(() => {
        this.fetchUser();
      }, 1000);
    })
  }

  handleClickPrevSong() {
    const { access_token } = this.state;

    axios.post(
      'https://api.spotify.com/v1/me/player/previous', {}, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    ).then(() => {
      setTimeout(() => {
        this.fetchUser();
      }, 1000);
    })
  }

  render() {
    const {
      access_token,
      artists,
      playing
    } = this.state;
    return (
      <div className="spotify-q">
      {!access_token
        ? (
          <a
            href={spotifyUrl}
          >
            Login to spotify
          </a>
        )
        : (
          Object.keys(playing).length > 0
            ? (
              <div>
                <Button
                  className="spotify-q__button next"
                  onClick={this.handleClickPrevSong}
                  variant="success"
                >
                  <Image
                    height="10"
                    src="back.svg"
                  />
                </Button>
                {artists.map(({ name }) => name).join(', ')} - {playing.name}
                <Button
                  className="spotify-q__button prev"
                  onClick={this.handleClickNextSong}
                  variant="success"
                >
                  <Image
                    height="10"
                    src="next.svg"
                  />
                </Button>
                {/* <div>
                  <input ref={(e) => { this.search = e; }}/>
                  <button onClick={() => {
                    const { access_token } = this.state;

                    axios.get(
                      'https://api.spotify.com/v1/search', {
                        params: {
                          q: this.search.value,
                          type: 'artist'
                        },
                        headers: {
                          Authorization: `Bearer ${access_token}`
                        }
                      }
                    ).then(() => {
                      setTimeout(() => {
                        this.fetchUser();
                      }, 1000);
                    })
                  }}>
                    search
                  </button>
                </div> */}
              </div>
            )
            : (
              <div>
                no song
              </div>
            )
        )
      }
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import MapGL, {Marker} from 'react-map-gl';
import Pin from 'components/pin/Pin';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'actions/REST';


export class Home extends Component {
  state = {
    viewport: {
      width: 800,
      height: 800,
      longitude: -123.120738,
      latitude: 49.282729,
      zoom: 12
    },
    popupInfo: null,
  }
  componentDidMount () {
    this.props.actions.get('bus', null, null, {});
  }

  componentDidUpdate (prevProps, prevState, snapShot) {
    if(prevProps.bus.loading && !this.props.bus.loading){
      setTimeout(() => {
        if(!this.props.bus.loading){
          this.props.actions.get('bus', null, null, {});
        }
      }, 3000);
    }
  }
  
  _updateViewport = (viewport) => {
    this.setState({viewport});
  }

  _renderBusMarker = (bus, index) => {
    return (
      <Marker 
        key={`marker-${index}`}
        longitude={bus.Longitude}
        latitude={bus.Latitude} >
        <Pin size={20} onClick={() => this.setState({popupInfo: bus})} />
      </Marker>
    );
  }

  render() {
    const { viewport } = this.state;
    const busLoc = this.props.bus.busLoc;
    return (
      <div className="map-container">
        <MapGL
        {...viewport}
        onViewportChange={this._updateViewport}
        mapboxApiAccessToken={process.env.MAPBOX_TOKEN} >

        { busLoc.map(this._renderBusMarker) }

      </MapGL>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  bus: state.busReducer,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({ get }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

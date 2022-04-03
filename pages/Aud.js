import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import {useState} from 'react'
const Aud = props => {
        return (
        <AudioPlayer
        src={props.music}
        onPlay={e => console.log("onPlay")}
        // other props here
      />

      );
}
export default Aud;

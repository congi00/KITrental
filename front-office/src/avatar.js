import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';


function Avatar(){
  const imageURL = 'https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331256__340.png'
  const Example = ({ imageURL }) =>  <img className="avatarImg" src={imageURL} />

  return(
    <Example imageURL={imageURL} />
  );
  }

export default Avatar;

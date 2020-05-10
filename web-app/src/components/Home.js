import React from 'react';
import './../css/Home.css';

class Home extends React.Component {
   constructor(props){
      super(props);

      this.translateText = this.translateText.bind(this);
   }

   async translateText(){
      this.props.translateService.translateText("Goodbye", "en", "fr").then(function(response){
         console.log(response);
      }, function(error){
         console.log(error);
      })
   }

   render() {
      return (
         <div className='home-container'>
            <button onClick={this.translateText}>Hello World</button>
         </div>
      );
   }
}

export default Home;
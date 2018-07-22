
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as React from 'react';
import Dropzone from 'react-dropzone';
// import Loader from 'react-loader-spinner'
import './App.css';
import {ThemeContext, themes} from './theme-context';


interface IState {
  imageFiles: any[],
  results: any,
  dropzone: any,
  theme: any,
  toggleTheme: any
}

export default class App extends React.Component<{}, IState> {

  constructor(props: any) {
    super(props);
  
    this.state = {
      imageFiles: [],
      results: "",
      dropzone: this.onDrop.bind(this),
  
      theme: themes.dark,
      toggleTheme: this.toggleTheme(),
    };
  }

  public toggleTheme = () => {
    this.setState(state => ({
      theme: 
        state.theme === themes.light
          ? themes.dark
          : themes.light,
    }));
  };

  public onDrop(files: any) {
    this.setState({
      imageFiles: files,
      results: ""
    })
    const file = files[0]
    const reader = new FileReader();
    reader.onload = (readerEvt) => {
        const binaryString = readerEvt.target!!.result;
        this.upload(btoa(binaryString))
    };

    reader.readAsBinaryString(file);
  }

  public upload(base64String: string) {
    fetch('https://danktrigger.azurewebsites.net/api/dank', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        file: base64String,
      })
    })
    .then((response : any) => {
      if (!response.ok) {
        this.setState({results: response.statusText})
      }
      else {
        response.json().then(data => this.setState({results: data[0].class}))
      }
      return response
    })
  }



  public render() {

    return (

      <div className="container-fluid" >
        
        <ThemeContext.Provider value={this.state}>
          <ThemeContext.Consumer>
            {theme => (
              <div className="centreText" style={{backgroundColor: theme.theme.background, color: theme.theme.foreground}}>
                {/* React components must have a wrapper node/element */}
                <div className="dropZone">
                  <Dropzone onDrop={this.state.dropzone} style={{position: "relative"}}>
                    <div style={{height: '50vh'}}>
                      {
                        this.state.imageFiles.length > 0 ? 
                          <div>{this.state.imageFiles.map((file) => <img className="image" key={file.name} src={file.preview} /> )}</div> :
                          <div>
                          <p className="center">Try dropping some files here, or click to select files to upload.
                          </p>
                          <img src={require('./upload.png')} width="100" height="100" />
                          </div>
                      }  
                    </div>
                  </Dropzone>
                </div>
                <div className="dank">
                {
                  this.state.results === "" && this.state.imageFiles.length > 0 ?
                  // <Loader type="TailSpin" color="#00BFFF" height={80} width={80}/> :
                  <CircularProgress thickness={3} />:
                  <p>{this.state.results}</p>
                }
                </div>
              </div>
              
            )}
          </ThemeContext.Consumer>

          <div>
              <Button onClick={this.toggleTheme}>Change Theme</Button>
          </div>
        
        </ThemeContext.Provider>
      
      </div>
    );
  }
}


// WEBPACK FOOTER //
// ./src/App.tsx
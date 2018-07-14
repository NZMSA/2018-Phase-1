import * as React from 'react';
import Dropzone from 'react-dropzone'
import Loader from 'react-loader-spinner'
import './App.css';

interface IState {
  imageFiles: any[],
  results: any,
  dropzone: any
}

export default class App extends React.Component<{}, IState> {
  
  constructor(props: any) {
    super(props)
    this.state = {
      imageFiles: [],
      results: "",
      dropzone: this.onDrop.bind(this)
    }
  }

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
        response.json().then((data:any) => this.setState({results: data[0].class}))
      }
      return response
    })
  }
  
  public render() {
    return (
      <div className="container-fluid">
        <div className="centreText">
          <div className="dropZone">
            <Dropzone onDrop={this.state.dropzone} style={{position: "relative"}}>
              <div style={{height: '50vh'}}>
                {
                  this.state.imageFiles.length > 0 ? 
                    <div>{this.state.imageFiles.map((file) => <img className="image" key={file.name} src={file.preview} /> )}</div> :
                    <p>Try dropping some files here, or click to select files to upload.</p>
                }  
              </div>
            </Dropzone>
          </div>
          <div  className="dank">
          {
            this.state.results === "" && this.state.imageFiles.length > 0 ?
            <Loader type="TailSpin" color="#00BFFF" height={80} width={80}/> :
            <p>{this.state.results}</p>
          }
          </div>
        </div>
      </div>
    );
  }
}

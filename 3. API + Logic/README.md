# Introduction

In this session, we will be integrating our front end to the dankNotDank back end. This is so that we are able to send an image to the server and have our model find out if the photo is dank, or not dank.

## Setting up libraries
So first, open up the terminal on visual studio code View -> Integrated Terminal Or press Ctrl + `.

Type `npm i --save react-dropzone` followed by `npm i @types/react-dropzone` into your integrated terminal.
We will be using react-dropzone <https://github.com/react-dropzone/react-dropzone> in order to have a drag and drop API for our images.

After that, we will be installing "react-loader-spinner". This is just a spinner widget that will be in place while our results load.
In your terminal type in `npm i --save react-loader-spinner`.

Finally, if you haven't followed part 1 type in `npm i` and you will install all of the declared dependencies.

We will now go to the images.d.ts file and declare the module react-loader-spinner. We do this because, in TypeScript everything has be explicitly "typed". Since this is not a TypeScript module, we will have to declare it inside the "typings" file so that the TypeScript compiler does not get upset.

Type in
`declare module 'react-loader-spinner' `
inside images.d.ts

inside your app.tsx 
import these modules

```typescript
import * as React from 'react';
import Dropzone from 'react-dropzone'
import Loader from 'react-loader-spinner'
import './App.css';
```

Copy paste this snippet into your `tslint.json` file
```json
,
  "rules": {
    "object-literal-sort-keys": false
  }
```


## Starting the coding
In React you can define components in two different ways.
1. As a function
2. As a class

Declaring a component as a class has its own benefits that we will talk about shortly. 

We now want to start by declaring the interface that the State of the component will adhere to. If you are familiar with object-oriented programming languages "state" is similar to a private field. State is fully controlled and private to the class it is contained in. Only components that are declared as a class will have state in them.

The interface we will define inside your app.tsx, before the component declaration is 

```typescript
interface IState {
  imageFiles: any[],
  results: any,
  dropzone: any
}
```

Where imageFiles are the images that you upload, results are the results from the API, and the dropzone is a special state so that we can bind the current execution context to the state to access later. This is there so that we have the same context even when in an callback function. Don't worry if you don't understand what all of this means, hopefully with more time it will be clear!

You want to make sure that your export line in your app.tsx file looks like this too, this is so that the class actually adheres to the interface that we previously created.

```typescript
export default class App extends React.Component<{}, IState>
```


We now want to initialize our constructor inside of the App.tsx class

```typescript
  constructor(props: any) {
    super(props)
    this.state = {
      imageFiles: [],
      results: "",
      dropzone: this.onDrop.bind(this)
    }
  }
```
This just initializes the state we want to store later.

We will now start with the onDrop function. The onDrop's fuunction has the responsibility of displaying the image when dragged and dropped onto the screen.

```typescript
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
```
So here in the function, we pass in a file, and then we read the image, display it by setting the imageFiles state to files and upload the image using the upload method which we will implement next. The btoa() function encrypts the image into a base 64 string.


The upload function is next.
```typescript
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
```
Here what we do is we send a POST request to the API. The content is the base64 string we encoded previously. After the request has been sent we then guage responses. If the response is "ok" we can set the state to the dankness meter. Otherwise, we set it to the error message.


We now have the functions that we need, we can now get into writing the actual code for some of the very basic UI. 

```typescript
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
 ```
 This is the function that will render the main page of the application, where you can now upload the image and upload it to the machine learning model, and receieve a dankness score! 
 
So this is a very simple HTML snippet in react. The purpose of it is to simply host the "dropzone" where we will be placing our photo in, and then showing the progress of uploading, and then shows us the response we recieve from the server. 

Now we have a dropzone where we can add pictures to check the dankness of them. However, it's a little bit too big and not so obvious. Let's now open the  `css -> styles.css` file. We will now be using some basic styling for our application.

Paste this code snippet into the file and save it

```css

.centreText {
  text-align: center;
}

h1 {
  font-size: 150px;
}

.dropZone {
height: 50vh;
border-style: dashed;
}

.image {
max-width: 100%;
height: 50vh;
padding-top: 3px;
padding-bottom: 9px;
}

.dank {
padding-top: 20px;
}
```
What this does is that it gives some very basic UI to the dropzone. It gives the DropZone a dashed border, limits the size of it on the screen and centerizes the text. 

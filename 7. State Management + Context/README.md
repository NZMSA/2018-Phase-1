# 7. State Management + Context Integration
## Introduction
### Background
React itself, is a library for UI. It does not come with any explicit way to manage state cleverly. State can be described as a property of the system. In this case we are trying to manage the "Global" state of a system. So state that is available to all parts of the system.

### Problem with React's state management system
If you are using react as it is, you would be passing "Props" through intermediate elements to pass the data down to another component.

The easiest way to explain why this is problematic is by giving the example that's on the React Documentation


```javascript
class App extends React.Component {
  render() {
    return <Toolbar theme="dark" />;
  }
}

function Toolbar(props) {
  // The Toolbar component must take an extra "theme" prop
  // and pass it to the ThemedButton. This can become painful
  // if every single button in the app needs to know the theme
  // because it would have to be passed through all components.
  return (
    <div>
      <ThemedButton theme={props.theme} />
    </div>
  );
}

function ThemedButton(props) {
  return <Button theme={props.theme} />;
}
```
Here you can see you have to pass in a prop to the toolbar  so that you can pass it to the ThemedProp function, so that you can apply the theme. You are having to pass it through multiple intermediate components for a component a few levels deeper in the component tree to access it.

### Solution
When using a state management system like context (Which is a very simple one) you do not have to pass down props to child components through intermediate components.

```javascript
// Context lets us pass a value deep into the component tree
// without explicitly threading it through every component.
// Create a context for the current theme (with "light" as the default).
const ThemeContext = React.createContext('light');

class App extends React.Component {
  render() {
    // Use a Provider to pass the current theme to the tree below.
    // Any component can read it, no matter how deep it is.
    // In this example, we're passing "dark" as the current value.
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// A component in the middle doesn't have to
// pass the theme down explicitly anymore.
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton(props) {
  // Use a Consumer to read the current theme context.
  // React will find the closest theme Provider above and use its value.
  // In this example, the current theme is "dark".
  return (
    <ThemeContext.Consumer>
      {theme => <Button {...props} theme={theme} />}
    </ThemeContext.Consumer>
  );
}
```
For context to work, you need a provider and a consumer. The provider is the one that "provides" the content. It sets the context to some state, and then the consumer is free to consume the content.

As you can see above, the provider is in the render() function, and the themedButton function is the consumer.

Examples taken from <https://reactjs.org/docs/context.html>

## Context Integration
### Before We Start
This tutorial/walkthrough will be building upon the UI part of the over-arching project. To follow this tutorial I recommend building upon the finished UI project available on the GitHub under the "5. User interface + Displaying API results" folder.

This tutorial will be going through how we can use Context API to apply a light/dark theme to the project we have been building.

### Tutorial / Walkthrough
First, we will create a file named "theme-context.tsx" in the src folder. In this file, we will have the following code to define the object themes, which contains the styling for each theme.
```typescript
export const themes = {
  light: {
    foreground: '#000000',
    background: '#eeeeee',
  },
  dark: {
    foreground: '#ffffff',
    background: '#222222',
  },
};
```

Next, in the same file we define a context object, ThemeContext.
```typescript
export const ThemeContext = React.createContext({
  theme: themes.dark
});
```

Next, in the App.tsx file we need to change the constructor to appear as the following. This is just defining the toggleTheme method and setting the states. We are also going to set the default theme to dark, so we can clearly see the changes we make.
```typescript
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
```
Changing the constructor to appear as such you will have noticed, created a bunch of errors. That is due to a number of reasons.
First, we need to define the two new state variables in our IState interface as such.
```typescript
interface IState {
  imageFiles: any[],
  results: any,
  dropzone: any,
  theme: any,
  toggleTheme: any
}
```
Second, we have not imported the themes from the theme-context.tsx file we created before. So add the following import statement to the App.tsx file at the top.
```typescript
import {themes} from './theme-context';
```
Finally, we need to define the toggleTheme method. Add the following function in the App class, in the App.tsx file.
```typescript
public toggleTheme = () => {
  this.setState(state => ({
    theme: 
      state.theme === themes.light
        ? themes.dark
        : themes.light,
  }));
}; 
```

Now it is time to start using our themes. In the import statement we made earlier add ThemeContext. In the render method for App.tsx, encapsulate all the html code, from the first div to the last so that it looks like the following.

new import statement:
```typescript
import {ThemeContext, themes} from './theme-context';
```
new render method:
```typescript
public render() {
  return (
    <ThemeContext.Consumer>
      {theme => (
    <div className="container-fluid">
      // ALL THE REST OF THE HTML CODE HERE
    </div>
      )}
    </ThemeContext.Consumer>
  );
}
```
We can now edit the html code to use the styling we defined in the theme-context.tsx file. Change the second div, which has the class name "container-fluid" to have the following styling.
```typescript
public render() {
  return (
    <div className="container-fluid" >
      <ThemeContext.Consumer>
        {theme => (
          <div className="centreText" style={{backgroundColor: theme.theme.background, color: theme.theme.foreground}}>
            // ALL THE REST OF THE HTML CODE HERE
          </div>
        )}
      </ThemeContext.Consumer>
    </div>
  );
}
```
Now if you look at the webpage, dark theme should be applied to just the main body.

Next, we need to add the ThemeContext Provider. This will wrap around the ThemeContext Consumer tag, so it should look at the following.
```typescript
public render() {
  return (
    <div className="container-fluid" >

      <ThemeContext.Provider value={this.state}>

        <ThemeContext.Consumer>
          // CODE HERE
        </ThemeContext.Consumer>

      </ThemeContext.Provider>
    
    </div>
  );
}
```

Finally, we are going to add a button at the bottom of the page to switch our current theme. After the ThemeContext Consumer end tag `</ThemeContext.Consumer>' in the render method, add the following code.
```typescript
<div>
  <Button onClick={this.toggleTheme}>Change Theme</Button>
</div>
```

You should now be able to see a button and click it to switch the theme on the body of the page!
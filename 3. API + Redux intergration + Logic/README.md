# 3. API + Context intergration + Logic
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

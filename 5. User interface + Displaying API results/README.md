# 5. User interface + Displaying API results
## Introduction
In this module we will be looking at how to spruce up out UI with some componenets using [MaterialUI](https://material-ui.com/).

MaterialUI provides us with react components that implement google material ui design.

## Getting Started
We will simply use npm to install the material ui package. To do inside your terminal type

```sh
npm install --save @material-ui/core
```

We will also be need icons from material ui

```sh
npm install --save @material-ui/icons
```

And that's it! We're ready to MaterialUI Components inside our web application

### Loading Spinner

Let's start with something super simple, we can replace the react loading spinner with material ui spinner.
We can see more examples of it [here](https://material-ui.com/demos/progress/)

We will require the Circular Progress component so at the top of our `App.tsx` page

```sh
import CircularProgress from '@material-ui/core/CircularProgress';
```

Next up we can replace the react loader with the material ui loader by replacing this line

```
<Loader type="TailSpin" color="#00BFFF" height={80} width={80}/>
```
with 

```
<CircularProgress thickness={3} />
```

### Navbar
To change our navbar let's head back into our `Header.tsx` file.
Insert the following at the top of the our file.

```
import {AppBar, IconButton, Toolbar, Typography} from '@material-ui/core/';
```

Don't forget to also include the `import` statement for materialUI icons

```
import MenuIcon from '@material-ui/icons/Menu';
```

And change the following.

```
export const Header: React.StatelessComponent<{}> = () => {
    return (
            <AppBar position="static">
                <Toolbar>
                    <IconButton  aria-label="Menu" color="inherit">
                        <MenuIcon aria-haspopup="true"/>
                    </IconButton>
                    <Typography variant="display2" color="inherit">
                        <Link style={{color: "white"}} to="/">dankNotDank</Link>
                        <Link to="/FirstComponent"> Page 1 </Link>
                        <Link to="/SecondComponent"> Page 2 </Link>
                    </Typography>
                </Toolbar>
            </AppBar>
    );
}
```








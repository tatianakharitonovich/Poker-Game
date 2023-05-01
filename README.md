# Poker Game (Texas Hold'em)

My web app is built using the latest technologies such as TypeScript, React TS, CSS, and MobX.

When loading the game, you can see the preloader, it is necessary to load all the sounds and music of the application.

At the beginning, the User should enter the name, gender and total number of players.

When we start filling in the data, background music starts playing.\
As soon as all the fields are filled in, we have the opportunity to click the Submit button. Thus, the simplest validation is implemented.

We click the "Submit" button and see the following preloader. It is required to load players data.

And finally we see the game table with the User and a robot players.\
The cards are dealt. The dealer is randomly determined. There is a big and small blind.

Music plays in the background, which the User can turn off if desired.\
All actions and button clicks are also accompanied by sounds that can be turned off.

Players take turns betting until the stakes are equalized.\
When it's the User's turn to bet, he has the option to raise, make the same bet, or fold.

Depending on the type of bet, we hear different sounds. For example, when a check, we hear a knock.

The robot players are smart enough. You may get the impression that you are playing with real people.

However, this app is great for beginner players who want to improve their poker skills.

If the User does not remember Poker Hands, there is a hint above the cards.

At the end of each round, the application analyzes the hands of each player and determines the winner, calculates the winnings and losses for each participant.
Then we can start a new round.

If the User is not satisfied with the course of the game or he has little money left, the User can restart the game at any time, which gives him the opportunity to try his hand at winning again and again.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
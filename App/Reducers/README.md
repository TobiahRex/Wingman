Reducers transform the global state by handling actions.

#### The reducers are created from _"redux-sauce"_
Methods:
  - createReducer: This will take 1) an initial state and 2) an action handler function.
  - createTypes: This will create a list of types from a template string.

#### Immutability is maintained by [_"seamless-immutable"_]("https://github.com/rtfeldman/seamless-immutable")
##### Documentation is great with this.
##### Check it out for more info.
##### Think of it as a front end mongoose to Mongo DB.
Methods:
  - Immutable(_data here_)
  - Immutable._merge_
  - Immutable.(_data here_)._flatMap_ : This is the same as applying a regular JS "map" method to some sort of array.
  - Immutable.(_data here_)._asObject_(() => ): This will convert any array of data into an object of data.

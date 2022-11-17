const AddMovieCommand = {
  "name": "addmovie",
  "description": "Add movies and their download/stream links to the DB",
  "options": [
    {
      "type": 3,
      "name": "title",
      "description": "Add the title of the movie",
      "required": true
    },
    {
      "type": 3,
      "name": "link",
      "description": "Add the link to the movie",
      "required": true
    }
  ]
}

export { AddMovieCommand }
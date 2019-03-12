(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies'
  const POSTERS_URL = BASE_URL + '/posters/'
  const data = []
  const genres = {
    "1": "Action",
    "2": "Adventure",
    "3": "Animation",
    "4": "Comedy",
    "5": "Crime",
    "6": "Documentary",
    "7": "Drama",
    "8": "Family",
    "9": "Fantasy",
    "10": "History",
    "11": "Horror",
    "12": "Music",
    "13": "Mystery",
    "14": "Romance",
    "15": "Science Fiction",
    "16": "TV Movie",
    "17": "Thriller",
    "18": "War",
    "19": "Western"
  }

  axios.get(INDEX_URL)
    .then(function (response) {
      data.push(...response.data.results)
      showMovieList(data)
    })
    .catch(err => console.log(err))

  // Show movie list  
  function showMovieList(data) {
    let htmlContent = ''
    const dataPanel = document.getElementById('data-panel')
    data.forEach(function (movie, index) {
      htmlContent += `
      <div class='col-sm-3'>
        <div class='card md-2' id='movie'>
          <img class='card-img-top' src='${POSTERS_URL}${movie.image}' alt='card image cop'>
          <div class='card-body movie-item-body'>
            <h5 class='text-center'>${movie.title}</h5>
          </div>
          <div class="card-footer">
            ${showCardGenresList(movie.genres)}
          </div>
        </div>
      </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  // Genres
  function showGenre(genreNum) {
    return genres[genreNum]
  }

  function showCardGenresList(item) {
    let genreStr = ""
    item.forEach(function (genreNum) {
      genreStr += `
      <p class="text-wrap badge text-center text-muted">${showGenre(genreNum)}</p>
    `
    })
    return genreStr
  }

  // Show genres list
  const genresList = document.getElementById('genres')
  function showGenresList() {
    let htmlContent = ''
    for (let item in genres) {
      htmlContent += `
        <li class="list" >
          <a class="nav-link text-center" href="#">${genres[item]}</a>
        </li>
      `
    }
    genresList.innerHTML = htmlContent
  }
  showGenresList()

  // Show genres movie
  function checkMovieGenre(movie, eventTargetText) {
    let res = false;
    for (let movieGenre of movie.genres) {
      if (showGenre(movieGenre) === eventTargetText) {
        res = true;
        break;
      }
    }
    return res;
  }

  function showMovieByGenre(genreStr) {
    axios.get(INDEX_URL)
      .then(response => {
        const researchList = response.data.results;
        const research = [];

        for (let movie of researchList) {
          if (checkMovieGenre(movie, genreStr)) {
            research.push(movie);
          }
        }
        showMovieList(research);
      })
      .catch(err => console.log(err));
  }

  // Genres click function
  genresList.addEventListener('click', event => {
    // Remove all active class first
    let listItem = document.querySelectorAll(".nav-link");
    listItem.forEach(item => {
      item.classList.remove("badge-primary")
    });

    // Check the target item
    event.target.classList.add("badge-primary")

    showMovieByGenre(event.target.innerHTML)
  })
})()
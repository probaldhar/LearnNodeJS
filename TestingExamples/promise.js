// NodeJS
// A function that will return a Promise object
function getData() {
    return new Promise((resolve, reject)=>{
        request( `http://www.omdbapi.com/?t=The+Matrix`, (error, res, movieData) => {
            if (error) 
            	reject(error);
            else 
            	resolve(movieData);
        });
    });
}


// Calling the getData function
// we can chain with then() or catch() because
// getData() is returning a Promise object
getData()
    .then(data => console.log(data))
    .catch(error => console.log(error));
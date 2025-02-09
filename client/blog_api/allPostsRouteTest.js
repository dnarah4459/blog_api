import axios from 'axios'; 

axios.get('http://localhost:8080/api/all-posts')
  .then(response => {
    console.log(response.data); // The response data
  })
  .catch(error => {
    console.error('Error:', error);
  });

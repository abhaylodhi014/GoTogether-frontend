//config.js

//API_NOTIFICATION_MESSAGES
export const API_NOTIFICATION_MESSAGES ={
    //if we have loader
    loading:{
        title : 'loading..',
        message :'Data is being loaded , please wait'
    },
     success : {
        title : 'Success' ,
        message : 'Data successfully loaded'
     },
     //if res failure
     reponseFailure:{
          title:'Error',
          message :"an error occurred while fetching response froom the server . Please try again"
     },
     //if request failure
     requestFailure:{
        title :'error' ,
        message:"an error occured while parsing request data"
     },
     netWorkError:{
        title : 'error',
        message : 'unable to connect with the server : please check internet connectivity'
     }
}
//api service call
//sample request
//need service cal : {url:'/' , method : 'post/get/put/delete' params:true/false ,  query:true/false}


export const SERVICE_URLS = {
  
    userSignup : {url: '/signup' , method: 'POST'} ,
    userLogin : {url: '/login' , method: 'POST'},
    
    createRide:{ url : '/create' , method : 'POST'} ,


    getAllRide: { url: '/rides', method: 'GET', params: true },
  

    getRideById: (id) => ({ url: `/rideDetail/${id}`, 
        method: 'GET' }),
    
    deleteRide: (id) => ({ url: `/delete/${id}`, method: 'DELETE' }),

   
    updateRide: { url: '/update', method: 'PUT', query: true },
    
    newReply: { url: '/newReply', method: 'POST' },
    getAllReplies: { url: '/replies', method: 'GET', query: true },

    deleteReply: { url: '/reply/delete', method: 'DELETE', query: true },
    updateReply: { url: '/reply/update', method: 'PUT' },
   
    getReplies: { url: '/allreplies', method: 'GET', params: true },
    contactUs: {url : '/contactUs' , method : 'POST'},
    googleauth:{url: '/google-auth' , method : 'POST' , query : true} ,   
    
    newChat: { url: '/newChat', method: 'POST' },
    getAllChat: { url: '/chats', method: 'GET', query: true },

    newRatings: {url : '/rating' , method : 'POST'},
    getRatings : (username) =>({url : `/ratings/${username}` , method : 'GET' , query : true}),
}


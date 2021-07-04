/* Add your Application JavaScript */
// Instantiate our main Vue Instance
const app = Vue.createApp({
    data() {
        return {

        }
    }
});

app.component('app-header', {
    name: 'AppHeader',
    template: `
    <nav id="navbar1" class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <router-link class="nav-link text-white mr-5" to="/">Educators and Students Interactive System<span class="sr-only">(current)</span></router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse ml-5 float-right" id="navbarSupportedContent">    
      
      <ul  class="navbar-nav mr-auto">
      </ul>
    
      <ul v-if="seen" class="navbar-nav mr-auto">
        <li class="nav-item active">
          <router-link class="nav-link" to="/studentDashboard">Dashboard<span class="sr-only">(current)</span></router-link>
        </li>
        <li class="nav-item active">
          <router-link class="nav-link" to="/catalogue">Catalogue<span class="sr-only">(current)</span></router-link>
        </li>
        <li class="nav-item active">
          <router-link class="nav-link" to="/studentClass">Classes<span class="sr-only">(current)</span></router-link>
        </li>
        <li class="nav-item active">
          <router-link class="nav-link" to="/studentAssignments">Assignments<span class="sr-only">(current)</span></router-link>
        </li>
        <li class="nav-item active">
          <a class="nav-link" @click="myProfile">My Profile<span class="sr-only">(current)</span></a>
        </li>
      </ul>
      <ul  class="navbar-nav mr-auto">
      </ul>
          
      <ul class = "navbar-nav">
        <li v-if="seen" class="nav-item active">
          <a @click="LogoutP" class="nav-link">Logout <span class="sr-only">(current)</span></a>
          <!-- <router-link @click="LogoutP" v-if="seen" class="nav-link" to="/logout">Logout <span class="sr-only">(current)</span></router-link> -->
        </li>
        <div v-else class = "navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/register">Register <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
      
          </li>
        </div>
      </ul>
    </div>
    </nav>
    `,
    created(){
      let self = this;
      self.seen = localStorage.auth;
      console.log(self.seen)
    },
    data() {
      return {
        user: [],
        seen: localStorage.auth,
      }   
  },
  methods: {
    myProfile(){
      let uid = localStorage.uid
      router.push(`/users/${uid}`);

    },
    LogoutP(){
      let self = this;
      var n = document.getElementById('navbar1');
      var content
      //self.seen = false;
      //localStorage.auth = false;
      fetch('/api/auth/logout',{
        method: 'GET',
        headers: {
        Authorization: "Bearer " + localStorage.token,
        'X-CSRFToken': token
      },
      credentials: 'same-origin'
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        console.log(data);
        localStorage.removeItem('uid')
        localStorage.removeItem('token')
        localStorage.removeItem('auth')
        console.log(localStorage)
        //refresh nav
        content = n.innerHTML
        n.innerHTML= content
        router.push('/studentlogin');
      }) 
      .catch(function (error) {
        console.log(error);
      });
    }
    
  }
});

app.component('app-footer', {
    name: 'AppFooter',
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; {{ year }} Flask Inc.</p>
        </div>
    </footer>
    `,
    data() {
        return {
            year: (new Date).getFullYear()
        }
    }
});

//--------------------------------------------------------------
const Home = {
    name: 'Home',
    template: `
    <app-header></app-header>
    <div class="home-page" style="position:absolute; top:0; right:0; bottom:0; left:0; width=100%; background-color:#373737;">
      <div class="row">

        <div class="column" style="float:left; width:50%; padding:50px; height:100%;">
          <div style="display:inline-block; margin:0 auto; padding:70px 70px 70px 70px;">
            <div class="row">
              <h1 style="color:#F77F00;"><strong>Access and Interact with Textbooks and Resources Online</strong></h1>
            </div>

            <div class="row">
              <p style="color:#FFFFFF;">eduSIS provides the fastest, easiest and most user
                 friendly way way for Educators and students to acess books and notes online.
                 Access, complete and view feedback back on assignments, all on this interactive platform.
              </p>
            </div>
          
            <div class="row">
              <div class="col-md-2 mr-auto">
                <button @click="goToEducatorLogin()" type="submit" class="register btn btn-primary btn-lg" style="background-color:#000000; color:#FFFFFF; border:none;">Educator</button>
              </div>

              <div class="col-md-2 mr-auto">
                <button @click="goToStudentLogin()" type="submit" class="login btn btn-primary btn-lg" style="background-color:#F77F00; color:#FFFFFF; border:none;">Student</button>
              </div>
            </div>
          </div>
      </div>

      <div class="column" style="float:left; width:50%;">
          <img class="img-fluid" src="static/logos/Design4.2.jpg" alt="home-img">
       </div>

      </div>
    </div>

    `,
    data() {
        return {}
    },
      methods: {
        goToEducatorLogin(){
          this.$router.push('/educatorlogin');
        },

        goToStudentLogin(){
          this.$router.push('/studentlogin');
        }
    }
};

//--------------------------------------------------------------
const RegistrationForm = {
    name: 'registration-form',
    template: `
    <app-header></app-header>
    <h2 style="padding: 80px 0px 10px 0px; text-align:center;">Register New User</h2>
    
   
    <div v-if="message[0] == 'good'">
        <div class="alert alert-success" role="alert">
            <ul v-for="m in message[1]"> 
                <li>{{ m }}</li>
            </ul>
        </div>
    </div>
    <div v-if="message[0] == 'bad'">
        <div class="alert alert-warning" role="alert">
            <ul v-for="m in message[1]"> 
                <p>{{ m }}</p>
            </ul>
        </div>
    </div>

    <div style=" margin: 0 auto; width:60%; border: 2px solid #F0F0F0; background-color:#FFFFFF; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2); border-radius: 5px;">
      <form @submit.prevent="uploadProfilePhoto" id="uploadprofile" method="post" style="margin: 0 auto; width:70%; padding: 40px 0px 40px 0px;">
          <div class="row">
            <div class= "col">
              <label>Username</label>
              <input type="text" class ="form-control" name="Username" placeholder="jDoe">
            </div>
      
            <div class= "col">
              <label>Password</label>
              <input type="password" class ="form-control" name="Password" placeholder="12%Tjd">
            </div>
          </div>

          <div class="row">
            <div class= "col">
              <label>Full name</label>
              <input type="text" class ="form-control" name="Name" placeholder="Jane Doe">
            </div>
      
            <div class= "col">
              <label>Email</label>
              <input type="email" class ="form-control" name="Email" placeholder="janeDoe@test.com">
            </div>
          </div>

          <div class="row">
            <div class= "col">
              <label>Location</label>
              <input type="text" class ="form-control" name="Location" placeholder="ABC">
            </div>
          </div>
    
          <div class="row">
            <div class= "col">
              <label>AccountType</label>
              <select id="Account_Type" name="Account_Type" class ="form-control"  placeholder="Select Account Type">
                <option value="Educator">Educator</option>
                <option value="Student">Student</option>
              </select>
            </div>
          </div>

          <div class="row">
            <div class= "col">
              <label>Education Level</label>
              <select id="Education_Level" name="Education_Level" class ="form-control"  placeholder="Select your Educator Level">
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
                <option value="Teritiary">Teritiary</option>
              </select>
            </div>
          </div>
      
          <div class = "form-group">
            <label>Upload Photo</label>
            <input class ="form-control" type="file" name="photo">
          </div>

          <button type="submit" name="submit" class="btn btn-primary" style="background-color:#F77F00;">Register</button>
      </form>
    </div>
    `,
    data() {
        return {
            message: []
        }
    },
    methods: {
        uploadProfilePhoto(){
            let self = this;
            let uploadprofile = document.getElementById('uploadprofile');
            let form_data = new FormData(uploadprofile);
  
            fetch("/api/register", {
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                    },
                    credentials: 'same-origin'
                })
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                // display a success message
                console.log(jsonResponse);
                if(jsonResponse.error){
                    self.message = ['bad', jsonResponse.error]
                }
                else{
                    //self.message = ['good',[jsonResponse]]
                }
                
                })
                .catch(function (error) {
                console.log(error);
                });
        }
      }  
};

//--------------------------------------------------------------
const EducatorLogin = {
    name: 'educatorlogin',
    template: `
    <app-header></app-header>
    <div class="login-img">
        <img class="img-fluid" src="static/logos/Design11.jpg" alt="login-img"> 
    </div>

    <div v-if="message[0] == 'good'">
        <div class="alert alert-success" role="alert">
            <ul v-for="m in message[1]" > 
                <li>{{ m }}</li>
            </ul>
        </div>
    </div>
    <div v-if="message[0] == 'bad'">
        <div class="alert alert-warning" role="alert">
            <ul v-for="m in message[1]"> 
                <p>{{ m }}</p>
            </ul>
        </div>
    </div>
    
    <div style=" margin: 0 auto; width:40%; border: 2px solid #F0F0F0; background-color:#FFFFFF; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2); border-radius: 5px;">    
      <h4 style="padding-top:30px; text-align:center;">Login to your account</h4>
        <form @submit.prevent="loginPro" id="loginForm" method="post" style="margin: 0 auto; width:70%; padding: 40px 0px 40px 0px;">

            <div class= "form-group">
              <label>Username</label>
              <input type="text" class ="form-control" id="username" name="Username">
            </div>
      
            <div class= "form-group">
              <label>Password</label>
              <input type="password" class ="form-control" id="password" name="Password">
            </div>
        
            <button type="submit" name="submit" class="btn btn-primary btn-block" style="background-color:#F77F00; border:none;">Login</button>
        </form>
    </div>
    `,
    data() {
        return {
            message: []
        }
    },
    methods: {
      loginPro(){
        let self = this;
        let loginF = document.getElementById('loginForm');
        let form_data = new FormData(loginF);
        var n = document.getElementById('navbar1');
        /* let p = document.getElementById('username').value;
        let l = document.getElementById('password').value;
        console.log(form_data)
        console.log(p)
        console.log(l)*/
        fetch("/api/auth/educatorlogin", {
          method: 'POST',
          body: form_data,
          headers: {
              'X-CSRFToken': token
              },
              credentials: 'same-origin'
          })
          .then(function (response) {
             return response.json();
            })
          .then(function (jsonResponse) {
          // display a success message
            console.log(jsonResponse);
            if(jsonResponse.error){
              self.message = ['bad', jsonResponse.error]
              }
            else{
              self.message = ['good',[jsonResponse.info.message]]
              let token = jsonResponse.info.token
              const tokenParts = token.split('.')
              const payload = JSON.parse(atob(tokenParts[1]))
              //console.log(payload)
              //Store User Infomation in Local Storage
              localStorage.uid = payload.id
              localStorage.token = token
              localStorage.auth = true
              //refresh nav
              content = n.innerHTML;
              n.innerHTML= content;
              router.push('/catalogue');
              }
              })
              .catch(function (error) {
                console.log(error);
              
              });
        }
    }
};

//--------------------------------------------------------------
const StudentLogin = {
    name: 'studentlogin',
    template: `
    <app-header></app-header>
    <div class="login-img">
        <img class="img-fluid" src="static/logos/Design10.jpg" alt="login-img"> 
    </div>

    <div v-if="message[0] == 'good'">
        <div class="alert alert-success" role="alert">
            <ul v-for="m in message[1]" > 
                <li>{{ m }}</li>
            </ul>
        </div>
    </div>
    <div v-if="message[0] == 'bad'">
        <div class="alert alert-warning" role="alert">
            <ul v-for="m in message[1]"> 
                <p>{{ m }}</p>
            </ul>
        </div>
    </div>
    
    <div style=" margin: 0 auto; width:40%; border: 2px solid #F0F0F0; background-color:#FFFFFF; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2); border-radius: 5px;">    
      <h4 style="padding-top:30px; text-align:center;">Login to your account</h4>
        <form @submit.prevent="loginPro" id="loginForm" method="post" style="margin: 0 auto; width:70%; padding: 40px 0px 40px 0px;">

            <div class= "form-group">
              <label>Username</label>
              <input type="text" class ="form-control" id="username" name="Username">
            </div>
      
            <div class= "form-group">
              <label>Password</label>
              <input type="password" class ="form-control" id="password" name="Password">
            </div>
        
            <button type="submit" name="submit" class="btn btn-primary btn-block" style="background-color:#F77F00; border:none;">Login</button>
        </form>
    </div>
    `,
    data() {
        return {
            message: []
        }
    },
    methods: {
      loginPro(){
        let self = this;
        let loginF = document.getElementById('loginForm');
        let form_data = new FormData(loginF);
        var n = document.getElementById('navbar1');
        /* let p = document.getElementById('username').value;
        let l = document.getElementById('password').value;
        console.log(form_data)
        console.log(p)
        console.log(l)*/
        fetch("/api/auth/studentlogin", {
          method: 'POST',
          body: form_data,
          headers: {
              'X-CSRFToken': token
              },
              credentials: 'same-origin'
          })
          .then(function (response) {
             return response.json();
            })
          .then(function (jsonResponse) {
          // display a success message
            console.log(jsonResponse);
            if(jsonResponse.error){
              self.message = ['bad', jsonResponse.error]
              }
            else{
              self.message = ['good',[jsonResponse.info.message]]
              let token = jsonResponse.info.token
              const tokenParts = token.split('.')
              const payload = JSON.parse(atob(tokenParts[1]))
              //console.log(payload)
              //Store User Infomation in Local Storage
              localStorage.uid = payload.id
              localStorage.token = token
              localStorage.auth = true
              //refresh nav
              content = n.innerHTML;
              n.innerHTML= content;
              router.push('/studentDashboard');
              }
              })
              .catch(function (error) {
                console.log(error);
              
              });
        }
    }
};

//------------------------------------------------------------
const Logout = {
    name: 'logout',
    template: `<app-header></app-header>`,
    data() {
        return {
            message: []
        }
    },
    created(){
      fetch('/api/auth/logout',{
        method: 'GET',
        headers: {
        Authorization: "Bearer " + localStorage.token,
        // 'Authorization': 'Bearer <>'
        'X-CSRFToken': token
      },
      credentials: 'same-origin'
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        console.log(data);
        localStorage.removeItem('uid')
        localStorage.removeItem('token')
        localStorage.removeItem('auth')
        console.log(localStorage.auth)
        router.push('/');
      }) 
      .catch(function (error) {
        console.log(error);
      });
      
    }

};

//--------------------------------------------------------------
const Catalogue = {
    name: 'catalogue',
    template: `
    <app-header></app-header>
    <h2 style="text-align:center; padding: 80px 30px 10px 35px;">Catalogue</h2>

    <div style="margin: 0 auto; width:95%; border: 2px solid #F0F0F0; background-color:#FFFFFF; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2); border-radius: 5px; padding:20px; display:block; text-align:center;">
      <form @submit.prevent="searchBook" id="searchForm" method="get" class="form-inline">
        
        <label for="search" style="padding-left:80px;">Title</label>
        <input type="search" name="title" id="title" class="form-control m-2"/>

        <label for="search">Author</label>
        <input type="search" name="author" id="author" class="form-control m-2"/>
        
        <label for="search">ISBN</label>
        <input type="search" name="isbn" id="isbn" class="form-control m-2"/>  
        <div>
          <button class="btn btn-md m2-2 text-white" style="padding:6px 10px 6px 10px; background-color:#04AA6D;">Search</button>
        </div>
        
      </form>
    </div>

    <br>
    <br>

    <div class="book-list d-flex flex-row">
      <ul class="book-list d-flex flex-row flex-wrap">

        <div v-for="book in books" class="card m-2" style="width:21rem;">
          <img v-bind:src=book.photo alt="book photo" class="card-img-top rounded-top" style="width:100%;"/>
          <div class="card-body mb-1">
            <div class="mb-2 d-flex flex-row flex-wrap justify-content-between">
              <div class="mr-0 mb-1">
                <h4 class="mb-0 font-weight-bold">{{book.year}} {{book.title}}</h4>
                <p class="my-1">{{book.author}}</p>
              </div>

              <div class="h-25 p-1 m-1" style="background-color:#04AA6D; border-radius:10px; color:#FFFFFF;">
                {{book.isbn}}
              </div>
            </div>
             
            <div class="card-text mb-1 mt d-flex flex-row flex-wrap">
              <button class="btn btn-primary btn-block mb-2" @click="goToBookDetails(book.id)">ViewDetails</button>
            </div>
          </div>
        </div>
      </ul>
    </div>   
    
    `,
    created() {
      let self = this;
      fetch('/api/books',{
        method: 'GET',
        headers: {
        // JWT requires the Authorization schema to be `Bearer` instead of `Basic`
        Authorization: "Bearer " + localStorage.token,
        'X-CSRFToken': token
      },
      credentials: 'same-origin'
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        console.log(data);
        if(data.code){
          router.push('/studentlogin');
        }
        else{
          self.books = data.books;
        }
        
      });
    },
    data() {
        return {
            books: [],
            message:[]
        }
    },
    methods: {
       searchBook(){
        let self = this;
        let title = document.getElementById('title').value;
        let author = document.getElementById('author').value;
        let isbn = document.getElementById('isbn').value;
        //console.log(model);
        //console.log(make);

        fetch(`/api/search?title=${title}&author=${author}&isbn=${isbn}`, {
            method: 'GET',
            headers: {
              Authorization: "Bearer " + localStorage.token,
                'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
            .then(function (response) {
            return response.json();
            })
            .then(function (jsonResponse) {
            // display a success message
            console.log(jsonResponse);
            if(jsonResponse.error){
                self.message = ['bad', jsonResponse.error]
            }
            self.books = jsonResponse.books;
            
            })
            .catch(function (error) {
            console.log(error);
            });
      },

      goToBookDetails(bid){
        this.$router.push(`/books/${bid}`);

      }
    }
};

//--------------------------------------------------------------
const StudentDashboard = {
    name: 'studentDashboard',
    template: `
    <app-header></app-header>
    <h3 style="text-align:left; padding: 80px 30px 10px 35px;">Dashboard</h3>
    
    <div class="recents">
      <h5 style="text-align:left; padding: 20px 15px 15px 15.5px;">Recent Books</h5>
      <hr>
      <div style="margin: 0 auto; width:95%; border: 2px solid #F0F0F0; background-color:#FFFFFF; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2); border-radius: 5px; padding:20px; display:block; text-align:center;">
      
        <div class="book-list d-flex flex-row">
          <ul class="book-list d-flex flex-row flex-wrap">

          <div v-for="book in books" class="card m-2" style="width:9rem;">
            <img v-bind:src=book.photo alt="book photo" class="card-img-top rounded-top" style="width:100%;"/>
            <div class="card-body mb-1">

              <div class="mb-2 d-flex flex-row flex-wrap justify-content-between">
                <div class="mr-0 mb-1">
                  <h6 class="mb-0 font-weight-bold"><a class="booklink" href="{{url_for('download_file')}}" @click="goToBookDetails(book.id)">{{book.title}} {{book.author}}</a></h6>
                </div>
              </div>   

              <div class="card-text mb-1 mt d-flex flex-row flex-wrap">
                <button class="btn btn-primary btn-block mb-2" @click="goToBookDetails(book.id)">ViewDetails</button>
              </div>

            </div>
          </div>
          </ul>
        </div>
      </div>
    </div>

    <br>
    <br>

    <div class="catalogue">
      <h5 style="text-align:left; padding: 40px 30px 10px 35px;">Catalogue</h5>
      <hr>
      <div class="book-list d-flex flex-row">
        <ul class="book-list d-flex flex-row flex-wrap">

          <div v-for="book in books" class="card m-2" style="width:18rem;">
            <img v-bind:src=book.photo alt="book photo" class="card-img-top rounded-top" style="width:100%;"/>
            <div class="card-body mb-1">
              <div class="mb-2 d-flex flex-row flex-wrap justify-content-between">
                <div class="mr-0 mb-1">
                  <h4 class="mb-0 font-weight-bold"><a class="booklink" href="default.asp" @click="goToBookDetails(book.id)">{{book.title}}</a></h4>
                  <p class="my-1" style="color:#000000;">{{book.author}} {{book.year}}</p>
                </div>

                <div class="h-25 p-1 m-1" style="background-color:#04AA6D; border-radius:10px; color:#FFFFFF;">
                  {{book.isbn}}
                </div>
              </div>
               
              <div class="card-text mb-1 mt d-flex flex-row flex-wrap">
                <button class="btn btn-primary btn-block mb-2" @click="goToBookDetails(book.id)">ViewDetails</button>
              </div>
            </div>
          </div>
        </ul>
      </div>   
    </div>
    
    `,
    created() {
      let self = this;
      fetch('/api/books',{
        method: 'GET',
        headers: {
        // JWT requires the Authorization schema to be `Bearer` instead of `Basic`
        Authorization: "Bearer " + localStorage.token,
        'X-CSRFToken': token
      },
      credentials: 'same-origin'
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        console.log(data);
        if(data.code){
          router.push('/studentlogin');
        }
        else{
          self.books = data.books;
        }
        
      });
    },
    data() {
        return {
            books: [],
            message:[]
        }
    },
    methods: {
       searchBook(){
        let self = this;
        let title = document.getElementById('title').value;
        let author = document.getElementById('author').value;
        let isbn = document.getElementById('isbn').value;
        //console.log(model);
        //console.log(make);

        fetch(`/api/search?title=${title}&author=${author}&isbn=${isbn}`, {
            method: 'GET',
            headers: {
              Authorization: "Bearer " + localStorage.token,
                'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
            .then(function (response) {
            return response.json();
            })
            .then(function (jsonResponse) {
            // display a success message
            console.log(jsonResponse);
            if(jsonResponse.error){
                self.message = ['bad', jsonResponse.error]
            }
            self.books = jsonResponse.books;
            
            })
            .catch(function (error) {
            console.log(error);
            });
      },

      goToBookDetails(bid){
        this.$router.push(`/books/${bid}`);

      }
    }
};

//--------------------------------------------------------------
const StudentClass = {
    name: 'studentClass',
    template: `
    <app-header></app-header>
    <h4 style="text-align:left; padding: 80px 30px 10px 35px;">Classes</h4>

      <div style="margin: 0 auto; width:95%; border: 2px solid #F0F0F0; background-color:#FFFFFF; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2); border-radius: 5px; padding:20px; display:block; text-align:left;">
        <ul class="class-list d-flex flex-row flex-wrap">
            <div v-for="clas in classes">
              <p class="my-1">{{clas.course_code}}: {{clas.course_title}}</p>
            </div>
        </ul>
        <p>No Classes</p> 
      </div>
    `,    
    created() {
      let self = this;
      fetch('/api/classes',{
        method: 'GET',
        headers: {
        // JWT requires the Authorization schema to be `Bearer` instead of `Basic`
        Authorization: "Bearer " + localStorage.token,
        'X-CSRFToken': token
      },
      credentials: 'same-origin'
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        console.log(data);
        if(data.code){
          router.push('/studentlogin');
        }
        else{
          self.classes = data.classes;
        }
        
      });
    },
    data() {
        return {
            classes: [],
            message:[]
        }
    }

};

//--------------------------------------------------------------
const StudentAssignments = {
    name: 'studentAssignments',
    template: `
    <app-header></app-header>
    <h4 style="text-align:left; padding: 80px 30px 10px 35px;">Assignments</h4>

      <div style="margin: 0 auto; width:95%; border: 2px solid #F0F0F0; background-color:#FFFFFF; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2); border-radius: 5px; padding:20px; display:block; text-align:left;">
        <ul class="class-list d-flex flex-row flex-wrap">
            <div v-for="clas in classes">
              <p class="my-1">{{clas.course_code}}: {{clas.course_title}}</p>
            </div>
        </ul>
        <p>No Assignments</p> 
      </div>

      <br>
      <br>

      <div style="margin: 0 auto; width:95%; border: 2px solid #F0F0F0; background-color:#FFFFFF; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2); border-radius: 5px; padding:20px; display:block; text-align:left;">
        <div class = "form-group">
            <label>Upload Photo</label>
            <input class ="form-control" type="file" name="photo">
        </div>

        <div style="width:20%;">
          <button type="submit" name="submit" class="btn btn-primary btn-block" style="background-color:#F77F00; border:none;">Save</button>
        </div>
      </div>
    `,    
    created() {
      let self = this;
      fetch('/api/classes',{
        method: 'GET',
        headers: {
        // JWT requires the Authorization schema to be `Bearer` instead of `Basic`
        Authorization: "Bearer " + localStorage.token,
        'X-CSRFToken': token
      },
      credentials: 'same-origin'
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        console.log(data);
        if(data.code){
          router.push('/studentlogin');
        }
        else{
          self.classes = data.classes;
        }
        
      });
    },
    data() {
        return {
            classes: [],
            message:[]
        }
    }

};

//--------------------------------------------------------------
const BookDetails = {
  name: 'book-details',
  template: `
  <app-header></app-header>
  <div class="container-fluid mb-5">
    <div class="card mb-5 w-100" style="flex-direction: row;">
      <img v-bind:src = book.photo class="card-img w-50" alt="Book Cover">
      <div class="card-body">
        <h1 class="card-title font-weight-bold mb-1">{{book.title}}</h1>
        <h4 class="card-title text-muted mt-1 mb-4">{{book.author}}</h4>

        <br>

        <div class="row">
          <div class="col d-flex flex-row flex-wrap">            
            <p class="card-text">Publisher: &nbsp</p>
            <p class="card-text font-weight-bold">{{book.publisher}}</p>
          </div>
        </div>

        <div class="row">
          <div class="col d-flex flex-row flex-wrap">
            <p class="card-text">Subject: &nbsp &nbsp &nbsp</p>
            <p class="card-text font-weight-bold">{{book.year}}</p> 
          </div>      
        </div>

        <div class="row">
          <div class="col d-flex flex-row flex-wrap">
            <p class="card-text">ISBN: &nbsp &nbsp &nbsp</p>
            <p class="card-text font-weight-bold">{{book.isbn}}</p> 
          </div>       
        </div>            
        
        <br>
        <br>
        
        <div class="mx-3" id="prop-btn">
          <div class="row">
            <a @click="addToFavourites(book.id)" class="col clickable" >
              <img id="like-img" alt="Like" class="m-2 float-right" style="width: 15%;" src="/icon/like.png">
            </a>
        </div>


        <!--<button type="submit" name="submit" class="btn btn-primary" @click="addToFavourites(book.id)">Like</button>-->  

        </div>
      </div>
    </div>
  </div>
  `,
  data() {
      return {
          book: [],
          message: []
      }
  },
  methods: {
    addToFavourites(book_id){
      let self = this;
      let host = window.location.protocol + "//" + window.location.host;
      //fetch(`api/books/${book_id}/favourite`,{
      fetch(`${host}/api/books/${book_id}/favourite`,{
        method: 'POST',
        headers: {
          Authorization: "Bearer " + localStorage.token,
          'X-CSRFToken': token
          },
          credentials: 'same-origin'
      })
          .then(function (response) {
            return response.json();
      })
             .then(function(data){
                console.log(data);
                //self.book = data.book;
      });
    }
  },
  created() {
    let self = this;
    fetch(`/api/books/${self.$route.params.book_id}`,{
      method: 'GET', 
      headers: {
      Authorization: "Bearer " + localStorage.token,
      // 'Authorization': 'Bearer <>'
      'X-CSRFToken': token
    },
    credentials: 'same-origin'
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data);
      self.book = data.book;

    });
  },
};

//--------------------------------------------------------------
const User = {
  name: 'user',
  template:`
    <app-header></app-header>
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 mt-3">
            <div class="card"  style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);">
              <div class="card-horizontal"> 
                <div class="card-img" style="width:10%;"> 
                  <img v-bind:src = user.photo class="card-img-top" alt="profilephoto" id="profilephoto" style="border-radius:50%;padding:20px;">
                </div>  

                <div class="card-body text-left w-75 p-5">
                  <h2 class="card-title font-weight-bold">{{user.name}}</h2>
                  <h4 class="card-title text-muted">@{{user.username}}</h4>
                  <br>
                  <div class="mb-1 d-flex flex-row flex-wrap">
                    <p class="card-text text-left">Email:  &nbsp &nbsp &nbsp &nbsp  &nbsp</p>
                    <p class="card-text text-left font-weight-bold">{{user.email}}</p>
                  </div>
                  <div class="mb-1 d-flex flex-row flex-wrap">
                    <p class="card-text text-left">Education:  &nbsp &nbsp &nbsp &nbsp  &nbsp</p>
                    <p class="card-text text-left font-weight-bold">{{user.education_level}}</p>
                  </div>
                  <div class="mb-1 d-flex flex-row flex-wrap">
                    <p class="card-text text-left">Location:   &nbsp &nbsp</p>
                    <p class="font-weight-bold">{{user.location}}</p>
                  </div>
                  <div class="mb-1 d-flex flex-row flex-wrap">
                    <p class="card-text text-left">Joined:  &nbsp &nbsp &nbsp  &nbsp</p>
                    <p class="font-weight-bold">{{user.date_joined}}</p>
                  </div> 
                </div>   
              </div> 
            </div>
          </div>
        </div> 
      </div>
    <br>

    <div>
      <h2 class="text-left font-weight-bold" style="padding: 10px 70px 10px 60px;">Books Favourited</h2>
    </div>

    <div class="book-list d-flex flex-row">
      <ul class="book-list d-flex flex-row flex-wrap">

        <div v-for="book in favourites" class="card m-2" style="width:21rem;">
          <img v-bind:src=book.photo alt="book photo" class="card-img-top rounded-top" style="width:100%;"/>
          <div class="card-body mb-1">
            <div class="mb-2 d-flex flex-row flex-wrap justify-content-between">
              <div class="mr-0 mb-1">
                <h4 class="mb-0 font-weight-bold">{{book.title}} {{book.author}}</h4>
                <p class="my-1">{{book.publisher}}</p>
              </div>

              <div class="h-25 p-1 m-1" style="background-color:#04AA6D; border-radius:10px; color:#FFFFFF;">
                <img class="pr-1" src="/icon/iconfinder_tag.png" style="">{{book.isbn}}
              </div>
            </div>
             
            <div class="card-text mb-1 mt d-flex flex-row flex-wrap">
              <button class="btn btn-primary btn-block mb-2" @click="goToBookDetails(book.id)">ViewDetails</button>
            </div>
          </div>
        </div>
      </ul>
    </div>

    <br>
    <br>

    <div style="padding-left: 60px;">
      <div style="width:20%;">
        <button type="submit" name="submit" class="btn btn-primary btn-block" style="background-color:#F77F00; border:none;">Generate Progress Report</button>
      </div>
    </div>
  `,
    created()
    {
      let self = this;
      let uid = localStorage.uid

      fetch(`/api/users/${self.$route.params.user_id}`, {
          method: 'GET',
          headers: {
            Authorization: "Bearer " + localStorage.token,
              'X-CSRFToken': token
              },
              credentials: 'same-origin'
          })
             .then(function(response){
                return response.json();
             })
             .then(function(data){
                console.log(data);
                if(data.code){
                  router.push('/studentlogin');
                }
                self.user = data.user;
             });

      fetch(`/api/users/${uid}/favourites`, {
              method: 'GET',
              headers: {
                Authorization: "Bearer " + localStorage.token,
                  'X-CSRFToken': token
                  },
                  credentials: 'same-origin'
              })
                 .then(function(response){
                    return response.json();
                 })
                 .then(function(data){
                    console.log(data);
                    self.favourites = data.books;
                 });
    },
    methods: {
      goToBookDetails(cid){
        this.$router.push(`/books/${bid}`);

      }
    },
    data(){
      return{
        user: [],
        favourites: []
  
      }
  }
};

//--------------------------------------------------------------
const BookForm = {
    name: 'upload-form',
    template: `
    <app-header></app-header>
    <h2 style="padding: 80px 70px 10px 110px;">Add New Book</h2>
    <div v-if="message[0] == 'good'">
        <div class="alert alert-success" role="alert">
            <ul v-for="m in message[1]" > 
                <li>{{ m }}</li>
            </ul>
        </div>
    </div>
    <div v-if="message[0] == 'bad'">
        <div class="alert alert-warning" role="alert">
            <ul v-for="m in message[1]"> 
                <p>{{ m }}</p>
            </ul>
        </div>
    </div>
    <div style=" margin: 0 auto; width:60%; border: 2px solid #F0F0F0; background-color:#FFFFFF; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2); border-radius: 5px;">
    <form @submit.prevent="uploadBookPhoto" id="uploadBook" method="post" style="margin: 0 auto; width:80%; padding: 40px 0px 40px 0px;">
        <div class="row">
          <div class= "col">
            <label>Title</label>
            <input type="text" class ="form-control" name="Title" placeholder="Title">
          </div>
        </div>

        <div class="row">
          <div class= "col">
            <label>Author</label>
            <input type="text" class ="form-control" name="author"  placeholder="author">
          </div>
        </div>

        <div class="row">  
          <div class= "col">
            <label>Year</label>
            <input type="text" class ="form-control" name="Year"  placeholder="year">
          </div>
        </div>
  
        <div class="row">
          <div class= "col">
            <label>Publisher</label>
            <input type="text" class ="form-control" name="publisher"  placeholder="publisher">
        </div>

        <div class="row">
          <div class= "col">
            <label>ISBN</label>
            <input type="text" class ="form-control" name="isbn"  placeholder="isbn">
          </div>

          <div class= "col">
            <label>Subject</label>
            <select id="Subject" name="Subject" class ="form-control"  placeholder="Select Subject">
              <option value="Accounts">Accounts</option>
              <option value="Biology">Biology</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Computer Science">Computer Science</option>
              <option value="English">English</option>
              <option value="Mathematics">Mathematics</option>
            </select>
          </div>  
        </div>

        <div class="row">
          <div class= "col">
            <label>Upload Photo</label>
            <input class ="form-control" type="file" name="photo"> 
          </div> 
        </div>
            
        <div>
            <button type="submit" name="submit" class="btn btn-primary" style="background-color:#F77F00; border:none;">Save</button>
          </div>
        </div>  

        <input type="hidden" class ="form-control" name="User" :value=uid>


      </form>
    </div>
    `,
    data() {
        return {
            message: [],
            uid: localStorage.uid
        }
    },
    methods: {
        uploadBookPhoto(){
            let self = this;
            let uploadBook = document.getElementById('uploadBook');
            let form_data = new FormData(uploadBook);
  
            fetch("/api/books", {
                method: 'POST',
                body: form_data,
                headers: {
                    Authorization: "Bearer " + localStorage.token,
                    'X-CSRFToken': token
                    },
                    credentials: 'same-origin'
                })
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                // display a success message
                console.log(jsonResponse);
                if(jsonResponse.error){
                    self.message = ['bad', jsonResponse.error]
                }
                else if(jsonResponse.code){
                  self.message = ['bad', ["Please Login"]]
                  router.push('/studentlogin');
                }
                else{
                    self.message = ['good',["Book Sucessfully Added"]]
                }
                
                })
                .catch(function (error) {
                console.log(error);
                });
        }
    }
};

const NotFound = {
    name: 'NotFound',
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data() {
        return {}
    }
};

// Define Routes
const routes = [
    { path: "/", component: Home },
    // Put other routes here
    { path: '/register', component: RegistrationForm },
    { path: '/educatorlogin', component: EducatorLogin },
    { path: '/studentlogin', component: StudentLogin },
    { path: '/logout', component: Logout },
    { path: '/catalogue', component: Catalogue }, 
    { path: '/studentDashboard', component: StudentDashboard },
    { path: '/studentClass', component: StudentClass },
    { path: '/studentAssignments', component: StudentAssignments },
    { path: '/users/:user_id', component: User },
    { path: '/books/new', component: BookForm },
    { path: '/books/:book_id', component: BookDetails },
    // This is a catch all route in case none of the above matches
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes, // short for `routes: routes`
});

app.use(router);

app.mount('#app');
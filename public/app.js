// main vue script don't really need other scripts but for organisation u may need

const vue = Vue.createApp({
    data() { // Data or variables in a vue app
        return {
            templateList: [],
            index: 0,
            admin: false,
            socket: null,
            ip: ""
        }
    },
    async created() { // when the app is created/initialized
        this.socket = io.connect("http://localhost:3010"); // connect to a socket
        
        this.socket.on('connect', () => { // on socket connect
            console.log("connected to server")
        });

        this.loginTest() // check if already logged in

        // on created get the list right away
        try {
            this.templateList = await (await fetch('http://localhost:3010/templateList')).json();
            this.saveToLocalStorage()
        } catch(err){
            console.log(err)
        }
        
    },
    socket: {
        connect: () => {console.log("connected")}
    },
    methods: { // methods should be here | methods that are here sould always be async
        getTemplateLists: async function() { // get the templateLists
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            };

            await fetch("http://localhost:3010/templateList", requestOptions)
            .then(response => response.json()) // turn response into json
            .then(data => { // do what you want
                this.templateList = data;
            })
        },
        getListById: async function(id) { // get a single list via ID
            
        },
        showDetailsOfAList: async function(event) { // show the details of a single list
            let list_id = event.target.parentElement.id; // get current list if via parentElement.id

            // set global list index to list id for deletion purposes
            this.index = list_id

            // set the values of the details modal
            document.querySelector("#extraText").textContent = this.templateList[list_id-1].extraText // set extra text element to extra text of the list
            document.querySelector(".detailsModal-title").textContent = this.templateList[list_id-1].name // set name element to name of the list
        },
        addNewList: async function(event) { // add a new list to the main api server
            let name = document.querySelector('#newListName').value
            let extraText = document.querySelector('#newListExtraText').value

            // create the list
            let new_list = {id: this.templateList.length+1, name: name, extraText: extraText}

            const request = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(new_list)
            }
            
            await fetch("http://localhost:3010/templateList/addList", request)
        },
        deleteList: async function(event) { // send delete request to delete a list via the global list index
            const request = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id: this.index})
            }

            await fetch("http://localhost:3010/templateList/deleteList", request)

            // re update the list
            this.updateTemplateLists()
        },
        getUpdatingListData: async function() { // update edit modal inputs
            let list = this.templateList[this.index-1]

            document.querySelector("#updateListNameField").value = list.name
            document.querySelector("#updateListExtraTextField").value = list.extraText
        },
        updateList: async function(event) { // send update request to update a certain lsit
            let name = document.querySelector("#updateListNameField").value
            let extraText = document.querySelector("#updateListExtraTextField").value

            let updatedList = {id: this.index, name: name, extraText: extraText} // new list

            const request = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedList)
            }

            await fetch("http://localhost:3010/templateList/updateList", request)
        },
        updateTemplateLists: async function() { // for updating the list again
            this.templateList = await (await fetch('http://localhost:3010/templateList')).json();
        },
        loginTest: async function() { // check if already is logged in via session cookie
            await fetch('http://localhost:3010/loginTest')
            .then(response => response.json())
            .then(data => {
                this.admin = data
            })
        },
        login: async function(event) { // request a login and login
            event.preventDefault() // stop from refreshing due to being in a form
            // get username and password
            let username = document.querySelector('#loginUsernameField').value
            let password = document.querySelector('#loginPasswordField').value

            const request = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({username: username, password: password})
            }

            await fetch("http://localhost:3010/user", request)
            .then(response => response.json())
            .then(data => { // in this case the data is only the is_admin a true or false value
                this.admin = data; 
                $('#loginModal').modal('hide'); // hide the modal
            })
            .catch(() => {
                console.log("error")
            })
        },
        logout: async function() { // request logout
            await fetch('http://localhost:3010/logout')
            this.admin = false
        },
        saveToLocalStorage: async function() { // save to local storage the templateList
            localStorage.setItem('TemplateLists', JSON.stringify(this.templateList));
        },
    }
}).mount('#app'); // mounting the app
function login(){

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const data = localStorage.getItem(email);

    if(!data){
        alert("Account Not Found");
        return;
    }

    const user = JSON.parse(data);

    if(user.password !== password){
        alert("Wrong Password");
        return;
    }

    sessionStorage.setItem("currentUser", email);

    window.location.href = "home.html";
}
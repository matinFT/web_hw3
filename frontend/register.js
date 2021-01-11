var domain = 'https://localhost:8080';
fetch(domain + '/api/admin/post/crud/*id')
    .then(function (response) {
        return response.json();
    })
    .then(function (myJson) {

    })
    .catch(function (error) {
        console.log("Error: " + error);
        myJson = {
            "posts": [
                {
                    "id": 1,
                    "title": "Post Title",
                    "content": "Post Content",
                    "created_by": 1,
                    "created_at": "2020/12/19"
                },
                {
                    "id": 2,
                    "title": "Post2 Title",
                    "content": "Post2 Content",
                    "created_by": 2,
                    "created_at": "2020/12/19"
                }
            ]
        }
        myJson = myJson['posts'];
        for (const post of myJson) {
            var card_div = document.createElement('div');
            card_div.className = 'card';
            card_div.style.margin = '15px';
            var card_body_div = document.createElement('div');
            card_body_div.className = 'card-body';
            var card_title = document.createElement('h4');
            card_title.className = 'card-title';
            card_title.innerHTML = 'عنوان: ' + post['title'];
            var card_text1 = document.createElement('p');
            card_text1.className = 'card-text';
            card_text1.innerHTML = 'شناسه: ' + post['id'];
            var card_text2 = document.createElement('p');
            card_text2.className = 'card-text';
            card_text2.innerHTML = 'محتوا: ' + post['content'];
            var card_text3 = document.createElement('p');
            card_text3.className = 'card-text';
            card_text3.innerHTML = 'شناسه نویسنده: ' + post['created_by']
            var card_text4 = document.createElement('p');
            card_text4.className = 'card-text';
            card_text4.innerHTML = 'تاریخ ایجاد شدن: ' + post['created_at'];
            card_body_div.appendChild(card_title);
            card_body_div.appendChild(card_text1);
            card_body_div.appendChild(card_text2);
            card_body_div.appendChild(card_text3);
            card_body_div.appendChild(card_text4);
            card_div.appendChild(card_body_div);
            document.getElementsByClassName('all-posts')[0].appendChild(card_div);
        }
    });


function register() {
    elem = document.getElementById("register-button");
    if (!elem.classList.contains("form-btn-active")) {
        elem.classList.toggle("form-btn-active");
        document.getElementById("enter-button").classList.toggle("form-btn-active");
        document.getElementById("register-form").style.display = "block";
        document.getElementById("enter-form").style.display = "none";
    }

}

function enter() {
    elem = document.getElementById("enter-button");
    if (!elem.classList.contains("form-btn-active")) {
        elem.classList.toggle("form-btn-active");
        document.getElementById("register-button").classList.toggle("form-btn-active");
        document.getElementById("register-form").style.display = "none";
        document.getElementById("enter-form").style.display = "block";
    }

}

function submit_register() {
    let register_form = document.forms["register-form"];
    if (!ValidateEmail(register_form["Email"].value)) {
        document.getElementById("register-error-text").innerText = "ایمیل نامعتبر"
        register_form["Email"].focus();
    }
    else if (register_form["Password"].value == '') {
        document.getElementById("register-error-text").innerText = "لطفا رمز عبور را وارد کنید"
        register_form["Password"].focus();
    }
    else if (register_form["Password"].value != register_form["RepeatePassword"].value) {
        document.getElementById("register-error-text").innerText = "عدم یکسان بودن رمزهای عبور"
        register_form["RepeatePassword"].focus();
    }
    else if (!register_form["terms-checkbox"].checked) {
        document.getElementById("register-error-text").innerText = "عدم قبول قوانین و شرایط"
        register_form["terms-checkbox"].focus();
    }
    else {
        remove_error("register-error-message");
        
        return
    }
    let error_element = document.getElementById("register-error-message");
    error_element.style.opacity = 1;
    error_element.style.visibility = "visible";
}

function submit_enter() {
    let enter_form = document.forms["enter-form"];
    if (!ValidateEmail(enter_form["Email"].value)) {
        document.getElementById("enter-error-text").innerText = "ایمیل نامعتبر"
        enter_form["Email"].focus();
    }
    else if (enter_form["Password"].value == "") {
        document.getElementById("enter-error-text").innerText = "لطفا رمز عبور را وارد کنید"
        enter_form["Password"].focus();
    }
    else {
        remove_error("enter-error-message")
        return
    }
    let error_element = document.getElementById("enter-error-message");
    error_element.style.opacity = 1;
    error_element.style.visibility = "visible";

}

function remove_error(form_id) {
    document.getElementById(form_id).style.opacity = 0
    document.getElementById(form_id).style.visibility = "hidden"
}

function ValidateEmail(mail) {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
        return (true)
    }
    return (false)
}
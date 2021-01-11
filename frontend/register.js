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
    if (!ValidateEmail(register_form["Email"].value)){
        document.getElementById("register-error-text").innerText = "ایمیل نامعتبر"
        register_form["Email"].focus();
    }
    else if (register_form["Password"].value == ''){
        document.getElementById("register-error-text").innerText = "لطفا رمز عبور را وارد کنید"
        register_form["Password"].focus();
    }
    else if (register_form["Password"].value != register_form["RepeatePassword"].value){
        document.getElementById("register-error-text").innerText = "عدم یکسان بودن رمزهای عبور"
        register_form["RepeatePassword"].focus();
    }
    else if (!register_form["terms-checkbox"].checked){
        document.getElementById("register-error-text").innerText = "عدم قبول قوانین و شرایط"
        register_form["terms-checkbox"].focus();
    }
    else {
        remove_error("register-error-message")
        return
    }
    let error_element = document.getElementById("register-error-message");
    error_element.style.opacity = 1;
    error_element.style.visibility = "visible";
}

function submit_enter() {
    let enter_form = document.forms["enter-form"];
    if (!ValidateEmail(enter_form["Email"].value)){
        document.getElementById("enter-error-text").innerText = "ایمیل نامعتبر"
        enter_form["Email"].focus();
    }
    else if (enter_form["Password"].value == ""){
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